import { ValidateProps } from '@/api-helper/constants';
import { findMediaById, deleteMediaById, updateMediaById, findMediaByName } from '@/api-helper/database';
import { validateBody, database, cors } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
const fs = require('fs');
const handler = nc(ncOpts);

handler.use(cors, database);
handler.options(async (req, res) => {
  return res.status(200).json({});

});

handler.get(async (req, res) => {


  try {
    const media = await findMediaById(req.db, req.query.mediaId);

    if (!media)
      return res.status(403).status(403)
        .json({ error: { message: 'Media Not Found.' } });


    res.json({ media });

  } catch (e) {
    res
      .status(403)
      .json({ error: { message: 'Something went wrong.' } });
    return;
  }
});


handler.patch(validateBody({
  type: 'object',
  properties: {
    name: ValidateProps.form.name,
  },
  required: ['name'],
  additionalProperties: true,
}),
  async (req, res) => {

    const { name, alt, format } = req.body;

    const media = await findMediaById(req.db, req.query.mediaId);

    if (!media)
      return res.status(403).status(403)
        .json({ error: { message: 'media Not Found.' } });


    if (await findMediaByName(req.db, name) && name !== media.name) {
      res
        .status(403)
        .json({ error: { message: 'The media name has already been used.' } });
      return;
    }

    try {

      const updatedMedia = await updateMediaById(req.db, media._id, {
        name, alt, format
      });


      res.json({ media: updatedMedia.value });

    } catch (e) {
      res
        .status(403)
        .json({ error: { message: 'Something went wrong.' } });
      return;
    }
  }
);

handler.delete(async (req, res) => {

  const media = await deleteMediaById(req.db, req.query.mediaId);


  if (!media.value)
    return res.status(403).status(403)
      .json({ error: { message: 'Media Not Found.' } });

  try {
    const path = `./public/uploads/${media.value.type}/${media.value.fileName}`;

    fs.unlink(path, (err) => {
      if (err) {
        console.error(err)
      }

      //file removed
    })

    res.json({ status: true });

  } catch (e) {
    res
      .status(403)
      .json({ error: { message: 'Something went wrong.' } });
    return;
  }

});



export default handler;