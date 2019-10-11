import { Lambda } from 'aws-sdk'

import { Controller } from '../types'
import { notFoundError } from '../utils/errors'

const lambda = new Lambda({ region: 'us-east-1' })

console.log('keys: ', process.env.AWS_ACCESS_KEY, process.env.AWS_SECRET_ACCESS_KEY)
export const createLatestNews: Controller = async (req, res) => {
  const latestNews = {
    ...req.body,
    // createdBy: req.user.email,
    // updatedBy: req.user.email,
  }
  const lambdaResponse = await lambda
    .invoke({ FunctionName: 'dev-latest-news-write', Payload: JSON.stringify({ body: latestNews }) })
    .promise()
  if (!lambdaResponse.Payload) {
    return res.status(500).send('lambda error')
  }
  const latestNewsResponse = JSON.parse(lambdaResponse.Payload.toString())
  return res.status(201).json(latestNewsResponse)
}

export const getAllLatestNews: Controller = async (_, res) => {
  const lambdaResponse = await lambda
    .invoke({ FunctionName: 'dev-latest-news-read', Payload: JSON.stringify({}) })
    .promise()
  if (!lambdaResponse.Payload) {
    return res.status(500).send('lambda error')
  }
  const allLatestNews = JSON.parse(lambdaResponse.Payload.toString())
  return res.json(allLatestNews)
}

export const getLatestNews: Controller = async (req, res) => {
  const lambdaResponse = await lambda
    .invoke({
      FunctionName: 'dev-latest-news-read',
      Payload: JSON.stringify({ queryParameters: { slug: req.params.slug } }),
    })
    .promise()
  if (!lambdaResponse.Payload) {
    return res.status(500).send('lambda error')
  }
  const latestNews = JSON.parse(lambdaResponse.Payload.toString())
  if (!latestNews.length) {
    throw notFoundError
  }
  return res.json(latestNews[0])
}

export const updateLatestNews: Controller = async (req, res) => {
  const lambdaResponse = await lambda
    .invoke({
      FunctionName: 'dev-latest-news-write',
      Payload: JSON.stringify({ body: { ...req.body, slug: req.params.slug } }),
    })
    .promise()
  if (lambdaResponse.Payload) {
    const latestNews = JSON.parse(lambdaResponse.Payload.toString())
    return res.status(200).json(latestNews)
  }
  return res.status(500).send('lambda error')
}

export const deleteLatestNews: Controller = async (req, res) => {
  const lambdaResponse = await lambda
    .invoke({
      FunctionName: 'dev-latest-news-write',
      Payload: JSON.stringify({ queryParameters: { method: 'DELETE', slug: req.params.slug } }),
    })
    .promise()
  if (lambdaResponse.Payload) {
    return res.status(204).send()
  }
  return res.status(500).send('lambda error')
}
