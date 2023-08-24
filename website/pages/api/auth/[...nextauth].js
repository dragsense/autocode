import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import { authenticate, getMongoClient } from "@/api-helper/middlewares";
import FacebookProvider from "next-auth/providers/facebook"
import GoogleProvider from "next-auth/providers/google"
import config from '@/api-helper/config.json'

const options = {
  adapter: MongoDBAdapter(getMongoClient()),
  site: process.env.URL,
  cookie: {
    secure: process.env.NODE_ENV && process.env.NODE_ENV === 'production',
  },
  secret: config.AUTH_SECRET,
  session: {
    strategy: "jwt"
  },
  jwt: {
    secret: config.JWT_SECRET,
  },
  providers: [
 
    CredentialsProvider({
      name: "Credentials",
      authorize: authenticate
    }),
    FacebookProvider({
      clientId: config.FACEBOOK_ID,
      clientSecret: config.FACEBOOK_SECRET
    }),
    GoogleProvider({
      clientId: config.GOOGLE_ID,
      clientSecret: config.GOOGLE_SECRET
    })
  ],
  pages: {
    signIn: "/auth/login",
  },
  callback: {
    async jwt(token, user, account, profile, isNewUser) { 

      console.log(token);


      const isUserSignedIn = user ? true : false;
      if(isUserSignedIn) {
        token.id = user._id.toString();
      }
  
      return Promise.resolve(token);
    },
    async session(session, token) { 
      session.id = token.id;
     
      return Promise.resolve(session);
    },
  }
}

export default NextAuth(options)