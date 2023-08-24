import { ValidateProps } from '@/api-helper/constants';
import { findCollections, insertCollection, findCollectionByName, findFormByName, updateCollectionById } from '@/api-helper/database';
import { authorizeAPI, database, validateBody, cors } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
import collections from '../data/collections.json';
import { saveData } from '@/lib/saveData';
const handler = nc(ncOpts);
import { v4 as uuid } from 'uuid';
import { nanoid } from 'nanoid';

handler.use(cors, authorizeAPI, database);
handler.options(async (req, res) => {
  return res.status(200).json({});

});

handler.get(async (req, res) => {

  try {

    const results = await findCollections(
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
      name: ValidateProps.collection.name,
      slug: ValidateProps.collection.slug,
      layout: ValidateProps.collection.layout,
      states: ValidateProps.collection.states,
      scripts: ValidateProps.collection.scripts,
      relationships: ValidateProps.collection.relationships,
      setting: ValidateProps.collection.setting,
    },
    required: ['name', 'slug', 'setting', 'layout'],
    additionalProperties: true,
  }),
  async (req, res) => {

    const { name, slug, states, form, setting, layout, relationships, scripts, creator } = req.body;


    if (await findCollectionByName(req.db, slug)) {
      res
        .status(403)
        .json({ error: { message: 'The collection name has already been used.' } });
      return;
    }

    if (await findFormByName(req.db, slug)) {
      res
        .status(403)
        .json({ error: { message: 'The form slug has already been used.' } });
      return;
    }

    const _uid = nanoid(8);

    let id = nanoid(8);
    const className = "ac" + "-elem-" + id;
    const url = `/post/${slug}/0`

    try {
      const collection = await insertCollection(req.db, {
        name,
        slug,
        setting,
        states,
        layout,
        scripts,
        form,
        url,
        relationships,
        elements: {},
        components: [],
        forms: [],
        type: 'collection',
        styles: {
          "normal": {
            "div": {
              elementType: "div", _uid, selectors: {
                ["." + className]: {
                  index: 0,
                  selectorText: "." + className, properties: {}
                }
              }
            }
          }
        },
        creator
      });

      const elements = {
        "0": {
          "_uid": "0",
          "tagName": "div",
          "type": "layout",
          "layout": "root",
          "nodeValue": "",
          "className": className,
          "selector": "." + className,
          "childNodes": [],
          "collection": { _id: collection._id },
        }
      }


      const updated = await updateCollectionById(req.db, collection._id, {
        elements,
      });


      return res.json({ collection: updated.value });

    } catch (e) {


      res
        .status(403)
        .json({ error: { message: 'Something went wrong.' } });
      return;
    }
  }
);



export default handler;
