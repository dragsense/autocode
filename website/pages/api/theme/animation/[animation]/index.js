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
  


handler.get(async (req, res) => {



    try {

        
        const animation = req.query.animation;

        let styles = theme.animations || {}

        let element = styles[animation] ||  null;


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


        const { selectors } = req.body;


        const animation = req.query.animation;

        let styles = theme.animations || {}


        try {


            styles[animation] = ({ selectors });

            theme.animations = styles;


            saveData('./pages/api/data/theme.json', theme);

    

            return res.json({ status: true });


        } catch (e) {

            res
                .status(403)
                .json({ error: { message: 'Something went wrong.' } });
            return;
        }
    }
);


handler.delete(
    async (req, res) => {

        const animation = req.query.animation;

        let styles = theme.animations || {}


        try {

            delete styles[animation];
            theme.animations = styles;

            saveData('./pages/api/data/theme.json', theme);


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
