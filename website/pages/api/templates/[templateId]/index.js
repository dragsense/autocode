import { ValidateProps } from '@/api-helper/constants';
import { findTemplateById, findTemplateByName, deleteMediaById, deleteTemplateById, updateTemplateById } from '@/api-helper/database';

import { authorizeAPI, validateBody, cors, database } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
import { save } from '@/lib/saveData';
import theme from '../../data/theme.json'
var fs = require('fs');
var path = require('path');
var sourceDir = path.join('', "./pages/api/data");
const { Readable } = require('stream');

const dir = `${sourceDir}/theme.json`;
import { v4 as uuid } from 'uuid';

const handler = nc(ncOpts);

handler.use(cors, authorizeAPI, database)
handler.options(async (req, res) => {
  return res.status(200).json({});

});


handler.get(async (req, res) => {

  const template = await findTemplateById(req.db, req.query.templateId);

  if (!template)
    return res.status(403).status(403)
      .json({ error: { message: 'Template Not Found.' } });

  try {

    const stream = new Readable({
      objectMode: true,
      read() { }
    });

    template.styles = {};
    const chunkStr = JSON.stringify(template) + '\n';
    stream.push(chunkStr);
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


    const _id = req.query.templateId;
    const { name, desc, screenShot, categories, creator } = req.body;

    try {

      const template = await findTemplateByName(req.db, name);

      if (template) {
        if (template._id.toString() !==  _id) {
        res
          .status(403)
          .json({ error: { message: 'The Template has already been used.' } });
        return;
      }
    } else {
      return res.status(403)
          .json({ error: { message: 'Template Not Found.' } });

    }

   
      const updated = await updateTemplateById(req.db, template._id, {
        name, desc, screenShot, categories,
        updater: creator,
        updatedAt: new Date(),
      });


      for (var i = 0; i < categories.length; i++) {
        if (!theme.templates.categories.includes(categories[i])) {
          theme.templates.categories.push(categories[i]);
        }
      }
      save('./pages/api/data/theme.json', JSON.stringify(theme));
      
      return res.json({ template: updated.value, status: true });



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
          elements: ValidateProps.page.elements,
          styles: ValidateProps.page.styles,
      },
      required: ['elements', 'styles'],
      additionalProperties: true,
  }),
  async (req, res) => {

    const template = await findTemplateById(req.db, req.query.templateId);

    if (!template)
      return res.status(403).status(403)
        .json({ error: { message: 'Template Not Found.' } });
  

      try {
          const { elements, styles, creator } = req.body;


          const updated = await updateTemplateById(req.db, template._id, {
              elements,
              styles,
              updater: creator,
              updatedAt: new Date(),
          });
          return res.json({ template: updated.value, status: true });

      } catch (e) {
          res
              .status(403)
              .json({ error: { message: 'Something went wrong.' } });
          return;
      }
  }
);


handler.delete(async (req, res) => {

  const template = await findTemplateById(req.db, req.query.templateId);

  if (!template)
    return res.status(403)
      .json({ error: { message: 'Template Not Found.' } });

  try {

    const template = await deleteTemplateById(req.db, req.query.templateId);

    if (!template)
      return res.status(403)
        .json({ error: { message: 'Template Not Found.' } });

    if (template.screenShot) {
      const screenShot = template.screenShot;
      await deleteMediaById(req.db, screenShot._id);
      const path = `./public/uploads/${screenShot.type}/${screenShot.name}`;

      fs.unlink(path, (err) => {
        if (err) {
          console.error(err)
        }

        //file removed
      })
    }

    res.json({ status: true });

  } catch (e) {
    res
      .status(403)
      .json({ error: { message: 'Something went wrong.' } });
    return;
  }


});


export default handler;