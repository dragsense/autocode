import { ValidateProps } from '@/api-helper/constants';
import { findTemplateById, findTemplates, findTemplateByName, insertTemplate } from '@/api-helper/database';
import { authorizeAPI, validateBody,database, cors } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
import { save } from '@/lib/saveData';
import theme from '../data/theme.json';
var fs = require('fs');
var path = require('path');
var sourceDir = path.join('', "./pages/api/data");

const dir = `${sourceDir}/theme.json`;
import { v4 as uuid } from 'uuid';

const handler = nc(ncOpts);

handler.use(cors, authorizeAPI, database);
handler.options(async (req, res) => {
  return res.status(200).json({});

});

handler.get(async (req, res) => {

  try {

    const results = await findTemplates(req.db,
      req.query.category,
      req.query.page ? parseInt(req.query.page, 10) : 1,
      req.query.limit ? parseInt(req.query.limit, 10) : 10
    );


    res.json(results);
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
      name: ValidateProps.theme.templates.name,
    },
    required: ['name'],
    additionalProperties: true,
  }),
  async (req, res) => {

    const { name, desc, screenShot, categories, elements, styles, creator } = req.body;

    try {

      const template = await findTemplateByName(req.db, name);



      if (template) {
        res
          .status(403)
          .json({ error: { message: 'The Template has already been used.' } });
        return;
      }

      const newTemplate = await insertTemplate(req.db, {
        name, desc, screenShot, categories, elements,
        styles,
        creator
      });


      for (var i = 0; i < categories.length; i++) {
        if (!theme.templates.categories.includes(categories[i])) {
          theme.templates.categories.push(categories[i]);
        }
      }
      save('./pages/api/data/theme.json', JSON.stringify(theme));

      return res.json({ template: element });

      return res.json({ template: newTemplate });

    } catch (e) {


      res
        .status(403)
        .json({ error: { message: 'Something went wrong.' } });
      return;
    }
  }
);




export default handler;
