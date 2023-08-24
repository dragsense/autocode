import { findColelctionById, findCollectionByName,
     findFormByName, deleteCollectionById, dropCollection, updateCollectionById, findFormById } from '@/api-helper/database';
import { authorizeAPI, database } from '@/api-helper/middlewares';
import { ValidateProps } from '@/api-helper/constants';
import { validateBody, cors } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
import { saveData } from '@/lib/saveData';
const { Readable } = require('stream');

import collections from '../../data/collections.json';

var fs = require('fs');

var path = require('path');
var sourceDir = path.join('', "./pages/api/data");
const dir = `${sourceDir}/collections.json`;

const handler = nc(ncOpts);

handler.use(cors, database, authorizeAPI);
handler.options(async (req, res) => {
    return res.status(200).json({});
  
  });
  
handler.get(async (req, res) => {

    const collection = await findColelctionById(req.db, req.query.collectionId);


    if (!collection)
        return res.status(403).status(403)
            .json({ error: { message: 'Collection Not Found.' } });

    try {


        const stream = new Readable({
            objectMode: true,
            read() { }
          });
   
          collection.styles = {};
          const chunkStr = JSON.stringify(collection) + '\n';
          stream.push(chunkStr);
      
      
          const components = collection.components || [];

      
          for (let i = 0; i < components.length; i++) {
            const component = await findComponentById(req.db,components[i]);
            if (component) {
              const chunkStr = JSON.stringify(component) + '\n';
              stream.push(chunkStr);
            }
          }
      
          const collections = collection.relationships || [];

          for (let i = 0; i < collections.length; i++) {
            const collection = await findColelctionById(req.db,collections[i]._id);
            if (collection) {
              const chunkStr = JSON.stringify(collection) + '\n';
              stream.push(chunkStr);
            }
          }

   
      
      
          const forms = collection.forms || [];

          for (let i = 0; i < forms.length; i++) {
            const form = await findFormById(req.db,forms[i]);
            if (form) {
              const chunkStr = JSON.stringify(form) + '\n';
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
            name: ValidateProps.collection.name,
            slug: ValidateProps.collection.slug,
            layout: ValidateProps.collection.layout,
            states: ValidateProps.collection.states,
            scripts: ValidateProps.collection.scripts,
            relationships: ValidateProps.collection.relationships,
            setting: ValidateProps.collection.setting,
        },
        required: ['name', 'slug', 'layout'],
        additionalProperties: true,
    }),
    async (req, res) => {

        const collection = await findColelctionById(req.db, req.query.collectionId);

        if (!collection)
            return res.status(403).status(403)
                .json({ error: { message: 'Collection Not Found.' } });

        const { name, slug, states, form, setting, layout, relationships, scripts, creator } = req.body;
        const url = `/post/${slug}/0`

    
        const coll = await findCollectionByName(req.db, slug);
        if (coll) {
            if (req.query.collectionId !== coll._id.toString()) {
                res
                    .status(403)
                    .json({ error: { message: 'The collection slug has already been used.' } });
                return;
            }
        }

        if (await findFormByName(req.db, slug)) {
            res
                .status(403)
                .json({ error: { message: 'The form slug has already been used.' } });
            return;
        }

        try {
            const updated = await updateCollectionById(req.db, collection._id, {
                name, slug, url, form, states, setting, layout, relationships, scripts, updater: creator
            });


            return res.json({ collection: updated.value });

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
            forms: ValidateProps.page.forms,
        },
        required: ['elements', 'styles', 'components', 'forms'],
        additionalProperties: true,
    }),
    async (req, res) => {

        const collection = await findColelctionById(req.db, req.query.collectionId);


        if (!collection)
            return res.status(403).status(403)
                .json({ error: { message: 'Collection Not Found.' } });

        try {
            const { elements, styles, components, forms, creator } = req.body;


            const updated = await updateCollectionById(req.db, collection._id, {
                elements,
                styles,
                components,
                forms,
                updater: creator,
                updatedAt: new Date(),
            });
            return res.json({ collection: updated.value, status: true });

        } catch (e) {
            res
                .status(403)
                .json({ error: { message: 'Something went wrong.' } });
            return;
        }
    }
);

handler.delete(async (req, res) => {

    const collection = await deleteCollectionById(req.db, req.query.collectionId);

    if (!collection)
        return res.status(403).status(403)
            .json({ error: { message: 'Collection Not Found.' } });

    try {

        const collection = await deleteCollectionById(req.db, req.query.collectionId);

        if (!collection)
            return res.status(403).status(403)
                .json({ error: { message: 'Collection Not Found.' } });

     
        res.json({ status: true });

    } catch (e) {
        res
            .status(403)
            .json({ error: { message: 'Something went wrong.' } });
        return;
    }
});



export default handler;