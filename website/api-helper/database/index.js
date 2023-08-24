export * from './users';
export * from './pages';
export * from './collections';
export * from './components';
export * from './templates';
export * from './media';
export * from './documents';
export * from './layouts';
export * from './forms';

export async function findAllPages(db, name) {
  const res = await db.collection(name).find({}).toArray();
  return { pages: res };
}


export async function searchInAllPages(db, search, page = 1, limit = 10, collections = []) {

  const pageSize = parseInt(limit);
  const pageNumber = parseInt(page);
  const res = await db.collection('pages').aggregate([
    {
      $match: {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { slug: { $regex: search, $options: 'i' } },
          { 'setting.title': { $regex: search, $options: 'i' } },
          { 'setting.desc': { $regex: search, $options: 'i' } },
          { 'setting.content': { $regex: search, $options: 'i' } },
          { 'setting.excerpt': { $regex: search, $options: 'i' } },
        ],
      },
    },
    {
      $project: {
        _id: 0,
        name: 1,
        slug: 1,
        creator: 1,
        url: 1,
        createdAt: 1,
        setting: { $ifNull: ['$setting', {}] },
      },
    },
    ...collections.map((collection) => ({
      $unionWith: {
        coll: collection.slug,
        pipeline: [
          {
            $match: {
              $or: [
                { name: { $regex: search, $options: 'i' } },
                { slug: { $regex: search, $options: 'i' } },
                { 'setting.title': { $regex: search, $options: 'i' } },
                { 'setting.desc': { $regex: search, $options: 'i' } },
                { 'setting.content': { $regex: search, $options: 'i' } },
                { 'setting.excerpt': { $regex: search, $options: 'i' } },
              ],
            },
          },
          {
            $project: {
              _id: 0,
              name: 1,
              slug: 1,
              url: 1,
              createdAt: 1,
              setting: { $ifNull: ['$setting', {}] },
              creator: 1,
            },
          },
        ],
      },
    })),
    {
      $facet: {
        results: [
          {
            $addFields: {
              title: { $ifNull: ['$setting.title', ''] },
              desc: { $ifNull: ['$setting.desc', ''] },
              image: { $ifNull: ['$setting.image', null] },
              excerpt: { $ifNull: ['$setting.excerpt', ''] },
              content: { $ifNull: ['$setting.content', ''] },
              status: { $ifNull: ['$setting.status', ''] },
            },
          },
          {
            $project: {
              setting: 0,
            },
          },
          { $sort: { _id: 1 } },
          { $skip: (pageNumber - 1) * pageSize },
          { $limit: pageSize },
        ],
        totalCount: [
          { $count: 'total' },
        ],
      },
    },
  ]).toArray();



  const { results, totalCount: [{ total }] } = res[0];


  return { results, total };
}

export async function relationInAllPages(db, name, page = 1, limit = 10, collections = []) {
  const pageSize = parseInt(limit);
  const pageNumber = parseInt(page);

  const res = await db.collection('pages').aggregate([{
    $match: {
      slug: { $exists: false },
    },
  },
  ...collections.map((collection) => ({
    $unionWith: {
      coll: collection.slug,
      pipeline: [
        ...(collection.relationships.length > 0
          ? collection.relationships.map((rel) => ({
            $match: {
              [`relationships.${rel.slug}`]: {
                $elemMatch: { name: { $regex: name, $options: 'i' } },
              },
            },
          }))
          : [
            {
              $match: {
                slug: { $exists: false },
              },
            },
          ]),
        {
          $project: {
            _id: 0,
            name: 1,
            slug: 1,
            url: 1,
            createdAt: 1,
            setting: { $ifNull: ['$setting', {}] },
            creator: 1,
          },
        },
      ],
    },
  })),
  {
    $facet: {
      results: [
        {
          $addFields: {
            title: { $ifNull: ['$setting.title', ''] },
            desc: { $ifNull: ['$setting.desc', ''] },
            image: { $ifNull: ['$setting.image', null] },
            excerpt: { $ifNull: ['$setting.excerpt', ''] },
            content: { $ifNull: ['$setting.content', ''] },
            status: { $ifNull: ['$setting.status', ''] },
          },
        },
        {
          $project: {
            setting: 0,
          },
        },
        { $sort: { _id: 1 } },
        { $skip: (pageNumber - 1) * pageSize },
        { $limit: pageSize },
      ],
      totalCount: [
        { $count: 'total' },
      ],
    },
  },
  ]).toArray();

  if (res.length === 0 || res[0].results.length === 0) {
    return { results: [], total: 0 };
  }

  const { results, totalCount } = res[0];
  const total = totalCount.length > 0 ? totalCount[0].total : 0;

  return { results, total }

}

export async function creatorInAllPages(db, creator, page = 1, limit = 10, collections = []) {

  const pageSize = parseInt(limit);
  const pageNumber = parseInt(page);
  const res = await db.collection('pages').aggregate([
    {
      $match: {
        'creator.name': { $regex: creator, $options: 'i' }
      }
    },
    {
      $project: {
        _id: 0,
        name: 1,
        slug: 1,
        creator: 1,
        url: 1,
        createdAt: 1,
        setting: { $ifNull: ['$setting', {}] },
      },
    },
    ...collections.map((collection) => ({
      $unionWith: {
        coll: collection.slug,
        pipeline: [
          {

            $match: {
              'creator.name': { $regex: creator, $options: 'i' }
            }

          },
          {
            $project: {
              _id: 0,
              name: 1,
              slug: 1,
              url: 1,
              createdAt: 1,
              setting: { $ifNull: ['$setting', {}] },
              creator: 1,
            },
          },
        ],
      },
    })),
    {
      $facet: {
        results: [
          {
            $addFields: {
              title: { $ifNull: ['$setting.title', ''] },
              desc: { $ifNull: ['$setting.desc', ''] },
              image: { $ifNull: ['$setting.image', null] },
              excerpt: { $ifNull: ['$setting.excerpt', ''] },
              content: { $ifNull: ['$setting.content', ''] },
              status: { $ifNull: ['$setting.status', ''] },
            },
          },
          {
            $project: {
              setting: 0,
            },
          },
          { $sort: { _id: 1 } },
          { $skip: (pageNumber - 1) * pageSize },
          { $limit: pageSize },
        ],
        totalCount: [
          { $count: 'total' },
        ],
      },
    },
  ]).toArray();


  if (res.length === 0 || res[0].results.length === 0) {
    return { results: [], total: 0 };
  }

  const { results, totalCount } = res[0];
  const total = totalCount.length > 0 ? totalCount[0].total : 0;

  return { results, total }
}

export async function dateInAllPages(db, date, page = 1, limit = 10, collections = []) {

  const pageSize = parseInt(limit);
  const pageNumber = parseInt(page);
  const res = await db.collection('pages').aggregate([
    {
      $match: {
        $or: [
          { createdAt: { $lte: new Date(date) } },
          { updateddAt: { $regex: date, $options: 'i' } }
        ]
      },
    },
    {
      $project: {
        _id: 0,
        name: 1,
        slug: 1,
        creator: 1,
        url: 1,
        createdAt: 1,
        setting: { $ifNull: ['$setting', {}] },
      },
    },
    ...collections.map((collection) => ({
      $unionWith: {
        coll: collection.slug,
        pipeline: [
          {
            $match: {
              $or: [
                { createdAt: { $regex: date, $options: 'i' } },
                { updateddAt: { $regex: date, $options: 'i' } }
              ]
            },
          },
          {
            $project: {
              _id: 0,
              name: 1,
              slug: 1,
              url: 1,
              createdAt: 1,
              setting: { $ifNull: ['$setting', {}] },
              creator: 1,
            },
          },
        ],
      },
    })),
    {
      $facet: {
        results: [
          {
            $addFields: {
              title: { $ifNull: ['$setting.title', ''] },
              desc: { $ifNull: ['$setting.desc', ''] },
              image: { $ifNull: ['$setting.image', null] },
              excerpt: { $ifNull: ['$setting.excerpt', ''] },
              content: { $ifNull: ['$setting.content', ''] },
              status: { $ifNull: ['$setting.status', ''] },
            },
          },
          {
            $project: {
              setting: 0,
            },
          },
          { $sort: { _id: 1 } },
          { $skip: (pageNumber - 1) * pageSize },
          { $limit: pageSize },
        ],
        totalCount: [
          { $count: 'total' },
        ],
      },
    },
  ]).toArray();



  if (res.length === 0 || res[0].results.length === 0) {
    return { results: [], total: 0 };
  }

  const { results, totalCount } = res[0];
  const total = totalCount.length > 0 ? totalCount[0].total : 0;

  return { results, total }
}