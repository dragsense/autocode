import { ValidateProps } from '@/api-helper/constants';
import { authorizeAPI, database, validateBody, cors } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
import { save, saveData } from '@/lib/saveData';
import theme from '../data/theme.json';
const handler = nc(ncOpts);
var fs = require('fs');

var path = require('path');
var sourceDir = path.join('', "./pages/api/data");
import { nanoid } from 'nanoid';

const dir = `${sourceDir}/theme.json`;


handler.use(cors, authorizeAPI);

handler.options(async (req, res) => {
    return res.status(200).json({});

});


handler.get(async (req, res) => {

    try {



        const fonts = Array.isArray(theme.fonts) ? theme.fonts : [];
        res.json({ fonts });

    } catch (e) {
        res
            .status(403)
            .json({ error: { message: 'Something went wrong.' } });
        return;
    }

});

handler.delete(async (req, res) => {

    try {
        if (!Array.isArray(theme.fonts))
        theme.fonts = [];

        const index = theme.fonts?.findIndex(font => font._uid === req.query._uid);

        console.log(index)

        if (index !== -1) {
            theme.fonts.splice(index, 1);
            saveData('./pages/api/data/theme.json', theme);
        }
        res.json({ status: true });

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
            name: ValidateProps.theme.font.name,
            fontFamily: ValidateProps.theme.font.fontFamily,

        },
        required: ['name', 'fontFamily'],
        additionalProperties: true,
    }),
    async (req, res) => {



        if (!Array.isArray(theme.fonts))
        theme.fonts = [];

        const { name, fontFamily, src, fontSrc, isGoogleFont } = req.body;

        try {
            const obj = theme.fonts.find(font => font.name === name);
            if (obj) {
                res
                    .status(403)
                    .json({ error: { message: 'The Font has already been used.' } });
                return;
            }

            const variable = `--var-${name.toLowerCase().replace(/\s+/g, '-')}-font`
            const _uid = nanoid(8);

            theme.fonts.push({ _uid, name, value: variable,  fontFamily, src, isGoogleFont, fontSrc });
            saveData('./pages/api/data/theme.json', theme);

            return res.json({ font: { _uid, name, fontFamily,  value: variable, isGoogleFont,  src, fontSrc  } });


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
            name: ValidateProps.theme.font.name,
            fontFamily: ValidateProps.theme.font.fontFamily,

        },
        required: ['name', 'fontFamily'],
        additionalProperties: true,
    }),
    async (req, res) => {

        const { _uid, name, fontFamily, src, fontSrc, isGoogleFont } = req.body;


        if (!Array.isArray(theme.fonts))
        theme.fonts = [];

        try {

            console.log(_uid)
            const index = theme.fonts.findIndex(font => font._uid === _uid);



            if (index === -1)
                return res.status(403).status(403)
                    .json({ error: { message: 'Font Not Found.' } });

            const variable = `--var-${name.toLowerCase().replace(/\s+/g, '-')}-font`

            theme.fonts[index] = { _uid, name, fontFamily, value: variable,  isGoogleFont, src, fontSrc };


            saveData('./pages/api/data/theme.json', theme);

            return res.json({ font: { _uid, name, fontFamily, value: variable, isGoogleFont, src, fontSrc } });

        } catch (e) {
            res
                .status(403)
                .json({ error: { message: 'Something went wrong.' } });
            return;
        }
    }
);

export default handler;
