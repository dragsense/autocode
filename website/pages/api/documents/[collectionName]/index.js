import { ValidateProps } from '@/api-helper/constants';
import { findColelctionById, findDocuments, findFormById, insertDocument, findDocumentBySlug, updateDocumentById } from '@/api-helper/database';
import { authorizeAPI, database, validateBody, cors } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import { ObjectID } from 'bson';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.use(cors, authorizeAPI, database);
handler.options(async (req, res) => {
  return res.status(200).json({});

});

handler.get(async (req, res) => {

  const id = req.query.collectionName;


  const isForm = req.query.form;
  let collection = null;



  try {


    collection = Boolean(isForm == 'true') ?
      await findFormById(req.db, id) :
      await findColelctionById(req.db, id);


    if (!collection)
      return res.status(403)
        .json({ error: { message: 'Collection Not Found.' } });


    const results = await findDocuments(
      req.db,
      collection.slug,
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
      name: ValidateProps.document.name,
      slug: ValidateProps.collection.slug,

      states: ValidateProps.document.states,
      relationships: ValidateProps.document.relationships,
      setting: ValidateProps.document.setting,

    },
    required: ['name', 'slug', 'states'],
    additionalProperties: true,
  }),
  async (req, res) => {

    const id = req.query.collectionName;


    const isForm = req.query.form;
    let collection = null;

    collection = Boolean(isForm == 'true') ? await findFormById(req.db, id, isForm) : await findColelctionById(req.db, id);


    if (!collection)
      return res.status(403).status(403)
        .json({ error: { message: 'Collection Not Found.' } });

    let { name, states, setting, slug, creator, relationships } = req.body;


    if (await findDocumentBySlug(req.db, collection.slug,  slug)) {
      res
        .status(403)
        .json({ error: { message: 'The document slug has already been used.' } });
      return;
    }

    try {

      const url = `post/${collection.slug}/${slug}`

      const document = await insertDocument(req.db, collection.slug, {
        name,
        slug,
        states,
        url,
        setting,
        relationships,
        creator
      });

      return res.json({ document });

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
