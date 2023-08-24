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
  

handler.get(async (req, res) => {



    const form = await findFormById(req.db, req.query.formId);

    if (!form)
        return res.status(403).status(403)
            .json({ error: { message: 'Form Not Found.' } });

    try {

        const stream = new Readable({
            objectMode: true,
            read() { }
          });
   
          form.styles = {};
          const chunkStr = JSON.stringify(form) + '\n';
          stream.push(chunkStr);
      
      
          const components = form.components || [];
      
          for (let i = 0; i < components.length; i++) {
            const component = await findComponentById(req.db,components[i]);
            if (component) {
              const chunkStr = JSON.stringify(component) + '\n';
              stream.push(chunkStr);
            }
          }
      
      
          stream.push(null);
      
          res.setHeader('Transfer-Encoding', 'chunked');
          res.setHeader('Content-Type', 'application/json');
          stream.pipe(res);


    } catch (e) {


        res
            .status(403)
            .json({ error: { message: 'Something went wrong.' } });
        return;
    }
});

handler.post(
    validateBody({
        type: 'object',
        properties: {
            name: ValidateProps.form.name,
            slug: ValidateProps.form.slug,
            states: ValidateProps.form.states,
            setting: ValidateProps.form.setting,
            emailbody: ValidateProps.form.emailbody,
        },
        required: ['name', 'slug', 'emailbody'],
        additionalProperties: true,
    }),
    async (req, res) => {


        const form = await findFormById(req.db, req.query.formId);

        if (!form)
            return res.status(403).status(403)
                .json({ error: { message: 'Form Not Found.' } });

        const { name, slug, record, emailbody, states, setting} = req.body;



        const fo = await findFormByName(req.db, slug);
        if (fo) {
            if (req.query.formId !== fo._id.toString()) {
                res
                    .status(403)
                    .json({ error: { message: 'The form slug has already been used.' } });
                return;
            }
        }

        if (await findCollectionByName(req.db, slug)) {
            res
              .status(403)
              .json({ error: { message: 'The collection slug has already been used.' } });
            return;
          }

        try {
            const updated = await updateFormById(req.db, form._id, {
                name, slug, record, emailbody, setting, states,
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

handler.patch(
    validateBody({
        type: 'object',
        properties: {
            elements: ValidateProps.page.elements,
            styles: ValidateProps.page.styles,
            components: ValidateProps.page.components,
        },
        required: ['elements', 'styles', 'components', 'forms'],
        additionalProperties: true,
    }),
    async (req, res) => {

        const form = await findFormById(req.db, req.query.formId);


        if (!form)
            return res.status(403).status(403)
                .json({ error: { message: 'Form Not Found.' } });

        try {
            const { elements, styles, components, creator } = req.body;


            const updated = await updateFormById(req.db, form._id, {
                elements,
                styles,
                components,
                updater: creator,
                updatedAt: new Date(),
            });
            return res.json({ form: updated.value, status: true });

        } catch (e) {
            res
                .status(403)
                .json({ error: { message: 'Something went wrong.' } });
            return;
        }
    }
);

handler.delete(async (req, res) => {

    const form = await deleteFormById(req.db, req.query.formId);

    if (!form)
        return res.status(403)
            .json({ error: { message: 'Form Not Found.' } });

    try {

        const form = await deleteFormById(req.db, req.query.formId);

        if (!form)
            return res.status(403)
                .json({ error: { message: 'Form Not Found.' } });

     
        res.json({ status: true });

    } catch (e) {
        res
            .status(403)
            .json({ error: { message: 'Something went wrong.' } });
        return;
    }
});




export default handler;