import { findDocumentById, findColelctionById, insertDocument, findFormById, deleteDocumentById } from '@/api-helper/database';
import { ValidateProps } from '@/api-helper/constants';
import { authorizeAPI, database, validateBody, cors } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.use(cors, authorizeAPI, database);
handler.options(async (req, res) => {
    return res.status(200).json({});

});



handler.post(
    validateBody({
        type: 'object',
        properties: {
        },
        required: [],
        additionalProperties: true,
    }),
    async (req, res) => {

        let { creator} = req.body;

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

        let { name, states, setting, relationships } = document;


        try {

            const document = await insertDocument(req.db, collection.slug, {
                name: name + "_copy",
                states,
                creator,
                setting,
                relationships
            });

            return res.json({ document });

        } catch (e) {

            res
                .status(403)
                .json({ error: { message: 'Something went wrong.' } });
            return;
        }

    }
);



export default handler;