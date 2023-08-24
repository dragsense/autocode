import { ValidateProps } from '@/api-helper/constants';
import { findComponents, insertComponent, findComponentByName, updateComponentById } from '@/api-helper/database';
import { authorizeAPI, database, validateBody, cors } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
import { saveData } from '@/lib/saveData';
import components from '../data/components.json';
import { v4 as uuid } from 'uuid';
import { nanoid } from 'nanoid';

const handler = nc(ncOpts);

handler.use(cors, authorizeAPI, database);
handler.options(async (req, res) => {
  return res.status(200).json({});

});
handler.get(async (req, res) => {

  try {

    const results = await findComponents(
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
      name: ValidateProps.component.name,
      states: ValidateProps.component.states
    },
    required: ['name'],
    additionalProperties: true,
  }),
  async (req, res) => {


    const { name, collection, parent, states, creator } = req.body;


    if (await findComponentByName(req.db, name)) {
      res
        .status(403)
        .json({ error: { message: 'The component name has already been used.' } });
      return;
    }

    const _uid = nanoid(8);



 
    let id = nanoid(8);

    const className = "ac" + "-elem-" + id;

    try {
      const component = await insertComponent(req.db, {
        name,
        states,
        collection,
        parent,
        elements: {},
        components: [],
        forms: [],
        styles: { "normal": { "div": { elementType: "div", _uid, selectors: { 
          ["."+className]: { 
            index: 0,
            selectorText:"."+className, 
          properties: {} } } } } },
        creator,
      });



      const elements = {
        "0": {
          "_uid": "0",
          "tagName": "div",
          "type": "layout",
          "layout": "root",
          "nodeValue": "",
          "className": className,
          "selector": "."+className,
          "childNodes" : [],
          "component" : {_id: component._id},
        }
      }
  

      const updated = await updateComponentById(req.db, component._id, {
        elements,
    });



      return res.json({ component: updated.value });

    } catch (e) {
      res
        .status(403)
        .json({ error: { message: 'Something went wrong.' } });
      return;
    }
  }
);




export default handler;
