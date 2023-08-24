import { ValidateProps } from '@/api-helper/constants';

import { authorizeAPI, cors } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
import theme from '../data/theme.json';
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

  


    theme.templates = theme.templates || {};
    theme.templates.categories = Array.isArray(theme.templates.categories) ? theme.templates.categories : [];
    const categories = theme.templates.categories;
    res.json({ categories });

  } catch (e) {


    res
      .status(403)
      .json({ error: { message: 'Something went wrong.' } });
    return;
  }
});



export default handler;
