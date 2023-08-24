import { ValidateProps } from '@/api-helper/constants';
import { authorizeAPI, validateBody, cors, database } from '@/api-helper/middlewares';
import { findPageById, findComponentById } from '@/api-helper/database';

import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
const handler = nc(ncOpts);
const { Readable } = require('stream');
import { generateCss } from "@/lib/utils"

handler.use(cors, authorizeAPI, database);
handler.options(async (req, res) => {
    return res.status(200).json({});

});


handler.get(async (req, res) => {


    const page = await findPageById(req.db, req.query.pageId);


    if (!page)
        return res.status(403).status(403)
            .json({ error: { message: 'Page Not Found.' } });


    try {


        let styles = page.styles || {};


        const stream = new Readable({
            objectMode: true,
            read() { }
        });

        const selectors = Object.keys(styles).flatMap((key) => {
            const group = styles[key];
            if (group) {
                return Object.values(group).flatMap((element) => { return { ...element, type: key } });
            }
            return [];
        });


        const chunkSize = 500;

        for (let i = 0; i < selectors.length; i += chunkSize) {
            const chunk = selectors.slice(i, i + chunkSize);
            const chunkData = [];
            for (const value of chunk) {
                chunkData.push(value);
            }
            const chunkStr = JSON.stringify(chunkData) + '\n';
            stream.push(chunkStr);
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


handler.post(async (req, res) => {


    const page = await findPageById(req.db, req.query.pageId);


    if (!page)
        return res.status(403).status(403)
            .json({ error: { message: 'Page Not Found.' } });


    try {


        let styles = page.styles || {};

        let css = [];
        css = [generateCss(styles)];

        const components = page.components || [];

        const loadComponentsCSS = async (components) => {
            for (let i = 0; i < components.length; i++) {
                const component = await findComponentById(req.db, components[i]);
                if (component) {
                    let styles = component.styles || {};
                    css = [...css, generateCss(styles)];
                    const innerComponents = component.components || [];

                await loadComponentsCSS(innerComponents)
                }
            }
        }

        await loadComponentsCSS(components);
      

        return res.json({ css });


    } catch (e) {

        res
            .status(403)
            .json({ error: { message: 'Something went wrong.' } });
        return;
    }

});



export default handler;
