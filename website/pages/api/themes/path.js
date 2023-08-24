import { authorizeAPI, cors } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';

import fs from 'fs'
import path from 'path'

const handler = nc(ncOpts);

handler.use(cors, authorizeAPI);
handler.options(async (req, res) => {
    return res.status(200).json({});
  
  });
  

async function walk(dir, rootDir) {
    let files = await fs.readdirSync(path.join(rootDir, dir));
    files = await Promise.all(files.map(async file => {
        const filePath = dir +"/"+file;
        const rootPath = path.join(rootDir,filePath);
        const stats = await fs.statSync(rootPath);
        if (stats.isDirectory()) return filePath;
        //if(stats.isFile()) return filePath;
    }));

    return files.reduce((all, folderContents) => all.concat(folderContents), []);
}




handler.get(async (req, res) => {

    let entries = [];



try {
    entries = await walk('', 'themes');

   
}catch(e) {
    
}

    return res.json(entries);
});


export default handler;
