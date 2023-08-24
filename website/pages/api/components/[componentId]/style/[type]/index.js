import { ValidateProps } from '@/api-helper/constants';
import { authorizeAPI, validateBody, cors, database } from '@/api-helper/middlewares';
import { findPageById, updatePageById } from '@/api-helper/database';

import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
import { save, saveData } from '@/lib/saveData';
const handler = nc(ncOpts);
var fs = require('fs');

import pages from '/pages/api/data/pages.json';

var path = require('path');
var sourceDir = path.join('', "./pages/api/data");

const dir = `${sourceDir}/pages.json`;

handler.use(cors, authorizeAPI, database);

const elements = [

    //Layout
    'body',
    'nav',
    'header',
    'aside',
    'main',
    'hr',
    'article',
    'section',
    'div',
    '.container',
    'footer',


    //Typeography

    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'p',
    'ul',
    'ol',
    'li',
    'a',
    'blockquote',
    'span',
    '.text',
    'button',

    //Visual
    'img',
    'video',
    'audio',

    //Table

    'table',
    'thead',
    'th',
    'tbody',
    'tr',
    'td',
    'tfoot',

    //Form

    'form',
    'label',
    'input',
    'select',
    'textarea',


]

handler.options(async (req, res) => {
    return res.status(200).json({});

});


handler.get(async (req, res) => {

    const page = await findPageById(req.db, req.query.pageId);


    if (!page)
        return res.status(403).status(403)
            .json({ error: { message: 'Page Not Found.' } });

    try {




        const elementType = req.query.type;
        const elementMeida = req.query.media || 'normal';



        if (!elements.includes(elementType)) {
            res
                .status(403)
                .json({ error: { message: 'Element Type Not Found.' } });
            return;
        }

        const styles = page.styles || {};


        styles[elementMeida] = styles[elementMeida] ||  {};


        let element = styles[elementMeida][elementType];

        let selectors = [];
        if (element)
            selectors = element.selectors;

            console.log(selectors.map(s => console.log(s.properties)));


        return res.json({ selectors });
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
            selectors: ValidateProps.theme.style.selectors
        },
        required: ['selectors'],
        additionalProperties: true,
    }),
    async (req, res) => {


        const page = await findPageById(req.db, req.query.pageId);


        if (!page)
            return res.status(403).status(403)
                .json({ error: { message: 'Page Not Found.' } });

        const elementType = req.query.type;
        const elementMeida = req.query.media ? req.query.media : 'normal';



        if (!elements.includes(elementType)) {
            res
                .status(403)
                .json({ error: { message: 'Element Type Not Found.' } });
            return;
        }

        const { selectors } = req.body;



        const styles = page.styles || {};

        styles[elementMeida] = styles[elementMeida] || {};


        try {

            styles[elementMeida][elementType] = ({ elementType, selectors });

            await updatePageById(req.db, page._id, {
                styles,
              });
        

            return res.json({ status: true });


        } catch (e) {


            res
                .status(403)
                .json({ error: { message: 'Something went wrong.' } });
            return;
        }
    }
);


export default handler;
