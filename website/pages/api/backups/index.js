
import { ValidateProps } from '@/api-helper/constants';

import { authorizeAPI, database, validateBody, cors } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
import zip from '@/api-helper/zip';

import { mongoSnap } from '@/lib/mongoSnap';

var fs = require('fs');
var fs_Extra = require('fs-extra');
var path = require('path');

var sourceDir = path.join('', "./pages/api/data");
var destinationDir = path.join('', "./backups")

const handler = nc(ncOpts);

handler.use(cors, authorizeAPI, database);
handler.options(async (req, res) => {
  return res.status(200).json({});

});


handler.post(validateBody({
  type: 'object',
  properties: {
    id: ValidateProps.backup.id,
  },
  required: ['id'],
  additionalProperties: true,
}),
  async (req, res) => {


    const { id } = req.body;

    try {
      if (fs.existsSync(`${destinationDir}/${id}`)) {
        return res
          .status(403)
          .json({ error: { message: 'Backup Folder already exist.' } });

      }
      else {
        fs.mkdirSync(`${destinationDir}/${id}`, { recursive: true });
        fs.mkdirSync(`${destinationDir}/${id}/files`, { recursive: true });
        fs.mkdirSync(`${destinationDir}/${id}/static`, { recursive: true });
      }


      const createBackup = async () => {
        await fs_Extra.copy(sourceDir, `${destinationDir}/${id}/files`);
        await fs_Extra.copy(`public/static`, `${destinationDir}/${id}/static`);
        await mongoSnap(`${destinationDir}/${id}/collections.tar`); // backup


        const folderPath = `${destinationDir}/${id}`;
       

        zip(`${folderPath}`, "nodebuffer").then(function (content) {
          fs.writeFileSync(`${folderPath}.zip`, content);

          fs.rmSync(`${folderPath}`, { recursive: true });

        });


      }

      createBackup();


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



export default handler;

