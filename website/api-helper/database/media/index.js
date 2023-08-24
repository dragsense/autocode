import { ObjectId } from 'mongodb';
import { dbProjectionUsers } from '..';

export async function findMediaById(db, id) {

  return await db
    .collection('media').findOne({ _id: new ObjectId(id) })
    .then((media) => media || null);

}



export async function findMediaByName(db, name) {

  return await db
    .collection('media').findOne({ name })
    .then((media) => media || null);

}

export async function findMediaBySearch(db, search, type = '', limit = 25) {

  const pageSize = parseInt(limit);


  const res = await db
    .collection('media')
    .aggregate([
      { $match: {  ...(search && { name: { $regex: search, $options: "i" } }), ...(type && { type: type })} },
      { $sort: { _id: -1 } },
      { $limit: pageSize },

    ])
    .toArray();

    console.log(search, type, res)


    return { media: res };
  }



export async function findMedia(db, page = 1,field, type, limit = 10) {
  
    
  const pageSize = parseInt(limit);
  const pageNumber = parseInt(page);


  const res = await db
    .collection('media')
    .aggregate([
      {
        $facet: {
          media: [
            {
              $match: {
                ...(type && { type }),
                ...(field && { [field] : true }),
              }
            },
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

  return { media: res[0].media, total: res[0].total[0]?.total ?? 0 };

    
}

export async function findMediaByField(db, field, value, type) {

  
  console.log(field, value);
  return await db
    .collection('media')
    .aggregate([
      {
        $match: {
        
            ...(field && { [field] : true }),
            ...(type && {type})
         
          
        }
      },
      { $sort: { _id: -1 } },
    ])
    .toArray();
}


export async function insertMedia(db, { src,
  name,
  type,
  alt,
  format,
  fileName,
  size,
  dimensions,
  mimetype }) {
  const media = {
    src,
    name,
    type,
    fileName,
    alt,
    size,
    format,
    dimensions,
    mimetype,
    createdAt: new Date(),
  };
  const { insertedId } = await db.collection('media').insertOne(media);
  media._id = insertedId;
  return media;
}

export async function updateMediaById(db, id, data) {
  return db
    .collection('media')
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: 'after' }
    )
    .then((media) => media);
}

export async function deleteMediaById(db, id) {

  return await db
    .collection('media')
    .findOneAndDelete(
      { _id: new ObjectId(id) },
      { returnDocument: 'after' }
    )
    .then((media) => media);
}


