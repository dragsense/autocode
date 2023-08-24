import { findPageById, insertPage, findComponentById, findColelctionById, findFormById, findPageBySlug, updatePageById } from '@/api-helper/database';
import { ValidateProps } from '@/api-helper/constants';
import { authorizeAPI, database, validateBody, cors } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
import pages from '../../data/pages.json';
import { saveData } from '@/lib/saveData';
var fs = require('fs');
const { Readable } = require('stream');
const { Transform } = require('stream');

var path = require('path');
var sourceDir = path.join('', "./pages/api/data");
const dir = `${sourceDir}/pages.json`;
const handler = nc(ncOpts);

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

        const page = await findPageById(req.db, req.query.pageId);

        if (!page) {
            res
                .status(403)
                .json({ error: { message: 'Page Not Found.' } });
            return;
        }

        const {
            name,
            layout,
            slug,
            scripts,
            elements,
            components,
            forms,
            styles,
            setting,
        } = page;


        try {

            const page = await insertPage(req.db, {
                name: name + "_copy",
                slug: slug + "_copy",
                layout,
                scripts,
                elements,
                components,
                forms,
                styles,
                setting,
                creator,
            });



            return res.json({ page });

        } catch (e) {

            res
                .status(403)
                .json({ error: { message: 'Something went wrong.' } });
            return;
        }

    }
);





export default handler;