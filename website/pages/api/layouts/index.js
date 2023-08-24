import { ValidateProps } from '@/api-helper/constants';
import { findLayouts, insertLayout, findLayoutById, updateLayoutById, findLayoutByName } from '@/api-helper/database';
import { authorizeAPI, database, validateBody, cors } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.use(cors, authorizeAPI, database);
handler.options(async (req, res) => {
  return res.status(200).json({});

});

handler.get(async (req, res) => {


  try {
    const results = await findLayouts(
      req.db,
      req.query.page ? parseInt(req.query.page, 10) : 1,
      req.query.limit ? parseInt(req.query.limit, 10) : 10
    );


    res.json(results);

  } catch (e) {
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
      name: ValidateProps.layout.name,
      topComponent: ValidateProps.layout.topComponent,
      bottomComponent: ValidateProps.layout.bottomComponent,
      components: ValidateProps.layout.components,
    },
    required: ['name', 'components'],
    additionalProperties: true,
  }),
  async (req, res) => {


    const { name, components, topComponent, bottomComponent } = req.body;

    if (await findLayoutByName(req.db, name)) {
      res
        .status(403)
        .json({ error: { message: 'The Layout has already been used.' } });
      return;
    }


    try {

      const layout = await insertLayout(req.db, {
        name,
        topComponent,
        bottomComponent,
        components,
      });

      return res.json(layout);
    } catch (e) {
      res
        .status(403)
        .json({ error: { message: 'Something went wrong.' } });
      return;
    }

  }
);




export default handler;
