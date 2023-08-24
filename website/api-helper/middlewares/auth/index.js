import { findUserWithEmailAndPassword } from "../../database/users"
import { getMongoClient } from "../database";
import { getSession } from "next-auth/react";

import config from '../../config.json';

const apiKey = process.env.APIKEY;

export async function authenticate(credentials) {

    const { email, password } = credentials;
    const client = await getMongoClient();
    const db = client.db();
    const user = await findUserWithEmailAndPassword(db, email, password);

    if (user) return {  ...user };
    else
        return null;

}

export default async function authorize(req, res, next) {
    const session = await getSession({ req })

    if (!session || !session?.user)
        return res.status(401).end();

    req.user = session.user;
    return next();
}

export async function authorizeAPI(req, res, next) {
    
   
    const urlToSkipAuthentication = config.URL;

    // Skip authentication if the requested URL matches the URL to skip
    if (urlToSkipAuthentication && req.headers.referer === urlToSkipAuthentication) {
      return next();
    }
    

    const key = req.headers['x-api-key'];

    if('$2a$10$Wwq1ZvXpQHTbIjquig4PPuG53vBOmtGR2JiuqGAG4rLXI7/9WV0Xa' !== key)
    return res.status(401).end();


    return next();
}