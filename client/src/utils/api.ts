import * as axios from 'axios'
import { ILesson, ILiaison, IResearch, IResource, IWebinar, Omit } from '../sharedTypes'

let api: axios.AxiosInstance
const envBaseURL = process.env.REACT_APP_API_URL

const getData = (res: { data: object }) => res.data

const requests = {
  delete: (url: string): Promise<any> => api.delete(url).then(getData),
  get: (url: string): Promise<any> => api.get(url).then(getData),
  post: (url: string, body: object): Promise<any> => api.post(url, body).then(getData),
  put: (url: string, body: object): Promise<any> => api.put(url, body).then(getData),
}

const liaisons = {
  create: (data: ILiaison): Promise<ILiaison> => requests.post('/liaisons', data),
  delete: (id: string): Promise<string> => requests.delete(`/liaisons/${id}`),
  get: (): Promise<ILiaison[]> => requests.get('/liaisons'),
  update: (updates: ILiaison): Promise<ILiaison> => requests.put('/liaisons', updates),
}
const research = {
  create: (data: IResearch): Promise<IResearch> => requests.post('/research', data),
  delete: (id: string): Promise<string> => requests.delete(`/research/${id}`),
  get: (): Promise<IResearch[]> => requests.get('/research'),
  update: (updates: IResearch): Promise<IResearch> => requests.put('/research', updates),
}
const resources = {
  create: (data: Omit<IResource, 'slug'>): Promise<IResource> => requests.post('/resources', data),
  delete: (id: string): Promise<string> => requests.delete(`/resources/${id}`),
  get: (): Promise<IResource[]> => requests.get('/resources'),
  getById: (id: string): Promise<IResource> => requests.get(`/resources/${id}`),
  update: (updates: Omit<IResource, 'slug'>): Promise<IResource> => requests.put('/resources', updates),
}

const lessons = {
  create: (resourceId: string, data: ILesson): Promise<ILesson> =>
    requests.post(`/resources/${resourceId}/lessons/`, data),
  delete: (resourceId: string, id: string): Promise<string> =>
    requests.delete(`/resources/${resourceId}/lessons/${id}`),
  get: (resourceId: string): Promise<ILesson[]> => requests.get(`/resources/${resourceId}/lessons/`),
  update: (resourceId: string, updates: ILesson): Promise<ILesson> =>
    requests.put(`/resources/${resourceId}/lessons/`, updates),
}
const webinars = {
  create: (data: IWebinar): Promise<IWebinar> => requests.post('/webinars', data),
  delete: (id: string): Promise<string> => requests.delete(`/webinars/${id}`),
  get: (): Promise<IWebinar[]> => requests.get('/webinars'),
  update: (updates: IWebinar): Promise<IWebinar> => requests.put('/webinars', updates),
}

function init({
  token = window.localStorage.getItem('token'),
  baseURL = (api && api.defaults.baseURL) || envBaseURL,
  axiosOptions = { headers: {} },
} = {}) {
  api = (axios as any).create({
    baseURL,
    ...axiosOptions,
    headers: {
      authorization: token ? `Bearer ${token}` : undefined,
      ...axiosOptions.headers,
    },
  })
}

const restApi = {
  init,
  lessons,
  liaisons,
  research,
  resources,
  webinars,
}

export default restApi
