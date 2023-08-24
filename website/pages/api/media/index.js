import { ValidateProps } from '@/api-helper/constants';
import { findMedia, insertMedia, updateMediaById } from '@/api-helper/database';
import { authorizeAPI, database, validateBody, cors, uploadFiles } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
import fs from 'fs';
import sizeOf from 'image-size';

const handler = nc(ncOpts);

handler.use(cors, database);
handler.options(async (req, res) => {
  return res.status(200).json({});

});

handler.get(async (req, res) => {

  console.log(req.query.field)

  try {
    const results = await findMedia(
      req.db,
      req.query.page ? parseInt(req.query.page, 10) : 1,
      req.query.field,
      req.query.type,
      req.query.limit ? parseInt(req.query.limit, 10) : 10
    );



    res.json(results);

  } catch (e) {
    res
      .status(403)
      .json({ error: { message: 'Something went wrong.' } });
    return;
  }
});

handler.post(
  uploadFiles.single('file'),
  async (req, res) => {

    const file = req.file;
    const type = req.query.type;


    const proto =
      req.headers["x-forwarded-proto"] || req.connection.encrypted
        ? "https"
        : "http";
    const url = 'http://' + req.headers.host;



    try {

      const stats = fs.statSync(file.path);
      const fileSizeInBytes = stats.size;

      let dimensions = null;
      if (type === 'images') {
        dimensions = sizeOf(file.path);
      }

      const src = url + '/uploads/' + type + "/" + file.filename;
      const media = await insertMedia(req.db, {
        src,
        fileName: file.filename,
        name: file.originalname,
        type,
        mimetype: file.mimetype,
        alt: file.filename,
        size: fileSizeInBytes,
        dimensions,
      });


      return res.json({ media });

    } catch (e) {

      res
        .status(403)
        .json({ error: { message: 'Something went wrong.' } });
      return;
    }
  });


export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
