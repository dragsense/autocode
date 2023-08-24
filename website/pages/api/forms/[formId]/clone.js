import { findFormById, deleteFormById, findFormByName, dropCollection, findCollectionByName, updateFormById, findColelctionById } from '@/api-helper/database';
import { ValidateProps } from '@/api-helper/constants';
import { authorizeAPI, database, validateBody, cors } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
import forms from '../../data/forms.json';
import { v4 as uuid } from 'uuid';
import { saveData } from '@/lib/saveData';
const handler = nc(ncOpts);
var fs = require('fs');
const { Readable } = require('stream');

var path = require('path');
var sourceDir = path.join('', "./pages/api/data");
const dir = `${sourceDir}/forms.json`;

handler.use(cors, authorizeAPI, database);

handler.options(async (req, res) => {
    return res.status(200).json({});

});


handler.post(
    validateBody({
        type: 'object',
        properties: {
        },
        required: [],
        additionalProperties: true,
    }),
    async (req, res) => {

        let { creator } = req.body;

        const form = await findFormById(req.db, req.query.formId);

        if (!form)
            return res.status(403).status(403)
                .json({ error: { message: 'Form Not Found.' } });

        const { name,
            slug,
            record,
            emailbody,
            states,
            setting,
            elements,
            components,
            styles,
             } = form;


        try {
            const fm = await insertForm(req.db, {
                name: name + "_copy",
                slug: slug + "_copy",
                record,
                emailbody,
                states,
                setting,
                elements,
                components,
                styles,
                creator
            });




            elements[0].form = { _id: fm._id };


            const updated = await updateFormById(req.db, fm._id, {
                elements,
            });

            return res.json({ form: updated.value });

        } catch (e) {


            res
                .status(403)
                .json({ error: { message: 'Something went wrong.' } });
            return;
        }
    }
);








export default handler;