import { ObjectId } from 'mongodb';

export async function findTemplateById(db, id) {

  return await db
    .collection('templates').findOne({ _id: new ObjectId(id) })
    .then((template) => template || null);

}

export async function findTemplatesBySearch(db, search, limit = 25) {

  const pageSize = parseInt(limit);


  const res = await db
    .collection('templates')
    .aggregate([

      { $match: { ...(search && { name: search }) } },
      { $sort: { _id: -1 } },
      { $limit: pageSize },
      { $project: { _id: 1, name: 1 } },

    ])
    .toArray();

  return { templates: res[0] };
}


export async function findTemplates(db, category = null, page = 1, limit = 10) {

  const pageSize = parseInt(limit);
  const pageNumber = parseInt(page);

  const res = await db
    .collection('templates')
    .aggregate([
      {
        $facet: {
          templates: [
            {
              $match: {
                ...(category && {
                  categories: {
                    $in: [category]
                  }
                })
              }
            },
            { $sort: { _id: -1 } },
            { $skip: (pageNumber - 1) * pageSize },
            { $limit: pageSize },
            {
              $project: {
                elements: 0,
                styles: 0
              }
            }
          ]
        },
      },
      {
        $project: {
          templates: 1,
          total: { $size: "$templates" }
        }
      }
    ])
    .toArray();

  return { templates: res[0].templates, total: res[0].total };
}

export async function insertTemplate(db, { name, global,
  elements,
  styles,
  creator,
  desc,
  screenShot,
  categories,
  updater }) {
  const template = {
    name,
    global,
    elements,
    styles,
    desc,
    screenShot,
    categories,
    creator,
    updater,
    createdAt: new Date(),
  };
  const { insertedId } = await db.collection('templates').insertOne(template);
  template._id = insertedId;
  return template;
}

export async function insertCategories(db, categories) {
  await db.collection('templates_categories').insertMany(categories);
}

export async function updateTemplateById(db, id, data) {
  return db
    .collection('templates')
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: 'after' }
    )
    .then((template) => template);
}


export async function findTemplateByName(db, name) {

  return db
    .collection('templates')
    .findOne({ name })
    .then((template) => template || null);
}

export async function deleteTemplateById(db, id) {

  return await db
    .collection('templates')
    .findOneAndDelete(
      { _id: new ObjectId(id) },
      { returnDocument: 'after' }
    )
    .then((template) => template);
}
