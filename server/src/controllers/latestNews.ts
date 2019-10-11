import apigClientFactory from 'aws-api-gateway-client'

import { Controller } from '../types'
import { forbiddenError } from '../utils/errors'

const apigClient = apigClientFactory.newClient({
  invokeUrl: 'https://rhcg9ezul9.execute-api.us-east-1.amazonaws.com/dev',
  region: 'us-east-1',
  accessKey: process.env.AWS_ACCESS_KEY,
  secretKey: process.env.AWS_SECRET_ACCESS_KEY,
})

console.log('keys: ', process.env.AWS_ACCESS_KEY, process.env.AWS_SECRET_ACCESS_KEY)
export const createLatestNews: Controller = async (req, res) => {
  if (!req.user) throw forbiddenError
  try {
    const latestNews = {
      ...req.body,
      createdBy: (req.user as any).email,
      updatedBy: (req.user as any).email,
    }
    const lambdaResponse = await apigClient.invokeApi({}, `/latest-news`, 'post', {}, latestNews)

    const latestNewsResponse = lambdaResponse.data
    return res.status(201).json(latestNewsResponse)
  } catch (error) {
    const { data, status } = error.response
    return res.status(status).send(data.Message)
  }
}

export const getAllLatestNews: Controller = async (_, res) => {
  try {
    const lambdaResponse = await apigClient.invokeApi({}, `/latest-news`, 'get')
    const allLatestNews = lambdaResponse.data
    return res.json(allLatestNews)
  } catch (error) {
    const { data, status } = error.response
    return res.status(status).send(data.Message)
  }
}

export const getLatestNews: Controller = async (req, res) => {
  const slug = req.params.slug
  try {
    const lambdaResponse = await apigClient.invokeApi({}, `/latest-news/slug/${slug}`, 'get')
    const result = lambdaResponse.data
    return res.json(result[0])
  } catch (error) {
    const { data, status } = error.response
    return res.status(status).send(data.Message)
  }
}

export const updateLatestNews: Controller = async (req, res) => {
  if (!req.user) throw forbiddenError
  const id = req.params.id
  const latestNews = {
    ...req.body,
    updatedBy: (req.user as any).email,
  }
  try {
    const lambdaResponse = await apigClient.invokeApi({}, `/latest-news/${id}`, 'put', {}, latestNews)
    const result = lambdaResponse.data
    return res.status(200).json(result)
  } catch (error) {
    const { data, status } = error.response
    return res.status(status).send(data.Message)
  }
}

export const deleteLatestNews: Controller = async (req, res) => {
  try {
    const id = req.params.id
    await apigClient.invokeApi({}, `/latest-news/${id}`, 'delete')

    return res.status(204).send()
  } catch (error) {
    const { data, status } = error.response
    return res.status(status).send(data.Message)
  }
}
