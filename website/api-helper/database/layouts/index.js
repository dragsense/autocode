import { ObjectId } from 'mongodb';

export async function findLayoutById(db, id) {



  return await db
    .collection('layouts').findOne({ _id: new ObjectId(id) })
    .then((layout) => layout || null);

}


export async function findLayoutsBySearch(db, search, limit = 25) {

  const pageSize = parseInt(limit);


  const res = await db
    .collection('layouts')
    .aggregate([

      { $match: { ...(search && { name: { $regex: search, $options: "i" } }) } },
      { $sort: { _id: -1 } },
      { $limit: pageSize },
      { $project: { _id: 1, name: 1 } },

    ])
    .toArray();


  return { layouts: res };
}


export async function findLayouts(db, page = 0, limit = 10) {
  const pageSize = parseInt(limit);
  const pageNumber = parseInt(page);


  const res = await db
    .collection('layouts')
    .aggregate([
      {
        $facet: {
          layouts: [
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

  return { layouts: res[0].layouts, total: res[0].total[0]?.total ?? 0 };
}

export async function insertLayout(db, { name, components, topComponent,
  bottomComponent, }) {
  const layout = {
    name,
    topComponent,
    bottomComponent,
    components,
    createdAt: new Date(),
  };
  const { insertedId } = await db.collection('layouts').insertOne(layout);
  layout._id = insertedId;
  return layout;
}

export async function updateLayoutById(db, id, components) {
  return db
    .collection('layouts')
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: components },
      { returnDocument: 'after' }
    )
    .then((layout) => layout);
}



export async function findLayoutByName(db, name) {

  return db
    .collection('layouts')
    .findOne({ name })
    .then((layout) => layout || null);
}


export async function deleteLayouById(db, id) {

  return await db
    .collection('layouts')
    .findOneAndDelete(
      { _id: new ObjectId(id) },
      { returnDocument: 'after' }
    )
    .then((layout) => layout);
}
