import { ValidateProps } from '@/api-helper/constants';
import { insertDocument, findFormById } from '@/api-helper/database';
import { authorizeAPI, database, validateBody, cors } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import { ObjectID } from 'bson';
import next from 'next';
import nc from 'next-connect';
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');

import setting from '/pages/api/data/setting.json';

const handler = nc(ncOpts);

handler.use(cors, authorizeAPI, database);
handler.options(async (req, res) => {
    return res.status(200).json({});

});


handler.post(
    validateBody({
        type: 'object',
        properties: {
            states: ValidateProps.form.states,
        },
        required: ['states'],
        additionalProperties: true,
    }), async (req, res, next) => {


        let { states } = req.body;

        const form = await findFormById(req.db, req.query.formId);

        if (!form)
            return res.status(403)
                .json({ error: { states, message: 'Form Not Found.' } });

        const formStates = form.states;
        let errorMessage = form.setting['errorMessage'];

        let isValid = true;
        Object.keys(states).forEach((key) => {
            const fieldData = states[key];
            const stateData = formStates[key];
            const regexString = stateData.regex;
            const regex = new RegExp(regexString);
            if ((stateData.required && !fieldData) || !regex.test(fieldData)) {
                stateData.error = 1;
                isValid = false;
            }
            else {
                stateData.error = 0;
            }
        });

        if (!isValid)
            return res.status(403).json({
                error: { states, message: errorMessage.defaultValue || 'Something Went Wrong.' }
            });

        let from = form.setting['from'];
        let to = form.setting['to'];
        let subject = form.setting['subject'];


        let transporter = nodemailer.createTransport({
            host: setting.email.host,
            port: setting.email.port,
            secure: setting.email.secure,
            ignoreTLS: true,
            //  auth: setting.email.auth
        });

        const { html, body, head, footer, plain } = form.emailbody || {};

        const email = html == 1 ? `<!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          ${head}
        </head>
        <body>
        ${body}
        ${footer}
        </body>
        </html>` : plain;

        let compiledTemplate = handlebars.compile(email);
        let compiledSubject = handlebars.compile(subject ? subject.defaultValue : setting.email.subject);

        let content = compiledTemplate(states);
        subject = compiledSubject(states);

        try {
            const info = await transporter.sendMail({
                from: from ? from.defaultValue : setting.email.from,
                to: to ? to.defaultValue : setting.email.to,
                subject: subject ? subject.defaultValue : setting.email.subject,
                [html == 1 ? 'html' : 'text']: content
            });


            if (form.record)
                next();
            else
                res.json({ status: true });

        } catch (e) {

            return res.status(403)
                .json({ error: { message: errorMessage.defaultValue || 'Something Went Wrong.' } });
        }

    },
    async (req, res) => {

        let { states } = req.body;

        const form = await findFormById(req.db, req.query.formId);

        if (!form)
            return res.status(403)
                .json({ error: { message: 'Form Not Found.' } });

        const formStates = form.states;

        Object.keys(states).forEach((key) => {
            states[key] = formStates[key];
        });

        insertDocument(req.db, form.slug, {
            name: form.name + "  " + new Date(),
            states
        });

        res.json({ status: true });

    }
);

export default handler;
