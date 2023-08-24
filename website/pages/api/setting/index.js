import { ValidateProps } from '@/api-helper/constants';
import { authorizeAPI, database, validateBody, cors } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
import { saveData } from '@/lib/saveData';
import setting from '../data/setting.json';
const handler = nc(ncOpts);

handler.use(cors, authorizeAPI);
handler.options(async (req, res) => {
    return res.status(200).json({});
  
  });
  
handler.get(async (req, res) => {

    try {
        res.json({ setting });

    } catch (e) {

        console.log(e?.message);
        res
            .status(403)
            .json({ error: { message: 'Something went wrong.' } });
        return;
    }
});

handler.post(
    validateBody({
        type: 'object',
        properties: {
            webtitle: ValidateProps.setting.webtitle,
        },
        required: ['webtitle'],
        additionalProperties: true,
    }),
    async (req, res) => {

        const { webtitle,
            tagLine,
            desc, timeZone,
            _id,
            lang,
            author,
            keywords,
            homePage,
            searchPage,
            maintenancePage,
            email,
            errorPage,
            scripts,
            images } = req.body;


        saveData('./pages/api/data/setting.json', {
            webtitle, lang,
            author,
            keywords, tagLine, _id, desc, searchPage, maintenancePage,  timeZone, homePage, email, errorPage, images, scripts
        });

        return res.json({
            setting: {
                webtitle, lang,
                author,
                keywords, tagLine, desc, timeZone, searchPage, maintenancePage,  homePage, email, errorPage, images, scripts
            }
        });
    }
);


export default handler;
