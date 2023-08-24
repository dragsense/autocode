import fs from 'fs';

export function saveData(fileName, data) {
    fs.writeFileSync(fileName, JSON.stringify(data, null, 4), { flag: 'w' });
}

export function save(fileName, data) {
    
    fs.writeFileSync(fileName, data, { flag: 'w' });
}



export async function read(fileName) {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, 'utf-8', function (err, data) {

            if(err)
            reject(null);
            
            resolve(data);
        });
    });


}