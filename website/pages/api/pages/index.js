import { ValidateProps } from '@/api-helper/constants';
import { cors, authorizeAPI, database, validateBody } from '@/api-helper/middlewares';
import { findPages, insertPage, findPageBySlug, updatePageById } from '@/api-helper/database';

import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
import { saveData } from '@/lib/saveData';
import pages from '../data/pages.json';
import { v4 as uuid } from 'uuid';
import { nanoid } from 'nanoid';

const handler = nc(ncOpts);

handler.use(cors, authorizeAPI, database);

handler.options(async (req, res) => {
  return res.status(200).json({});

});


handler.get(async (req, res) => {



  try {
    const results = await findPages(
      req.db,
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
      name: ValidateProps.page.name,
      slug: ValidateProps.page.slug,
      layout: ValidateProps.page.layout,
      setting: ValidateProps.page.setting,
      scripts: ValidateProps.page.scripts,
    },
    required: ['name', 'slug', 'setting', 'layout'],
    additionalProperties: true,
  }),
  async (req, res) => {

    const { name, slug, setting, scripts, layout, creator } = req.body;

    if (await findPageBySlug(req.db, slug)) {
      res
        .status(403)
        .json({ error: { message: 'The page slug has already been used.' } });
      return;
    }
    
    const _uid = nanoid(8);
    let id = nanoid(8);

    const className = "ac" + "-elem-" + id;
    try {

      const elements = {
        "0": {
          "_uid": "0",
          "tagName": "div",
          "type": "layout",
          "layout": "root",
          "nodeValue": "",
          "className": className,
          "selector": "."+className,
          "childNodes" : []
        }
      }
      const url = `/post/${slug}`

      const page = await insertPage(req.db, {
        name,
        slug,
        layout,
        scripts,
        url,
        elements,
        components: [],
        forms: [],
        styles: { "normal": { "div": { elementType: "div", _uid, selectors: { 
          ["."+className]: { 
            index: 0,
          selectorText:"."+className, properties: {} } } } } },
        setting,
        creator,
      });



      return res.json({ page });

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
