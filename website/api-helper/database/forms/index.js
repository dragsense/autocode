import { ObjectId } from 'mongodb';

export async function findFormById(db, id) {


  return await db
    .collection('forms').findOne({ _id: new ObjectId(id) })
    .then((form) => form || null);

}

export async function findFormsBySearch(db, search, limit = 25) {

  const pageSize = parseInt(limit);


  const res = await db
    .collection('forms')
    .aggregate([

      { $match: { ...(search && { slug: { $regex: search, $options: "i" } }) } },
      { $sort: { _id: -1 } },
      { $limit: pageSize },
      { $project: { _id: 1, name: 1, slug: 1 } },

    ])
    .toArray();

    return { forms: res };
  }



export async function findForms(db, page = 1, limit = 10) {


  const pageSize = parseInt(limit);
  const pageNumber = parseInt(page);


  const res = await db
    .collection('forms')
    .aggregate([
      {
        $facet: {
          forms: [
            { $sort: { _id: -1 } },
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


  return { forms: res[0].forms, total: res[0].total[0]?.total ?? 0 };
}

export async function insertForm(db, {
  name, slug, record, emailbody, states, setting,
  elements,
  components,
  type,
  styles,
  updater,
  creator
}) {
  const form = {
    name, slug, record, emailbody, states, setting,
    elements,
    type,
    components,
    styles,
    updater,
    creator,
    createdAt: new Date(),
  };
  const { insertedId } = await db.collection('forms').insertOne(form);
  form._id = insertedId;
  return form;
}

export async function updateFormById(db, id, data) {
  return db
    .collection('forms')
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: 'after' }
    )
    .then((form) => form);
}

export async function findFormByName(db, name) {

  return db
    .collection('forms')
    .findOne({ slug: name })
    .then((form) => form || null);
}



export async function deleteFormById(db, id) {

  return await db
    .collection('forms')
    .findOneAndDelete(
      { _id: new ObjectId(id) },
      { returnDocument: 'after' }
    )
    .then((form) => form);
}
