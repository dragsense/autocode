import {
    findComponentById, deleteComponentById, findComponentByName,
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
handler.get(async (req, res) => {



    const component = await findComponentById(req.db, req.query.componentId);

    if (!component)
        return res.status(403).status(403)
            .json({ error: { message: 'Component Not Found.' } });

    try {

        const stream = new Readable({
            objectMode: true,
            read() { }
        });




        if (component.parent) {
            const parent = await findComponentById(req.db, component.parent._id);
            component.props = parent.states;
        }


        component.styles = {};
        const chunkStr = JSON.stringify(component) + '\n';
        stream.push(chunkStr);


        const components = component.components || [];

        for (let i = 0; i < components.length; i++) {
            const component = await findComponentById(req.db, components[i]);
            if (component) {
                const chunkStr = JSON.stringify(component) + '\n';
                stream.push(chunkStr);
            }
        }

        const collection = component.collection;


        if (collection) {
            const coll = await findColelctionById(req.db, collection._id);
            if (coll) {
                const chunkStr = JSON.stringify(coll) + '\n';
                stream.push(chunkStr);

                const collections = coll.relationships || [];

                for (let i = 0; i < collections.length; i++) {
                    const collection = await findColelctionById(req.db, collections[i]._id);
                    if (collection) {
                        const chunkStr = JSON.stringify(collection) + '\n';
                        stream.push(chunkStr);
                    }
                }


            }


        }


        const forms = component.forms || [];

        for (let i = 0; i < forms.length; i++) {
            const form = await findFormById(req.db, forms[i]);
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
            name: ValidateProps.component.name,
            states: ValidateProps.component.states
        },
        required: ['name'],
        additionalProperties: true,
    }),
    async (req, res) => {

        const component = await findComponentById(req.db, req.query.componentId);


        if (!component)
            return res.status(403).status(403)
                .json({ error: { message: 'Component Not Found.' } });

        const { name, collection, parent, states, creator } = req.body;

        const comp = await findComponentByName(req.db, name);
        if (comp) {

            if (req.query.componentId !== comp._id.toString()) {
                res
                    .status(403)
                    .json({ error: { message: 'The component name has already been used.' } });
                return;
            }
        }


        try {
            const updated = await updateComponentById(req.db, component._id, {
                name,
                states,
                parent,
                collection,
                updater: creator
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



handler.patch(
    validateBody({
        type: 'object',
        properties: {
            elements: ValidateProps.page.elements,
            styles: ValidateProps.page.styles,
            components: ValidateProps.page.components,
            forms: ValidateProps.page.forms,
            styles: ValidateProps.page.collection,
        },
        required: ['elements', 'styles', 'components', 'forms', 'collection'],
        additionalProperties: true,
    }),
    async (req, res) => {

        const component = await findComponentById(req.db, req.query.componentId);


        if (!component)
            return res.status(403).status(403)
                .json({ error: { message: 'Component Not Found.' } });

        try {
            const { elements, styles, components, collection, forms, creator } = req.body;

            const updated = await updateComponentById(req.db, component._id, {
                elements,
                styles,
                components,
                collection,
                forms,
                updater: creator,
                updatedAt: new Date(),
            });
            return res.json({ component: updated.value, status: true });

        } catch (e) {
            res
                .status(403)
                .json({ error: { message: 'Something went wrong.' } });
            return;
        }
    }
);

handler.delete(async (req, res) => {

    const component = await deleteComponentById(req.db, req.query.componentId);

    if (!component)
        return res.status(403).status(403)
            .json({ error: { message: 'Component Not Found.' } });

    try {

        const component = await deleteComponentById(req.db, req.query.componentId);

        if (!component)
            return res.status(403).status(403)
                .json({ error: { message: 'Component Not Found.' } });


        res.json({ status: true });

    } catch (e) {
        res
            .status(403)
            .json({ error: { message: 'Something went wrong.' } });
        return;
    }
});



export default handler;