import jwt from 'express-jwt'

export const getTokenFromHeaders = (req: any) => req.cookies.token || null

const auth = {
  optional: jwt({
    credentialsRequired: false,
    getToken: getTokenFromHeaders,
    secret: process.env.JWT_SECRET || 'secret!',
  }),
  required: jwt({
    getToken: getTokenFromHeaders,
    secret: process.env.JWT_SECRET || 'secret!',
  }),
}

export default auth
