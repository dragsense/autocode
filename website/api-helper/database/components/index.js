import { ObjectId } from 'mongodb';

export async function findComponentById(db, id) {
 

  return await db
  .collection('components').findOne({ _id: new ObjectId(id) })
  .then((component) => component || null);

}


export async function findComponentsBySearch(db, search, limit = 25) {

  const pageSize = parseInt(limit);


  const res = await db
    .collection('components')
    .aggregate([

      { $match: { ...(search && { name: { $regex: search, $options: "i" } }) } },
      { $sort: { _id: -1 } },
      { $limit: pageSize },
      { $project: { _id: 1, name: 1 } },

    ])
    .toArray();

  return { components: res };
}


export async function findComponents(db, page = 1, limit = 10) {
  const pageSize = parseInt(limit);
  const pageNumber = parseInt(page);


  const res = await db
    .collection('components')
    .aggregate([
      {
        $facet: {
          components: [
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

  return { components: res[0].components, total: res[0].total[0]?.total ?? 0 };
}

export async function insertComponent(db, {
  name,
  states,
  collection,
  elements,
  parent,
  components,
  forms,
  styles,
  creator,
  updater

}) {
  const component = {
    name,
    states,
    collection,
    elements,
    parent,
    components,
    forms,
    styles,
    creator,
    updater,
    createdAt: new Date(),
  };
  const { insertedId } = await db.collection('components').insertOne(component);
  component._id = insertedId;
  return component;
}

export async function updateComponentById(db, id, data) {
  return db
    .collection('components')
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: 'after'}
    )
    .then((component) => component);
}


export async function findComponentByName(db, name) {

  return db
    .collection('components')
    .findOne({ name })
    .then((component) => component || null);
}

export async function deleteComponentById(db, id) {

  return await db
    .collection('components')
    .findOneAndDelete(
      { _id: new ObjectId(id) },
      { returnDocument: 'after'}
    )
    .then((component) => component);
}
