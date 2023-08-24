import { ValidateProps } from '@/api-helper/constants';
import { authorizeAPI, cors, validateBody } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
import { save, saveData } from '@/lib/saveData';
import theme from '../../data/theme.json';
var fs = require('fs');
var path = require('path');
var sourceDir = path.join('', "./pages/api/data");

const dir = `${sourceDir}/theme.json`;

const handler = nc(ncOpts);

handler.use(cors, authorizeAPI);

handler.options(async (req, res) => {
  return res.status(200).json({});

});


handler.get(async (req, res) => {

  try {



    let code = '';
    if(theme.themeJs)
     code = theme.themeJs.code;

    return res.json({ code });
  } catch (e) {

    console.log(e?.message)
    res
      .status(403)
      .json({ error: { message: 'Something went wrong.' } });
    return;
  }

});

handler.post(validateBody({
  type: 'object',
  properties: {
    code: ValidateProps.theme.js.code,
  },
  required: ['code'],
  additionalProperties: true,
}),
  async (req, res) => {


    try {
      const { code } = req.body;

      
  

      theme.themeJs = { code };
      saveData('./pages/api/data/theme.json', theme);

      return res.json({ status: true });

    } catch (e) {

      console.log(e?.message)
      res
        .status(403)
        .json({ error: { message: 'Something went wrong.' } });
      return;
    }
  }
);



export default handler;
