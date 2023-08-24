import { ValidateProps } from '@/api-helper/constants';
import { authorizeAPI, validateBody, cors, database } from '@/api-helper/middlewares';
import { findTemplateById } from '@/api-helper/database';

import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
const handler = nc(ncOpts);
const { Readable } = require('stream');

handler.use(cors, authorizeAPI, database);
handler.options(async (req, res) => {
    return res.status(200).json({});

});


handler.get(async (req, res) => {


    const template = await findTemplateById(req.db, req.query.templateId);


    if (!template)
        return res.status(403).status(403)
            .json({ error: { message: 'Template Not Found.' } });


    try {


        let styles = template.styles || {};



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


    const template = await findTemplateById(req.db, req.query.templateId);


    if (!template)
        return res.status(403).status(403)
            .json({ error: { message: 'Template Not Found.' } });


    try {


        let styles = template.styles || {};

        let css = '';

        Object.keys(styles).map((key) => {
            if (styles[key]) {
                if (key !== 'normal')
                css += '@media ' + key + ' {\n';
                Object.values(styles[key]).flatMap((element) => {
                    
                    Object.values(element.selectors).map(selector => {
                        let properties = Object.entries(selector.properties).map(([key, property]) => `${key}: ${property.value}`).join(';');
                        css += `${selector.selectorText} {\n  ${properties}\n}\n\n`;
                    }).join('');
                
                });

                if (key !== 'normal')
                css += ' }\n';
            }
        });


        return res.json({ css });


    } catch (e) {

        res
            .status(403)
            .json({ error: { message: 'Something went wrong.' } });
        return;
    }

});



export default handler;
