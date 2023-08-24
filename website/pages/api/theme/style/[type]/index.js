import { ValidateProps } from '@/api-helper/constants';
import { authorizeAPI, validateBody, cors } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
import { save, saveData } from '@/lib/saveData';
const handler = nc(ncOpts);
var fs = require('fs');

import theme from '/pages/api/data/theme.json';

var path = require('path');
var sourceDir = path.join('', "./pages/api/data");

const dir = `${sourceDir}/theme.json`;

handler.use(cors, authorizeAPI);

handler.options(async (req, res) => {
    return res.status(200).json({});
  
  });
  

const elements = [
    'default', // 0
    // Layout
    'body', // 1
    'nav', // 2
    'header', // 3
    'aside', // 4
    'main', // 5
    'hr', // 6
    'article', // 7
    'section', // 8
    'div', // 9
    'footer', // 10
    // Typography
    'h1', // 11
    'h2', // 12
    'h3', // 13
    'h4', // 14
    'h5', // 15
    'h6', // 16
    'p', // 17
    'ul', // 18
    'ol', // 19
    'li', // 20
    'a', // 21
    'blockquote', // 22
    'span', // 23
    'button', // 24
    // Visual
    'img', // 25
    'video', // 26
    'audio', // 27
    // Form
    'form', // 28
    'label', // 29
    'input', // 30
    'input[type="file"]', // 31
    'input[type="color"]', // 32
    'select', // 33
    'select[multiple=true]', // 34
    'textarea', // 35
    'input[type="submit"]', // 36


]



handler.get(async (req, res) => {

    const elementType = req.query.type;
    const elementMeida = req.query.media || 'normal';


    if (!elements.includes(elementType)) {
        res
            .status(403)
            .json({ error: { message: 'Element Type Not Found.' } });
        return;
    }

    try {

        

        let styles = theme.styles ? theme.styles[elementMeida] : {}

        if (!Array.isArray(styles))
            styles = [];

        let element = styles.find(s => s.elementType == elementType);

        let selectors = [];
        if (element)
            selectors = element.selectors;


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

        const elementType = req.query.type;
        const elementMeida = req.query.media ? req.query.media : 'normal';



        if (!elements.includes(elementType)) {
            res
                .status(403)
                .json({ error: { message: 'Element Type Not Found.' } });
            return;
        }

        const { selectors } = req.body;

        

        let styles = theme.styles ? theme.styles[elementMeida] : [];

        console.log(theme.styles[elementMeida], elementMeida);


        if (!Array.isArray(styles))
            theme.styles[elementMeida] = [];



        try {

            let index = theme.styles[elementMeida].findIndex(s => s.elementType == elementType);


            if (index < 0)
                theme.styles[elementMeida].push({ elementType, selectors });
            else
                theme.styles[elementMeida][index] = { elementType, selectors };


            saveData('./pages/api/data/theme.json', theme);

            let css = '';

            for (let type in theme.styles) {

                if (type !== 'normal')
                    css += '@media ' +type + ' {\n';

                if (theme.styles.hasOwnProperty(type))

                    for (let element of theme.styles[type]) {

                        for (let selector of element.selectors) {
                            css += selector.selectorText + ' {\n';

                            for (let property in selector.properties) {
                                css += '  ' + property + ': ' + selector.properties[property].value + ';\n';
                            }

                            css += '}\n';
                        }
                    }

                if (type !== 'normal')
                    css += '}\n';
            }


            save(`public/static/themeStyle.css`, css);

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


export default handler;
