import { findDocumentById,findColelctionById, updateDocumentById, findFormById, deleteDocumentById } from '@/api-helper/database';
import { ValidateProps } from '@/api-helper/constants';
import { authorizeAPI, database, validateBody, cors } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.use(cors, authorizeAPI, database);
handler.options(async (req, res) => {
    return res.status(200).json({});
  
  });
  
handler.get(async (req, res) => {


    try {

        const id = req.query.collectionName;
        const isForm = req.query.form;
        let collection = null;
      
        if (Boolean(isForm == 'true'))
          collection = await findFormById(req.db, id);
        else
          collection = await findColelctionById(req.db, id);


        const document = await findDocumentById(req.db, collection.slug, req.query.documentId);

        if (!document)
            return res.status(403).status(403)
                .json({ error: { message: 'Document Not Found.' } });

        res.json({ document });

    } catch (e) {
        res
            .status(403)
            .json({ error: { message: 'Something went wrong.' } });
        return;
    }
});

handler.post(
    validateBody({
        type: 'object',
        properties: {
            name: ValidateProps.document.name,
            states: ValidateProps.document.states,
            slug: ValidateProps.document.slug,

        },
        required: ['name', 'states', 'slug'],
        additionalProperties: true,
    }),
    async (req, res) => {


        const id = req.query.collectionName;

        const isForm = req.query.form;
        let collection = null;
      
        if (Boolean(isForm == 'true'))
          collection = await findFormById(req.db, id);
        else
          collection = await findColelctionById(req.db, id);


        if (!collection)
            return res.status(403).status(403)
                .json({ error: { message: 'Collection Not Found.' } });


        const document = await findDocumentById(req.db, collection.slug, req.query.documentId);

        if (!document) 
            return res.status(403).status(403)
                .json({ error: { message: 'Document Not Found.' } });

        let { name, slug, states, setting, creator, relationships } = req.body;

    
        const url = `/post/${collection.slug}/${slug}`

        try {

            const updated = await updateDocumentById(req.db, collection.slug, document._id, {
                name,
                slug,
                states,
                setting,
                url,
                updater: creator,

                relationships
            });

            return res.json({ document: updated.document });

        } catch (e) {

            console.log(e?.message)
            res
                .status(403)
                .json({ error: { message: 'Something went wrong.' } });
            return;
        }

    }
);

handler.delete(async (req, res) => {



    try {

        const id = req.query.collectionName;

        const isForm = req.query.form;
        let collection = null;
      
        if (Boolean(isForm == 'true'))
          collection = await findFormById(req.db, id);
        else
          collection = await findColelctionById(req.db, id);


        if (!collection)
            return res.status(403).status(403)
                .json({ error: { message: 'Collection Not Found.' } });

        const document = await deleteDocumentById(req.db, collection.slug, req.query.documentId);

        if (!document)
            return res.status(403).status(403)
                .json({ error: { message: 'Document Not Found.' } });

        res.json({ status: true });

    } catch (e) {

        console.log(e?.message)
        res
            .status(403)
            .json({ error: { message: 'Something went wrong.' } });
        return;
    }
});

export default handler;