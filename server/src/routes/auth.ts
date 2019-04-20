import jwt from 'express-jwt'

export const getTokenFromHeaders = (req: any) => req.cookies.token || null
if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET not set')
const auth = {
  optional: jwt({
    credentialsRequired: false,
    getToken: getTokenFromHeaders,
    secret: process.env.JWT_SECRET,
  }),
  required: jwt({
    getToken: getTokenFromHeaders,
    secret: process.env.JWT_SECRET,
  }),
}

export default auth
