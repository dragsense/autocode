import { findPageById, deletePageById, findComponentById, findColelctionById, findFormById, findPageBySlug, updatePageById } from '@/api-helper/database';
import { ValidateProps } from '@/api-helper/constants';
import { authorizeAPI, database, validateBody, cors } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
import pages from '../../data/pages.json';
import { saveData } from '@/lib/saveData';
var fs = require('fs');
const { Readable } = require('stream');
const { Transform } = require('stream');

var path = require('path');
var sourceDir = path.join('', "./pages/api/data");
const dir = `${sourceDir}/pages.json`;
const handler = nc(ncOpts);

handler.use(cors, authorizeAPI, database);

handler.options(async (req, res) => {
  return res.status(200).json({});

});




handler.get(async (req, res) => {



  const page = await findPageById(req.db, req.query.pageId);


  if (!page)
    return res.status(403).status(403)
      .json({ error: { message: 'Page Not Found.' } });

  try {



    const stream = new Readable({
      objectMode: true,
      read() { }
    });


    // const elements = page['elements'];

    // const chunkSize = 1000;
    // const entries = Object.entries(elements);

    // for (let i = 0; i < entries.length; i += chunkSize) {
    //   const chunk = entries.slice(i, i + chunkSize);
    //   const chunkData = [];
    //   for (const [key, value] of chunk) {
    //     chunkData.push(value);
    //   }

    //   const chunkStr = JSON.stringify(chunkData) + '\n';
    //   stream.push(chunkStr);

    // }
    page.styles = {};
    const chunkStr = JSON.stringify(page) + '\n';
    stream.push(chunkStr);

    const components = page.components || [];


    const loadComponents = async (components) => {
      for (let i = 0; i < components.length; i++) {
        const component = await findComponentById(req.db, components[i]);
        if (component) {
          const chunkStr = JSON.stringify(component) + '\n';
          stream.push(chunkStr);
  
          const collection = component.collection;
  
  
          if (collection) {
            const coll = await findColelctionById(req.db, collection._id);
            if (coll) {
              const chunkStr = JSON.stringify(coll) + '\n';
              stream.push(chunkStr);
  
              const collections = coll.relationships || [];
  
              for (let i = 0; i < collections.length; i++) {
                const collection = await findColelctionById(req.db, collections[i]._id);
                if (collection) {
                  const chunkStr = JSON.stringify(collection) + '\n';
                  stream.push(chunkStr);
                }
              }
  
  
            }
  
          }
          const innerComponents = component.components || [];

          await loadComponents(innerComponents)
  
        }
      }
    }

    
    await loadComponents(components);

    const forms = page.forms || [];

    for (let i = 0; i < forms.length; i++) {
      const form = await findFormById(req.db, forms[i]);
      if (form) {
        const chunkStr = JSON.stringify(form) + '\n';
        stream.push(chunkStr);
      }
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


handler.post(
  validateBody({
    type: 'object',
    properties: {
      name: ValidateProps.page.name,
      slug: ValidateProps.page.slug,
      layout: ValidateProps.page.layout,
      setting: ValidateProps.page.setting,
      scripts: ValidateProps.page.scripts
    },
    required: ['name', 'slug', 'setting', 'layout'],
    additionalProperties: true,
  }),
  async (req, res) => {


    const page = await findPageById(req.db, req.query.pageId);

    if (!page) {
      res
        .status(403)
        .json({ error: { message: 'Page Not Found.' } });
      return;
    }

    const { name, slug, setting, scripts, layout, creator } = req.body;

    if (!await findPageBySlug(req.db, slug)) {
      res
        .status(403)
        .json({ error: { message: 'The page slug has already been used.' } });
      return;
    }

    try {
      const url = `/post/${slug}`
      const updated = await updatePageById(req.db, page._id, {
        name, slug, setting, scripts, layout, updater: creator, url, updatedAt: new Date(),
      });



      return res.json({ page: updated.value });

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
      components: ValidateProps.page.components,
      forms: ValidateProps.page.forms,
    },
    required: ['elements', 'styles', 'components', 'forms'],
    additionalProperties: true,
  }),
  async (req, res) => {

    const page = await findPageById(req.db, req.query.pageId);

    if (!page)
      return res.status(403).status(403)
        .json({ error: { message: 'Page Not Found.' } });


    try {
      const { elements, styles, components, forms, creator } = req.body;


      const updated = await updatePageById(req.db, page._id, {
        elements,
        styles,
        components,
        forms,
        updater: creator,
        updatedAt: new Date(),
      });



      return res.json({ page: updated.value, status: true });

    } catch (e) {
      res
        .status(403)
        .json({ error: { message: 'Something went wrong.' } });
      return;
    }
  }
);



handler.delete(async (req, res) => {

  try {
    const page = await deletePageById(req.db, req.query.pageId);

    if (!page)
      return res.status(403).status(403)
        .json({ error: { message: 'Page Not Found.' } });



    res.json({ status: true });

  } catch (e) {
    res
      .status(403)
      .json({ error: { message: 'Something went wrong.' } });
    return;
  }
});



export default handler;