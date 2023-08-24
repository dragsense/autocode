
import { findAllPages, searchInAllPages, findDocumentsBySearch } from '@/api-helper/database';
import { authorizeAPI, database, cors } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.use(cors, authorizeAPI, database);
handler.options(async (req, res) => {
    return res.status(200).json({});

});

handler.post(async (req, res) => {
    try {

        const { search } = req.body;


        const pages = await findAllPages(req.db, 'collections')


        const results = await searchInAllPages(
            req.db,
            search,
            req.query.page ? parseInt(req.query.page, 10) : 1,
            req.query.limit ? parseInt(req.query.limit, 10) : 10,
            pages?.pages || []
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
