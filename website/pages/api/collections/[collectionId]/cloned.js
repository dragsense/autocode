import {
    findColelctionById, insertCollection,
    findFormByName, deleteCollectionById, dropCollection, updateCollectionById, findFormById
} from '@/api-helper/database';
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



handler.post(
    validateBody({
        type: 'object',
        properties: {
        },
        required: [],
        additionalProperties: true,
    }),
    async (req, res) => {

        let { creator} = req.body;

        const collection = await findColelctionById(req.db, req.query.collectionId);

        if (!collection)
            return res.status(403).status(403)
                .json({ error: { message: 'Collection Not Found.' } });

        const { name, slug, states, setting, layout, relationships, scripts } = collection;

        try {

            const coll = await insertCollection(req.db, {
                name: name + "_copy",
                slug: slug + "_copy",
                setting,
                states,
                layout,
                scripts,
                relationships,
                elements,
                components,
                forms,
                styles,
                creator
            });


            elements[0].collection = { _id: coll._id }



            const updated = await updateCollectionById(req.db, coll._id, {
                elements,
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







export default handler;