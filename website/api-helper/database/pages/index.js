import { dbProjectionUsers } from '..';
import { ObjectId } from 'mongodb';




export async function pageElements(db, pipeline) {

  return db.collection('pages').aggregate(pipeline, { cursor: { batchSize: 1 } });

}

export async function findPageById(db, id) {

  return await db
    .collection('pages').findOne({ _id: new ObjectId(id) })
    .then((page) => page || null);

}

export async function findPagesBySearch(db, search, limit = 25) {

  const pageSize = parseInt(limit);


  const res = await db
    .collection('pages')
    .aggregate([

      { $match: { ...(search && { name: { $regex: search, $options: "i" } }) } },
      { $sort: { _id: -1 } },
      { $limit: pageSize },
      { $project: { _id: 1, name: 1 } },

    ])
    .toArray();

  return { pages: res };
}

export async function findPages(db, page = 1, limit = 10) {


  const pageSize = parseInt(limit);
  const pageNumber = parseInt(page);


  const res = await db
    .collection('pages')
    .aggregate([
      {
        $facet: {
          pages: [
            { $sort: { _id: -1 } },
            { $skip: (pageNumber - 1) * pageSize },
            { $limit: pageSize },
            {
              $project: {
                elements: 0,
                components: 0,
                forms: 0,
                styles: 0
              }
            }
          ],
          total: [
            { $count: 'total' }
          ]
        }
      }
    ])
    .toArray();

  return { pages: res[0].pages, total: res[0].total[0]?.total ?? 0 };
}



export async function insertPage(db, {
  name,
  slug,
  layout,
  scripts,
  elements,
  components,
  url,
  forms,
  styles,
  setting,
  creator,
  updater
}) {
  const page = {
    name,
    slug,
    layout,
    scripts,
    elements,
    components,
    forms,
    styles,
    url,
    setting,
    creator,
    updater,
    createdAt: new Date(),
  };
  const { insertedId } = await db.collection('pages').insertOne(page);
  page._id = insertedId;
  return page;
}

export async function updatePageById(db, id, data) {
  return db
    .collection('pages')
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: 'after' }
    )
    .then((page) => page);
}

export async function findPageBySlug(db, slug) {

  return db
    .collection('pages')
    .findOne({ slug })
    .then((page) => page || null);
}

export async function deletePageById(db, id) {

  return await db
    .collection('pages')
    .deleteOne(
      { _id: new ObjectId(id) },
      { returnDocument: 'after' }
    )
    .then((page) => page);
}
