//import argon2 from 'argon2';
import { ObjectId } from 'mongodb';
import normalizeEmail from 'validator/lib/normalizeEmail';

export async function findUserWithEmailAndPassword(db, email, password) {

  email = normalizeEmail(email);
  const user = await db.collection('users').findOne({ email });
  if (user 
    //&& 
    // (await argon2.verify(user.password, password))
    ) {
    return { ...user, password: undefined }; // filtered out password
  }
  return null;
}

export async function findUsersBySearch(db, search, limit = 25) {

  const pageSize = parseInt(limit);


  const res = await db
    .collection('users')
    .aggregate([

      { $match: {   ...(search && { name: search })} },
      { $sort: { _id: -1 } },
      { $limit: pageSize },
      { $project: { _id: 1, name: 1 } },

    ])
    .toArray();

  return { users: res[0] };
}

export async function findUserById(db, userId) {
  return db
    .collection('users')
    .findOne({ _id: new ObjectId(userId) }, { projection: dbProjectionUsers() })
    .then((user) => user || null);
}



export async function findUserByEmail(db, email) {
  email = normalizeEmail(email);
  return db
    .collection('users')
    .findOne({ email }, { projection: dbProjectionUsers() })
    .then((user) => user || null);
}

export async function updateUserById(db, id, data) {
  return db
    .collection('users')
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: 'after', projection: { password: 0 } }
    )
    .then(({ value }) => value);
}


export async function insertUser(
  db,
  { email,
    originalPassword,
    emailVerified = null,
    image = null,
    name, }
) {
  const user = {
    emailVerified,
    image,
    email,
    name,
  };

  const password = originalPassword 
  //&& await argon2.hash(originalPassword);
  const { insertedId } = await db
    .collection('users')
    .insertOne({ ...user, password });
  user._id = insertedId;
  return user;
}


export async function getUserPassword(db, id) {
  return db
    .collection('users')
    .findOne({ _id: new ObjectId(id) })
    .then((user) => user?.password || null);
}

export async function updateUserPasswordByOldPassword(
  db,
  id,
  oldPassword,
  newPassword
) {
  const user = await db.collection('users').findOne(new ObjectId(id));
  if (!user) return false;
  const matched = await argon2.verify(user.password, oldPassword);
  if (!matched) return false;
  const password = await argon2.hash(newPassword);
  await db
    .collection('users')
    .updateOne({ _id: new ObjectId(id) }, { $set: { password } });
  return true;
}

export async function UNSAFE_updateUserPassword(db, id, newPassword) {
  const password = await argon2.hash(newPassword);
  await db
    .collection('users')
    .updateOne({ _id: new ObjectId(id) }, { $set: { password } });
  return true;
}

export function dbProjectionUsers(prefix = '') {
  return {
    [`${prefix}password`]: 0,
    [`${prefix}email`]: 0,
    [`${prefix}emailVerified`]: 0,
  };
}
