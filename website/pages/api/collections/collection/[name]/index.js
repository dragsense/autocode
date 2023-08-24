import { findColelctionById, findCollectionByName, } from '@/api-helper/database';
import { authorizeAPI, database } from '@/api-helper/middlewares';

import { cors } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.use(cors, database, authorizeAPI);
handler.options(async (req, res) => {
    return res.status(200).json({});
  
  });
  
handler.get(async (req, res) => {

    const collection = await findColelctionById(req.db, req.query.name);


    if (!collection)
        return res.status(403).status(403)
            .json({ error: { message: 'Collection Not Found.' } });

    return res.json({collection});
});



export default handler;