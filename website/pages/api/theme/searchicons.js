import { ValidateProps } from '@/api-helper/constants';
import { authorizeAPI, database, validateBody, cors } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
import { save, saveData } from '@/lib/saveData';
import theme from '../data/theme.json';
const handler = nc(ncOpts);
var fs = require('fs');
import { nanoid } from 'nanoid';

var path = require('path');
var sourceDir = path.join('', "./pages/api/data");

const dir = `${sourceDir}/theme.json`;


handler.use(cors, authorizeAPI);

handler.options(async (req, res) => {
    return res.status(200).json({});

});

handler.get(async (req, res) => {
    try {
        const limit =  25; // Set a default limit if not provided
        const searchQuery = req.query.search;
    
        const icons = Array.isArray(theme.icons) ? theme.icons : [];
    
        // Filter icons based on the search query
        let filteredIcons = icons;
        if (searchQuery) {
          const searchRegex = new RegExp(searchQuery, 'i');
          filteredIcons = icons.filter(icon => searchRegex.test(icon.name));
        }
    
        // Limit the number of results
        const limitedIcons = filteredIcons.slice(0, limit);
    
        res.json({
          icons: limitedIcons,
        });
      } catch (e) {
        res.status(403).json({ error: { message: 'Something went wrong.' } });
        return;
      }
  });

  export default handler;
