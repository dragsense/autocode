import { ValidateProps } from '@/api-helper/constants';
import { authorizeAPI, validateBody, cors } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
import { saveData } from '@/lib/saveData';
const handler = nc(ncOpts);
var fs = require('fs');

import theme from '../../data/theme.json';

const { Readable } = require('stream');
import { generateCss, generateAnimations } from "@/lib/utils"
var path = require('path');
var sourceDir = path.join('', "./pages/api/data");

const dir = `${sourceDir}/theme.json`;

handler.use(cors, authorizeAPI);

handler.options(async (req, res) => {
    return res.status(200).json({});

});


handler.get(async (req, res) => {

    try {



        const styles = theme.styles ? theme.styles : {};

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

handler.patch(
    validateBody({
        type: 'object',
        properties: {
            styles: ValidateProps.theme.style.styles
        },
        required: ['styles'],
        additionalProperties: true,
    }),
    async (req, res) => {


        const { styles } = req.body;

        try {
            theme.styles = styles;
            saveData('./pages/api/data/theme.json', theme);
            return res.json({ status: true });


        } catch (e) {
            console.log(e?.message)
            res
                .status(403)
                .json({ error: { message: 'Something went wrong.' } });
            return;
        }
    }
);

handler.post(async (req, res) => {


    try {
        const styles = theme.styles ? theme.styles : {};
        let css = '';

        const cssCode = theme.themeCss;
        if (cssCode) {
            css += cssCode.code;
        }
        css += generateCss(styles);

        const animations = theme.animations ? theme.animations : {};


        css += generateAnimations(animations);

        return res.json({ css });

    } catch (e) {
        res
            .status(403)
            .json({ error: { message: 'Something went wrong.' } });
        return;
    }

});


export default handler;
