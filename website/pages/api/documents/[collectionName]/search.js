
import { findColelctionById, findDocumentsWithKey, findDocumentsBySearch } from '@/api-helper/database';
import { authorizeAPI, database, cors } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.use(cors, authorizeAPI, database);
handler.options(async (req, res) => {
  return res.status(200).json({});

});

handler.get(async (req, res) => {
  try {


    const id = req.query.collectionName;

    const collection = await findColelctionById(req.db, id);


    if (!collection)
      return res.status(403).status(403)
        .json({ error: { message: 'Collection Not Found.' } });

    const results = await findDocumentsBySearch(
      req.db,
      collection.slug,
      req.query.search,
    );

    res.json(results);

  } catch (e) {
    res
      .status(403)
      .json({ error: { message: 'Something went wrong.' } });
    return;
  }

});

handler.patch(
  async (req, res) => {

    let { filters, selectedRelationships } = req.body;

    const id = req.query.collectionName;

    const collection = await findColelctionById(req.db, id);


    if (!collection)
      return res.status(403).status(403)
        .json({ error: { message: 'Collection Not Found.' } });

    let relationships = undefined;

    if (Array.isArray(selectedRelationships) && Array.isArray(collection.relationships)) {
      relationships = collection.relationships.filter(relation => selectedRelationships.some(selected => relation._id == selected._id))
    }



    try {
      const results = await findDocumentsWithKey(
        req.db,
        collection.slug,
        req.query.search || '',
        relationships || [],
        1,
        25,
        filters,
      );


      res.json(results);


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
