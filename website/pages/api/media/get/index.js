import { findMediaByField } from '@/api-helper/database';
import { authorizeAPI, database, cors, } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';


const handler = nc(ncOpts);

handler.use(cors, database);
handler.options(async (req, res) => {
  return res.status(200).json({});

});

handler.get(async (req, res) => {

  try {
    const media = await findMediaByField(
      req.db,
      req.query.field,
      req.query.type,
    );


    res.json({ media });

  } catch (e) {
    res
      .status(403)
      .json({ error: { message: 'Something went wrong.' } });
    return;
  }
});


export default handler;
