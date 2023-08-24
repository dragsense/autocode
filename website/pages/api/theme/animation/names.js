import { authorizeAPI, cors } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
const handler = nc(ncOpts);
import theme from '/pages/api/data/theme.json';


import { generateAnimationNames } from "@/lib/utils"

handler.use(cors, authorizeAPI);

handler.options(async (req, res) => {
    return res.status(200).json({});

});



handler.get(async (req, res) => {

    try {



        const styles = theme.animations ? theme.animations : {};

        const names = generateAnimationNames(styles);


        return res.json({ names });

    } catch (e) {

        res
            .status(403)
            .json({ error: { message: 'Something went wrong.' } });
        return;
    }




});





export default handler;
