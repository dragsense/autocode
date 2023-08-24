import { ValidateProps } from '@/api-helper/constants';
import { authorizeAPI, database, validateBody, cors } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
import { save, saveData } from '@/lib/saveData';
import theme from '../data/theme.json';
var fs = require('fs');
var path = require('path');
var sourceDir = path.join('', "./pages/api/data");
import { nanoid } from 'nanoid';

const dir = `${sourceDir}/theme.json`;

const handler = nc(ncOpts);

handler.use(cors, authorizeAPI);

handler.options(async (req, res) => {
    return res.status(200).json({});

});


handler.get(async (req, res) => {


    try {



        const colors = Array.isArray(theme.colors) ? theme.colors : [];

        res.json({ colors });

    } catch (e) {

        res
            .status(403)
            .json({ error: { message: 'Something went wrong.' } });
        return;
    }
});


handler.delete(async (req, res) => {


    try {


        if (!Array.isArray(theme.colors))
        theme.colors = [];

        const index = theme.colors?.findIndex(col => col._uid === req.query._uid);

        if (index !== -1) {
            theme.colors.splice(index, 1);
            saveData('./pages/api/data/theme.json', theme);
        }
        res.json({ status: true });

    } catch (e) {
        console.log(e?.message)
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
            name: ValidateProps.theme.color.name,
            color: ValidateProps.theme.color.color
        },
        required: ['name', 'color'],
        additionalProperties: true,
    }),
    async (req, res) => {



        const { name, color } = req.body;



        if (!Array.isArray(theme.colors))
        theme.colors = [];

        const obj = theme.colors?.find(color => color.name === name);
        if (obj) {
            res
                .status(403)
                .json({ error: { message: 'The Color has already been used.' } });
            return;
        }

        try {
            const variable = `--var-${name.toLowerCase().replace(/\s+/g, '-')}-color`


            const _uid = nanoid(8);
            theme.colors.push({ _uid, name, color, value: variable });
            saveData('./pages/api/data/theme.json', theme);

            return res.json({ color: { _uid, name, color, value: variable } });


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
            name: ValidateProps.theme.color.name,
            color: ValidateProps.theme.color.color
        },
        required: ['name', 'color'],
        additionalProperties: true,
    }),
    async (req, res) => {

        const { _uid, name, color } = req.body;

        if (!Array.isArray(theme.colors))
        theme.colors = [];

        const index = theme.colors.findIndex(color => color._uid === _uid);

        if (index === -1)
            return res.status(403).status(403)
                .json({ error: { message: 'Color Not Found.' } });

        try {

            const variable = `--var-${name.toLowerCase().replace(/\s+/g, '-')}-color`
            console.log(theme.colors[index])

            theme.colors[index] = { _uid, name, color, value: variable };

            saveData('./pages/api/data/theme.json', theme);

            return res.json({ color: { _uid, name, color, value: variable } });

        } catch (e) {
            res
                .status(403)
                .json({ error: { message: 'Something went wrong.' } });
            return;
        }
    }
);

export default handler;
