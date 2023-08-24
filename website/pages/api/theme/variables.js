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



        const variables = Array.isArray(theme.variables) ? theme.variables : [];

        res.json({ variables });

    } catch (e) {

        res
            .status(403)
            .json({ error: { message: 'Something went wrong.' } });
        return;
    }
});


handler.delete(async (req, res) => {


    try {


        if (!Array.isArray(theme.variables))
        theme.variables = [];

        const index = theme.variables?.findIndex(variable => variable._uid === req.query._uid);

        if (index !== -1) {
            theme.variables.splice(index, 1);
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
            name: ValidateProps.theme.variable.name,
            value: ValidateProps.theme.variable.value
        },
        required: ['name', 'value'],
        additionalProperties: true,
    }),
    async (req, res) => {



        const { name, value, type } = req.body;



        if (!Array.isArray(theme.variables))
        theme.variables = [];

        const obj = theme.variables?.find(variable => variable.name === name);
        if (obj) {
            res
                .status(403)
                .json({ error: { message: 'The Variable has already been used.' } });
            return;
        }

        try {
            const variable = `--var-${name.toLowerCase().replace(/\s+/g, '-')}-variable`


            const _uid = nanoid(8);
            theme.variables.push({ _uid, name, variable, value, type });
            saveData('./pages/api/data/theme.json', theme);

            return res.json({ variable: { _uid, name, variable, value, type } });


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
            name: ValidateProps.theme.variable.name,
            value: ValidateProps.theme.variable.value
        },
        required: ['name', 'value'],
        additionalProperties: true,
    }),
    async (req, res) => {

        const { _uid, name, value, type } = req.body;

        if (!Array.isArray(theme.variables))
        theme.variables = [];

        const index = theme.variables.findIndex(variable => variable._uid === _uid);

        if (index === -1)
            return res.status(403).status(403)
                .json({ error: { message: 'Variable Not Found.' } });

        try {

            const variable = `--var-${name.toLowerCase().replace(/\s+/g, '-')}-variable`

            theme.variables[index] = { _uid, name, variable, value, type };

            saveData('./pages/api/data/theme.json', theme);

            return res.json({ variable: { _uid, name, variable, value, type } });

        } catch (e) {
            res
                .status(403)
                .json({ error: { message: 'Something went wrong.' } });
            return;
        }
    }
);

export default handler;
