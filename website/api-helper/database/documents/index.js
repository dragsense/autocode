import { ObjectId } from 'mongodb';
import { dbProjectionUsers } from '..';

export async function findDocumentById(db, name, id) {

  return await db
    .collection(name).findOne({ _id: new ObjectId(id) })
    .then((document) => document || null);

}

export async function findPreviousDocument(db, name, currentDocumentId) {
  const res = await db
    .collection(name)
    .find({ _id: { $lt: new ObjectId(currentDocumentId) } })
    .sort({ _id: -1 })
    .limit(1)
    .toArray();

  return res[0];

}

export async function findNextDocument(db, name, currentDocumentId) {
  const res = await db
    .collection(name)
    .find({ _id: { $gt: new ObjectId(currentDocumentId) } })
    .sort({ _id: 1 })
    .limit(1)
    .toArray();

  return res[0];

}

export async function findDocumentsBySearch(db, slug, search, limit = 25) {

  const pageSize = parseInt(limit);


  const res = await db
    .collection(slug)
    .aggregate([

      { $match: { ...(search && { name: { $regex: search, $options: "i" } }) } },
      { $sort: { _id: 1 } },
      { $limit: pageSize },
      { $project: { _id: 1, name: 1, relationships: 1 } },

    ])
    .toArray();

  return { documents: res };
}

export async function findDocuments(db, name, page = 1, limit = 10) {

  const pageSize = parseInt(limit);
  const pageNumber = parseInt(page);


  const res = await db
    .collection(name)
    .aggregate([
      {
        $facet: {
          documents: [
            { $sort: { _id: -1 } },
            { $skip: (pageNumber - 1) * pageSize },
            { $limit: pageSize }
          ],
          total: [
            { $count: 'total' }
          ]
        }
      }
    ])
    .toArray();

  return { documents: res[0].documents, total: res[0].total[0]?.total ?? 0 };


}

export async function findDocumentsWithRelation(db, name, relationship, page = 0, limit = 10) {

  const pageSize = parseInt(limit);
  const pageNumber = parseInt(page);


  const docs = await db
    .collection(name)
    .aggregate([

      { $sort: { _id: -1 } },
      { $skip: (pageNumber - 1) * pageSize },
      { $limit: pageSize },

      {
        $lookup: {
          from: relationship,
          localField: 'relationship',
          foreignField: '_id',
          as: 'relation',
        },
      },
      { $unwind: '$relation' },
    ])
    .toArray();


  let count = await db.collection(name).find().count();

  return { docs, count };


}

export async function findDocumentsWithKey(
  db,
  name,
  search,
  relationships,
  page = 0,
  limit = 10,
  filters = []) {


  const pageSize = parseInt(limit);
  const pageNumber = parseInt(page);

  const res = await db
    .collection(name)
    .aggregate([
      {
        $facet: {
          documents: [
            {
              $match: {
                ...(search && { name: { $regex: search || '', $options: "i" } }),
                ...filters.reduce((criteria, filter) => {

                  if (!filter.defaultValue) return {};

                  if (filter.filterKey[0] === 'STATES') {

                    criteria[`states.${filter.filterKey[1]}.defaultValue`] = {
                      $regex: filter.defaultValue ?? '',
                      $options: 'i'
                    };
                  }
                  else
                    if (filter.filterKey[0] === 'RELATIONSHIPS') {
                      const field = filter.defaultValue;
                      criteria[`relationships.${field}`] = { $exists: true, $type: 'array', $gt: { $size: 0 } };
                    } else
                      if (filter.filterKey[0] === 'RELATIONS') {
                        const values = Array.isArray(filter.defaultValue) ? filter.defaultValue : [filter.defaultValue]

                        if (filter.filterKey[1] == '_id') {
                          relationships.map((rel, i) => (
                            criteria[`relationships.${rel.slug}._id`] = {
                              $in: values.map(id => id)
                            }
                          ))
                        }
                        else
                          relationships.forEach(rel => {
                            criteria[`relationships.${rel.slug}.${filter.filterKey[1]}`] = {
                              $in: values.map(value => ({
                                $regex: value + '',
                                $options: 'i'
                              }))
                            };
                          });
                      } else
                        if (filter.filterKey[0] === '_id')
                          criteria._id = new ObjectId(filter.defaultValue)
                        else
                          criteria[filter.filterKey[0]] = { $regex: filter.defaultValue + '', $options: 'i' }

                  return criteria;
                }, {})
              }
            },
            ...(Array.isArray(relationships) ? relationships.map((rel, i) => ({
              $lookup: {
                from: rel.slug,
                let: { relationIds: `$relationships.${rel.slug}._id` },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $in: [
                          { $toObjectId: '$_id' },
                          { $map: { input: '$$relationIds', as: 'id', in: { $toObjectId: '$$id' } } }
                        ]
                      }
                    }
                  }
                ],
                as: `relation${i}`
              }
            })) : []),
            {
              $project: {
                _id: 1,
                name: 1,
                url: 1,
                states: 1,
                setting: 1,
                creator: 1,
                createdAt: 1,
                relations: {
                  $concatArrays: [...Array(relationships.length).keys()].map(j => `$relation${j}`)
                }
              }
            },

            { $skip: (pageNumber - 1) * pageSize },
            { $limit: pageSize },

          ],
          total: [
            { $count: 'total' }
          ]
        }
      }
    ])
    .toArray();


  return { documents: res[0].documents, total: res[0].total[0]?.total ?? 0 };


}

export async function findDocumentWithRelation(db,
  documentIds,
  name,
  relationships,
) {

  const pageSize = parseInt(25);
  const pageNumber = parseInt(1);


  const res = await db
    .collection(name)
    .aggregate([
      {
        $facet: {
          documents: [
            {
              $match: {
                _id: {
                  $in: documentIds.map(id => new ObjectId(id))
                }
              }
            },


            ...(Array.isArray(relationships)
              ? relationships.map((rel, i) => ({
                $lookup: {
                  from: rel.slug,
                  let: { categoryIds: `$relationships.${rel.slug}._id` },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $in: [
                            { $toObjectId: '$_id' },
                            { $map: { input: '$$categoryIds', as: 'id', in: { $toObjectId: '$$id' } } }
                          ]
                        }
                      }
                    }
                  ],
                  as: `relation${i}`
                }
              }))
              : []),
            {
              $project: {
                _id: 1,
                name: 1,
                states: 1,
                setting: 1,
                creator: 1,
                createdAt: 1,
                relations: {
                  $concatArrays: [...Array(relationships.length).keys()].map(i => `$relation${i}`)
                }
              }
            },
            { $skip: (pageNumber - 1) * pageSize },
            { $limit: pageSize }
          ]
        }
      },
      {
        $project: {
          documents: 1,
          total: { $size: "$documents" }
        }
      }
    ])
    .toArray();

  return { documents: res[0].documents, total: res[0].total };



}



export async function findDocumentsWithKeyAndRelationship(db,
  name,
  relationship,
  page = 0,
  limit = 10,
  filterKey,
  filterValue
) {

  let key = filterKey ? filterKey[0] : undefined;
  let value = filterValue ? filterValue : '';


  const pageSize = parseInt(limit);
  const pageNumber = parseInt(page);


  let relation = undefined;
  if (key && key === 'relationship') {
    relation = 'relationship'
    key = undefined;
  }



  const docs = await db
    .collection(name)
    .aggregate([
      {
        $match: {

          ...(key && { states: { $elemMatch: { key: key, defaultValue: { $eq: value } } } }),
          ...(relation && value && { relationship: new ObjectId(value) })
        },
      },

      {
        $lookup: {
          from: relationship,
          localField: 'relationship',
          foreignField: '_id',
          as: 'relation',
        },
      },
      { $unwind: '$relation' },
      { $sort: { _id: -1 } },
      { $skip: (pageNumber - 1) * pageSize },
      { $limit: pageSize },


    ])
    .toArray();


  let count = await db.collection(name).find().count();

  return { docs, count };


}

export async function findDocumentWithKeyAndRelationship(db,
  name,
  relationship,
  filterKey,
  filterValue
) {

  const key = filterKey ? filterKey[0] : undefined;
  const value = filterValue ? filterValue : '';



  const docs = await db
    .collection(name)
    .aggregate([
      {
        $match: {

          ...(key && { key: { $in: [value] } })
        }
      },
      { $limit: 1 },
      {
        $lookup: {
          from: relationship,
          localField: 'relationship',
          foreignField: '_id',
          as: 'relation',
        },
      },
    ])
    .toArray();

  if (!docs[0]) return null;
  return docs[0];


}



export async function insertDocument(db, _name, { name, states, url, creator, setting, relationships }) {


  const document = {
    name,
    setting,
    states,
    creator,
    url,
    updater: null,
    relationships,
    createdAt: new Date(),
  };
  const { insertedId } = await db.collection(_name).insertOne(document);
  document._id = insertedId;
  return document;
}

export async function updateDocumentById(db, name, id, data) {
  return db
    .collection(name)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: 'after' }
    )
    .then((document) => document);
}


export async function deleteDocumentById(db, name, id) {

  return await db
    .collection(name)
    .findOneAndDelete(
      { _id: new ObjectId(id) },
      { returnDocument: 'after' }
    )
    .then((document) => document);
}

export async function findDocumentBySlug(db, name, slug) {

  return db
    .collection(name)
    .findOne({ slug })
    .then((document) => document || null);
}
