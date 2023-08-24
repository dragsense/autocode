import { authorizeAPI, database } from '@/api-helper/middlewares';

import { cors } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
const zlib = require('zlib');
const JSZip = require("jszip");

import { restoreSnap } from '@/lib/mongoSnap';

var fs = require('fs');
var fs_Extra = require('fs-extra');
var path = require('path');

var sourceDir = path.join('', "./themes");
var destinationDir = path.join('', "./pages/api/data");

const handler = nc(ncOpts);

handler.use(cors, database, authorizeAPI);
handler.options(async (req, res) => {
  return res.status(200).json({});

});

handler.get(async (req, res) => {

  const id = req.query.themeId;


  if (!fs.existsSync(`${sourceDir}/${id}.zip`)) {
    return res
      .status(403)
      .json({ error: { message: 'Backup Folder not exist.' } });

  }

  try {
    const folderPath = `${sourceDir}/${id}.zip`;

    const readStream = fs.createReadStream(folderPath);

    var stat = fs.statSync(folderPath);

    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename=${id}.zip`);

    readStream.pipe(res);


  } catch (e) {

    res
      .status(403)
      .json({ error: { message: 'Something went wrong.' } });
    return;
  }

});

handler.post(async (req, res) => {

  const id = req.query.themeId;

  try {

    req.pipe(fs.createWriteStream(`${sourceDir}/${id}.zip`));

    req.on("end", () => {
      res.end();
    });

  } catch (e) {

    res
      .status(403)
      .json({ error: { message: 'Something went wrong.' } });
    return;
  }

});


handler.patch(
  async (req, res) => {


    const id = req.query.themeId;

    try {
      if (!fs.existsSync(`${sourceDir}/${id}.zip`)) {
        return res
          .status(403)
          .json({ error: { message: 'Theme Folder not exist.' } });
      }

      const zipFile = fs.readFileSync(`${sourceDir}/${id}.zip`);

      JSZip.loadAsync(zipFile)
        .then(async function (zip) {
          zip.forEach(function (relativePath, file) {

            const pathComponents = relativePath.split("/");

            if (pathComponents[0] === "backups") {
              pathComponents.shift();
            }

            const filePath = sourceDir + "/" + pathComponents.join("/");

            if (!file.dir) {
              file.nodeStream()
                .pipe(fs.createWriteStream(filePath))
                .on("finish", function () {
                });
            } else {
              fs.mkdirSync(filePath, { recursive: true });
            }
          });

          if (!fs.existsSync(`${sourceDir}/${id}`)) {
            return res
              .status(403)
              .json({ error: { message: 'Backup Folder not exist.' } });
          }



          if (!fs.existsSync(`${destinationDir}`))
            fs.mkdirSync(`${destinationDir}`, { recursive: true });

          const folderPath = `${sourceDir}/${id}`;


          await fs_Extra.copy(`${folderPath}/files`, destinationDir);
          await fs_Extra.copy(`${folderPath}/static`, `public/static`);
          await restoreSnap(`${folderPath}`); // backup

          fs.rmSync(`${folderPath}`, { recursive: true });


        });



      return res.status(200).json({ status: true });


    } catch (e) {

      console.log(e?.message);


      res
        .status(403)
        .json({ error: { message: 'Something went wrong.' } });
      return;
    }

  }
);



handler.delete(async (req, res) => {

  const id = req.query.themeId;

  if (!fs.existsSync(`${sourceDir}/${id}.zip`)) {
    return res
      .status(403)
      .json({ error: { message: 'Backup Folder not exist.' } });

  }

  try {
    fs.rmSync(`${sourceDir}/${id}.zip`, { recursive: true });

    res.status(200).json({ status: true });

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
}

export default handler;