import apigClientFactory from 'aws-api-gateway-client'

import { Controller } from '../types'
import { notFoundError, forbiddenError } from '../utils/errors'

const apigClient = apigClientFactory.newClient({
  invokeUrl: 'https://rhcg9ezul9.execute-api.us-east-1.amazonaws.com/dev',
  region: 'us-east-1',
  accessKey: process.env.AWS_ACCESS_KEY,
  secretKey: process.env.AWS_SECRET_ACCESS_KEY,
})

export const createLatestNews: Controller = async (req, res) => {
  if (!req.user) throw forbiddenError
  const latestNews = {
    ...req.body,
    createdBy: (req.user as any).email,
    updatedBy: (req.user as any).email,
  }
  const lambdaResponse = await apigClient.invokeApi({}, `/latest-news`, 'post', {}, latestNews)

  if (!lambdaResponse.data) {
    return res.status(500).send('lambda error')
  }
  const latestNewsResponse = lambdaResponse.data
  return res.status(201).json(latestNewsResponse)
}

export const getAllLatestNews: Controller = async (_, res) => {
  const lambdaResponse = await apigClient.invokeApi({}, `/latest-news`, 'get')

  if (!lambdaResponse.data) {
    return res.status(500).send('lambda error')
  }
  const allLatestNews = lambdaResponse.data
  return res.json(allLatestNews)
}

export const getLatestNews: Controller = async (req, res) => {
  const slug = req.params.slug
  const lambdaResponse = await apigClient.invokeApi({}, `/latest-news/slug/${slug}`, 'get')

  if (!lambdaResponse.data) {
    return res.status(500).send('lambda error')
  }
  const latestNews = lambdaResponse.data
  if (!latestNews.length) {
    throw notFoundError
  }
  return res.json(latestNews[0])
}

export const updateLatestNews: Controller = async (req, res) => {
  if (!req.user) throw forbiddenError
  const id = req.params.id
  const latestNews = {
    ...req.body,
    updatedBy: (req.user as any).email,
  }
  const lambdaResponse = await apigClient.invokeApi({}, `/latest-news/${id}`, 'put', {}, latestNews)
  if (lambdaResponse.data) {
    const latestNews = lambdaResponse.data
    return res.status(200).json(latestNews)
  }
  return res.status(500).send('lambda error')
}

export const deleteLatestNews: Controller = async (req, res) => {
  const id = req.params.id
  await apigClient.invokeApi({}, `/latest-news/${id}`, 'delete')

  return res.status(204).send()
}
