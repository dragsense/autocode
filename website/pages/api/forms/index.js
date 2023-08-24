import { ValidateProps } from '@/api-helper/constants';
import { findForms, insertForm, findFormByName, updateFormById, findCollectionByName } from '@/api-helper/database';
import { authorizeAPI, database, validateBody, cors } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
import { saveData } from '@/lib/saveData';
import forms from '../data/forms.json';
import { v4 as uuid } from 'uuid';
import { nanoid } from 'nanoid';

const handler = nc(ncOpts);

handler.use(cors, authorizeAPI, database);
handler.options(async (req, res) => {
  return res.status(200).json({});

});

handler.get(async (req, res) => {


  try {

    const results = await findForms(
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
      name: ValidateProps.form.name,
      slug: ValidateProps.form.slug,
      states: ValidateProps.form.states,
      setting: ValidateProps.form.setting,
      emailbody: ValidateProps.form.emailbody,
    },
    required: ['name', 'slug', 'emailbody'],
    additionalProperties: true,
  }),
  async (req, res) => {

    const { name, slug, record, emailbody, states, setting, creator } = req.body;

    if (await findFormByName(req.db, slug)) {
      res
        .status(403)
        .json({ error: { message: 'The form slug has already been used.' } });
      return;
    }

    if (await findCollectionByName(req.db, slug)) {
      res
        .status(403)
        .json({ error: { message: 'The collection slug has already been used.' } });
      return;
    }

    const _uid = nanoid(8);
    let id = nanoid(8);
    const className = "ac" + "-elem-" + id;


    try {
      const form = await insertForm(req.db, {
        name,
        slug,
        record,
        emailbody,
        states,
        type: "form",
        setting,
        elements: {},
        components: [],
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
          "form": { _id: form._id },
        }
      }


      const updated = await updateFormById(req.db, form._id, {
        elements,
      });

      return res.json({ form: updated.value });


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
