import * as axios from 'axios'
import { ICurriculumResource, ILesson, ILiaison, IResearch, IWebinar, Omit } from '../sharedTypes'

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
const curriculumResources = {
  create: (data: Omit<ICurriculumResource, 'slug'>): Promise<ICurriculumResource> => requests.post('/curriculumResources', data),
  delete: (id: string): Promise<string> => requests.delete(`/curriculumResources/${id}`),
  get: (): Promise<ICurriculumResource[]> => requests.get('/curriculumResources'),
  getById: (id: string): Promise<ICurriculumResource> => requests.get(`/curriculumResources/${id}`),
  update: (updates: Omit<ICurriculumResource, 'slug'>): Promise<ICurriculumResource> => requests.put('/curriculumResources', updates),
}

const lessons = {
  create: (resourceId: string, data: ILesson): Promise<ILesson> =>
    requests.post(`/curriculumResources/${resourceId}/lessons/`, data),
  delete: (resourceId: string, id: string): Promise<string> =>
    requests.delete(`/curriculumResources/${resourceId}/lessons/${id}`),
  get: (resourceId: string): Promise<ILesson[]> => requests.get(`/curriculumResources/${resourceId}/lessons/`),
  update: (resourceId: string, updates: ILesson): Promise<ILesson> =>
    requests.put(`/curriculumResources/${resourceId}/lessons/`, updates),
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
  curriculumResources,
  init,
  lessons,
  liaisons,
  research,
  webinars,
}

export default restApi
