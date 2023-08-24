import { ValidateProps } from '@/api-helper/constants';
import { authorizeAPI, database, validateBody, cors } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
import { save, saveData } from '@/lib/saveData';
import theme from '../data/theme.json';
const handler = nc(ncOpts);
var fs = require('fs');
import { nanoid } from 'nanoid';

var path = require('path');
var sourceDir = path.join('', "./pages/api/data");

const dir = `${sourceDir}/theme.json`;


handler.use(cors, authorizeAPI);

handler.options(async (req, res) => {
    return res.status(200).json({});

});


handler.get(async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10; // Set a default limit if not provided

        const icons = Array.isArray(theme.icons) ? theme.icons : [];

        // Calculate the starting and ending index based on the page and limit
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = icons.length;

        // Get the icons for the current page
        const paginatedIcons = icons.slice(startIndex, endIndex);

        res.json({
            icons: paginatedIcons,
            total: Math.ceil(total / limit),
        });
    } catch (e) {
        res.status(403).json({ error: { message: 'Something went wrong.' } });
        return;
    }
});

handler.delete(async (req, res) => {

    try {

        const _id = req.query._id;

        const index = theme.icons?.findIndex(icon => icon._id === _id);

        if (index !== -1) {
            theme.icons.splice(index, 1);
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
            name: ValidateProps.theme.icon.name,
            classes: ValidateProps.theme.icon.classes,
            svg: ValidateProps.theme.icon.svg,

        },
        required: ['name'],
        additionalProperties: true,
    }),
    async (req, res) => {



        if (!Array.isArray(theme.icons))
        theme.icons = [];

        const { name, classes, svg } = req.body;

        try {
            const obj = theme.icons.find(icon => icon.name === name);
            if (obj) {
                res
                    .status(403)
                    .json({ error: { message: 'The Icon has already been used.' } });
                return;
            }

            let _id = nanoid(8);

            theme.icons.push({ _id, name, classes, svg });
            saveData('./pages/api/data/theme.json', theme);

            return res.json({ icon: { _id, name, classes, svg } });


        } catch (e) {
            console.log(e?.message)
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
            name: ValidateProps.theme.icon.name,

            classes: ValidateProps.theme.icon.classes,
            svg: ValidateProps.theme.icon.svg,
        },
        required: ['name'],
        additionalProperties: true,
    }),
    async (req, res) => {

        const _id = req.query._id;
        const { name, classes, svg } = req.body;


        if (!Array.isArray(theme.icons))
        theme.icons = [];

        try {

            const index = theme.icons.findIndex(icon => icon._id === _id);



            if (index === -1)
                return res.status(403).status(403)
                    .json({ error: { message: 'Icon Not Found.' } });


            theme.icons[index] = { _id, name, classes, svg };


            saveData('./pages/api/data/theme.json', theme);

            return res.json({ icon: { _id, name, classes, svg } });

        } catch (e) {
            res
                .status(403)
                .json({ error: { message: 'Something went wrong.' } });
            return;
        }
    }
);

export default handler;
