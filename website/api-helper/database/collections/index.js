import { ObjectId } from 'mongodb';
import { dbProjectionUsers } from '..';



export async function findColelctionById(db, id) {

  const collection = await db.collection('collections').aggregate([
    {
      $match: {
        _id: new ObjectId(id),
      },
    },
    {
      $lookup: {
        from: 'collections',
        let: { allRelationships: "$relationships" },
        pipeline: [
          { $match: { $expr: { $in: ['$_id', { $ifNull: ['$$allRelationships', []] }] } } },
          { $project: { _id: 1, slug: 1, name: 1 } }
        ],
        as: 'relations',
      },

    },
  ]).toArray();



  return collection[0];

}

export async function findCollectionsBySearch(db, search, limit = 25) {

  const pageSize = parseInt(limit);

  const res = await db
    .collection('collections')
    .aggregate([

      { $match: { ...(search && { slug: { $regex: search, $options: "i" } }) } },
      { $sort: { _id: 1 } },
      { $limit: pageSize },
      { $project: { _id: 1, name: 1, slug: 1 } },

    ])
    .toArray();

  return { collections: res };
}

export async function findCollections(db, page = 1, limit = 10) {
  const pageSize = parseInt(limit);
  const pageNumber = parseInt(page);


  const res = await db
    .collection('collections')
    .aggregate([
      {
        $facet: {
          collections: [
            { $sort: { _id: -1 } },
            { $skip: (pageNumber - 1) * pageSize },
            { $limit: pageSize },
            {
              $lookup: {
                from: 'forms',
                as: 'form',
                let: { formId: { $toObjectId: '$form._id' } },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ['$_id', '$$formId'] }
                    }
                  },
                  {
                    $project: { _id: 1, name: 1, slug: 1, states: 1, type: 1 }
                  }
                ]
              }
            },
            {
              $unwind: {
                path: '$form',
                preserveNullAndEmptyArrays: true
              }
            },
           
          ],
          total: [
            { $count: 'total' }
          ]
        }
      }
    ])
    .toArray();

  return { collections: res[0].collections, total: res[0].total[0]?.total ?? 0 };
}

export async function insertCollection(db, {
  name,
  slug,
  setting,
  states,
  layout,
  scripts,
  relationships,
  elements,
  type,
  form,
  url,
  components,
  forms,
  styles,
  creator,
  updater }) {
  const collection = {
    name,
    slug,
    setting,
    states,
    form,
    url,
    layout,
    scripts,
    relationships,
    elements,
    type,
    components,
    forms,
    styles,
    creator,
    updater,
    createdAt: new Date(),
  };
  const { insertedId } = await db.collection('collections').insertOne(collection);
  collection._id = insertedId;
  return collection;
}

export async function updateCollectionById(db, id, data) {
  return db
    .collection('collections')
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: 'after' }
    )
    .then((collection) => collection);
}

export async function findCollectionByName(db, name) {

  return db
    .collection('collections')
    .findOne({ slug: name })
    .then((collection) => collection || null);
}



export async function deleteCollectionById(db, id) {

  return await db
    .collection('collections')
    .findOneAndDelete(
      { _id: new ObjectId(id) },
      { returnDocument: 'after' }
    )
    .then((collection) => collection);
}

export async function dropCollection(db, name) {

  return await db
    .collection(name)
    .drop()
    .then(() => true)
    .catch(() => false);
}