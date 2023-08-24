import { ValidateProps } from '@/api-helper/constants';
import {
  findUserByEmail, 
  insertUser,
} from '@/api-helper/database';
import { database, validateBody} from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
import isEmail from 'validator/lib/isEmail';
import normalizeEmail from 'validator/lib/normalizeEmail';

const handler = nc(ncOpts);
handler.use(database);
handler.options(async (req, res) => {
  return res.status(200).json({});

});


handler.post(
  validateBody({
    type: 'object',
    properties: {
      email: ValidateProps.user.email,
      name: ValidateProps.user.name,
      password: ValidateProps.user.password,
    },
    required: ['name', 'password', 'email'],
    additionalProperties: false,
  }),
  async (req, res) => {
    let { name, email, password } = req.body;
   console.log(req.body)
    email = normalizeEmail(req.body.email);
    if (!isEmail(email)) {
      res
        .status(400)
        .json({ error: { message: 'The email you entered is invalid.' } });
      return;
    }
    if (await findUserByEmail(req.db, email)) {
      res
        .status(403)
        .json({ error: { message: 'The email has already been used.' } });
      return;
    }

   await insertUser(req.db, {
      email,
      originalPassword: password,
      name,
    });


    res.status(201).json({ success: true });
  }
);

export default handler;
