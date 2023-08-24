import { findLayoutByName, findLayoutById, updateLayoutById, deleteLayouById } from '@/api-helper/database';
import { ValidateProps } from '@/api-helper/constants';
import { authorizeAPI, database, validateBody, cors } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.use(cors, authorizeAPI, database);
handler.options(async (req, res) => {
  return res.status(200).json({});

});

handler.get(async (req, res) => {



  const layout = await findLayoutById(req.db, req.query.layoutId);

  if (!layout)
    return res.status(403).status(403)
      .json({ error: { message: 'Layout Not Found.' } });



  res.json(layout);
});

handler.delete(async (req, res) => {

  const layout = await deleteLayouById(req.db, req.query.layoutId);

  if (!layout.value)
    return res.status(403).status(403)
      .json({ error: { message: 'Layout Not Found.' } });

  res.json({ status: true });
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

    const layoutId = req.query.layoutId;

    const layout = await findLayoutById(req.db, layoutId);


    if (!layout)
      return res.status(403).status(403)
        .json({ error: { message: 'Layout Not Found.' } });

    const _layout = await findLayoutByName(req.db, name);
    if (_layout && layoutId !== _layout._id?.toString()) {
      res
        .status(403)
        .json({ error: { message: 'The Layout has already been used.' } });
      return;
    }

    try {
      const updated = await updateLayoutById(req.db, layout._id, {
        name,
        topComponent, bottomComponent,
        components,
      });

      return res.json({ layout: updated.value });
    } catch (e) {
      res
        .status(403)
        .json({ error: { message: 'Something went wrong.' } });
      return;
    }
  }
);

export default handler;