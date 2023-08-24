
import { findComponentsBySearch } from '@/api-helper/database';
import { authorizeAPI, database, cors } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.use(cors, authorizeAPI, database);
handler.options(async (req, res) => {
  return res.status(200).json({});

});
handler.get(async (req, res) => {
  try {
    const results = await findComponentsBySearch(
      req.db,
      req.query.search,
    );
    
    res.json(results);

  } catch (e) {
    res
      .status(403)
      .json({ error: { message: 'Something went wrong.' } });
    return;
  }

});



export default handler;
