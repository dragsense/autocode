import { ValidateProps } from '@/api-helper/constants';
import {
  findDocumentsWithRelation,
  findDocumentWithRelation,
  findDocumentsWithKeyAndRelationship,
  findCollectionByName,
  findColelctionById,
  findDocumentsWithKey,
  findDocumentWithKeyAndRelationship,
  findDocumentWithKey
} from '@/api-helper/database';
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

  const collection = await findColelctionById(req.db, id);

  if (!collection)
    return res.status(403).status(403)
      .json({ error: { message: 'Collection Not Found.' } });

  const results = await findDocumentsWithRelation(
    req.db,
    collection.name,
    collection.relationship,
    req.query.page ? parseInt(req.query.page, 10) : 1,
    req.query.limit ? parseInt(req.query.limit, 10) : 10
  );


  res.json({ docs: results.docs, count: results.count });
});



handler.post(
  async (req, res) => {

 
      let { filters, withRelationship, selectedRelationships } = req.body;

      const id = req.query.collectionName;

      try {
      const collection = await findColelctionById(req.db, id);

      if (!collection)
        return res.status(403).status(403)
          .json({ error: { message: 'Collection Not Found.' } });


      let relationships = [];
      if (withRelationship && Array.isArray(selectedRelationships) && Array.isArray(collection.relationships)) {
        relationships = collection.relationships.filter(relation => selectedRelationships.some(selected => relation._id == selected._id))
      }


      const results = await findDocumentsWithKey(
        req.db,
        collection.slug,
        '',
        relationships,
        req.query.page ? parseInt(req.query.page, 10) : 1,
        req.query.limit ? parseInt(req.query.limit, 10) : 10,
        Array.isArray(filters) ? filters : [],
      );


      res.json({ ...results });
    }
    catch (e) {


      res
        .status(403)
        .json({ error: { message: 'Something went wrong.' } });
      return;
    }
  }
);

handler.patch(
  async (req, res) => {

    let { documentIds, withRelationship, selectedRelationships } = req.body;



    const id = req.query.collectionName;

    const collection = await findColelctionById(req.db, id);

    if (!collection)
      return res.status(403).status(403)
        .json({ error: { message: 'Collection Not Found.' } });

    if (!documentIds || documentIds?.length <= 0)
      return res.status(403).status(403)
        .json({ error: { message: 'Document Not Found.' } });



    const docIds = Array.isArray(documentIds) ? documentIds : [documentIds];

    let relationships = undefined;

    if (withRelationship && Array.isArray(selectedRelationships) && Array.isArray(collection.relationships)) {
      relationships = collection.relationships.filter(relation => selectedRelationships.some(selected => relation._id == selected._id))
    }

  
    try {
 
      const results = await findDocumentWithRelation(
        req.db,
        docIds, 
        collection.slug,
        relationships || []
      );


      res.json({ ...results });

    } catch (e) {


      res
        .status(403)
        .json({ error: { message: 'Something went wrong.' } });
      return;
    }
  }
);

export default handler;
