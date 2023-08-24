import {
    findComponentById, insertComponent, findComponentByName,
    updateComponentById,
    findColelctionById,
    findFormById
} from '@/api-helper/database';
import { ValidateProps } from '@/api-helper/constants';
import { authorizeAPI, database, validateBody, cors } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
import components from '../../data/components.json';
const handler = nc(ncOpts);
import { saveData } from '@/lib/saveData';
var fs = require('fs');
const { Readable } = require('stream');

var path = require('path');
var sourceDir = path.join('', "./pages/api/data");
const dir = `${sourceDir}/components.json`;

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
        let { creator} = req.body;

        const component = await findComponentById(req.db, req.query.componentId);


        if (!component)
            return res.status(403).status(403)
                .json({ error: { message: 'Component Not Found.' } });

        const { name, states,
            collection,
            parent,
            elements,
            components,
            forms,
            styles,
             } = component;


        try {
            const comp = await insertComponent(req.db, {
                name: name + "_copy",
                states,
                collection,
                parent,
                elements,
                components,
                forms,
                styles,
                creator
            });


            elements[0].component = { _id: comp._id };
            
            const updated = await updateComponentById(req.db, comp._id, {
                elements,
            });



            return res.json({ component: updated.value });


        } catch (e) {
            res
                .status(403)
                .json({ error: { message: 'Something went wrong.' } });
            return;
        }
    }
);







export default handler;