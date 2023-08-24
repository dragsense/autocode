
import fs from "fs";
import JSZip from "jszip";

const addFilesFromDirectoryToZip = (directoryPath = "", zip) => {
  const directoryContents = fs.readdirSync(directoryPath, {
    withFileTypes: true,
  });

  directoryContents.forEach(({ name }) => {

      const path = `${directoryPath}/${name}`;

      if (fs.statSync(path).isFile()) {
        let file = fs.readFileSync(path, "utf-8");
          zip.file(path, file);
      }

      if (fs.statSync(path).isDirectory()) {
        addFilesFromDirectoryToZip(path, zip);
      }
   
  });
};


export const addFilesToZip = async (paths = [], type) => {

  if(paths && paths.length > 0){
  const zip = new JSZip();
  paths.forEach(({ path }) => {

      if (fs.statSync(path).isFile()) {
        let file = fs.readFileSync(path, "utf-8");
          zip.file(path, file);
      }

      if (fs.statSync(path).isDirectory()) {
        addFilesFromDirectoryToZip(path, zip);
      }
   
  });

  const zipAs= await zip.generateAsync({ type });

  return zipAs;
}
};

export default async (directoryPath = "",type) => {
  const zip = new JSZip();

  if (directoryPath)
    addFilesFromDirectoryToZip(directoryPath, zip);

  return zip.generateAsync({ type });

};