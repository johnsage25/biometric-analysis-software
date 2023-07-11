import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
var bcrypt = require('bcryptjs');
import { LocalStorage } from "node-localstorage";
import { Users } from "../../../database"
var JWT_SALT = process.env.JWT_SALT;

global.localStorage = new LocalStorage('./scratch');

export default NextAuth({


  // Configure one or more authentication providers
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/auth/signin',
    // signOut: '/auth/signout',
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  providers: [
    CredentialsProvider({


      credentials: {
        email: { label: "Email", type: "text", },
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials, req) {

        const { email, password } = credentials

        let userSession = await new Promise((resolve, reject) => {

          Users.findOne({ $or: [{ email: email }, { username: email }] })
            .then((result) => {

              resolve(result)

            }).catch((err) => {

              reject(err)

            });

        })


        let compare = await new Promise((resolve, reject) => {
          bcrypt.compare(
            password,
            userSession.password,
            function (err, result) {
              resolve(result);
            }
          );
        });


        if(compare){
          return userSession
        }


        // Return null if user data could not be retrieved
        return null
      }
    })
    // ...add more providers here
  ],

  Events: {
    async signOut({ session, token }) {

      console.log(session);

    },
  },

  callbacks: {

    async signIn({ user, account, profile, email, credentials }) {
      const isAllowedToSignIn = true


      return true;
    },
    async authorized({ req, token }) {
      if (token) return true // If there is a token, the user is authenticated
    },

    async signOut({ token, session }) {



    },
    async jwt({ token, user, account }) {

      if (user) {
        return {
          ...token,
          ...account,
          ...user,
          accessToken: user.token,
          refreshToken: user.refreshToken,
        };
      }

      return token;
    },

    async session({ session, token }) {

      session.token = token;
      session.user.accessToken = token.accessToken;
      session.appid = process.env.APPLICATION_ID;
      session.serverURL = process.env.SERVER_URL;
      session.serverURL_WSS = process.env.SERVER_URL_WSS;
      session.masterkey = process.env.MASTER_KEY;
      return session;
    },
  },

})
