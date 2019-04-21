import axios from 'axios'
import csv from 'csvtojson/v2'
import { Controller } from '../types'

export const getReport: Controller = async (req, res) => {
  const response = await axios.get(
    `https://cloudinary.com/console/lui/reports.csv?report_date=${req.params.beginDate}%2C${
      req.params.endDate
    }&utf8=%E2%9C%93`,
    {
      headers: {
        Cookie:
          '_cld_session_key=3483feded9b1cb6d7b7a609cebbf5b48; path=/; domain=.cloudinary.com; Expires=Tue, 19 Jan 2038 03:14:07 GMT;',
      },
    }
  )

  const json = await csv().fromString(response.data)
  return res.send(json)
}

export const getUsage: Controller = async (_, res) => {
  const response = await axios.get(
    `https://559898188584278:${process.env.CLOUDINARY_SECRET}@api.cloudinary.com/v1_1/four-hmpp/usage`
  )

  return res.send(response.data)
}
