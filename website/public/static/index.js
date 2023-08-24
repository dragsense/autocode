const AdmZip = require('adm-zip');
const axios = require('axios');

// 1. Create an endpoint in Next.js API
app.post('/zip-and-send', (req, res) => {
  // 2. Create a zip file
  const zip = new AdmZip();
  zip.addFile('file1.txt', Buffer.from('Hello World'));
  zip.addFile('file2.txt', Buffer.from('Goodbye World'));

  // 3. Send the zip file to other server
  axios.post('https://other-server.com/receive-zip', zip.toBuffer(), {
    headers: {
      'Content-Type': 'application/octet-stream',
    },
  });

  res.send('Zip file sent to other server');
});
