import axios, { AxiosInstance } from 'axios'

import {
  IApiComment,
  IApplication,
  ICamp,
  ICampDate,
  IComment,
  IFullUserApplication,
  ILesson,
  ILiaison,
  // ILoginForm,
  IPartner,
  IPartnerSection,
  IRegisterForm,
  ILatestNews,
  IReport,
  IResearch,
  IResource,
  IUser,
  IUserApplication,
  IWebinar,
  IPageInfo,
} from '../sharedTypes'

let restApi: AxiosInstance

const envBaseURL = process.env.REACT_APP_API_URL
const cognitoBaseUrl = process.env.REACT_APP_AWS_COGNITO_BASEURL
const cognitoClientId = process.env.REACT_APP_AWS_COGNITO_CLIENT_ID
const cognitoRedirectUri = process.env.REACT_APP_COGNITO_REDIRECT_URI

if (!cognitoBaseUrl || !cognitoClientId || !cognitoRedirectUri) {
  throw new Error(
    'missing required environment variables: one of: [REACT_APP_AWS_COGNITO_BASEURL, REACT_APP_AWS_COGNITO_CLIENT_ID, REACT_APP_COGNITO_REDIRECT_URI]'
  )
}

const getData = (res: { data: object }) => res.data as any

export const getAccessTokenCookie = () => {
  const keys = document.cookie.split(';')
  const accessTokenKey = keys.find(key => key.includes('token='))
  if (!accessTokenKey) return ''
  const accessToken = accessTokenKey.replace('token=', '').trim()
  return accessToken
}

const requests = {
  delete: (url: string): Promise<any> => {
    return restApi.delete(url, { headers: { Authorization: `Bearer ${getAccessTokenCookie()}` } }).then(getData)
  },
  get: (url: string): Promise<any> => {
    return restApi.get(url, { headers: { Authorization: `Bearer ${getAccessTokenCookie()}` } }).then(getData)
  },
  post: (url: string, body: object): Promise<any> => {
    return restApi.post(url, body, { headers: { Authorization: `Bearer ${getAccessTokenCookie()}` } }).then(getData)
  },
  put: (url: string, body: object): Promise<any> => {
    return restApi.put(url, body, { headers: { Authorization: `Bearer ${getAccessTokenCookie()}` } }).then(getData)
  },
  login: (url: string, accessToken: string): Promise<any> => {
    return restApi
      .post(url, null, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(getData)
  },
}

const admin = {
  cloudinaryReports: ({ beginDate, endDate }: { beginDate: string; endDate: string }): Promise<any[]> =>
    requests.get(`/admin/cloudinary-reports/${beginDate}/${endDate}`),
  cloudinaryUsage: (): Promise<any> => requests.get(`/admin/cloudinary-reports/usage`),
}

const applications = {
  create: (data: Omit<IApplication, '_id'>): Promise<IApplication> => requests.post('/applications', data),
  delete: (id: string): Promise<string> => requests.delete(`/applications/${id}`),
  get: (): Promise<IApplication[]> => requests.get('/applications'),
  getIds: (): Promise<string[]> => requests.get('/applications/ids'),
  update: (id: string, updates: IApplication): Promise<IApplication> => requests.put(`/applications/${id}`, updates),
}

const camps = {
  create: (data: ICamp): Promise<ICamp> => requests.post('/camps', data),
  delete: (id: string): Promise<string> => requests.delete(`/camps/${id}`),
  get: (): Promise<ICamp[]> => requests.get('/camps'),
  update: (id: string, updates: ICamp): Promise<ICamp> => requests.put(`/camps/${id}`, updates),
}

const campDates = {
  create: (campId: string, data: ICampDate): Promise<ICampDate> => requests.post(`/camps/${campId}/dates/`, data),
  delete: (campId: string, id: string): Promise<string> => requests.delete(`/camps/${campId}/dates/${id}`),
  get: (campId: string): Promise<ICampDate[]> => requests.get(`/camps/${campId}/dates/`),
  update: (campId: string, id: string, updates: ICampDate): Promise<ICampDate> =>
    requests.put(`/camps/${campId}/dates/${id}`, updates),
}

const comments = {
  create: (userApplicationId: string, data: Pick<IApiComment, 'text'>): Promise<IComment> =>
    requests.post(`/user-applications/${userApplicationId}/comments/`, data),
  delete: (userApplicationId: string, id: string): Promise<string> =>
    requests.delete(`/user-applications/${userApplicationId}/comments/${id}`),
  get: (userApplicationId: string): Promise<IComment[]> =>
    requests.get(`/user-applications/${userApplicationId}/comments/`),
  getById: (userApplicationId: string, id: string): Promise<IComment[]> =>
    requests.get(`/user-applications/${userApplicationId}/comments/${id}`),
  update: (userApplicationId: string, id: string, updates: Pick<IApiComment, 'text'>): Promise<IComment> =>
    requests.put(`/user-applications/${userApplicationId}/comments/${id}`, updates),
}

const lessons = {
  create: (resourceId: string, data: ILesson): Promise<ILesson> =>
    requests.post(`/resources/${resourceId}/lessons/`, data),
  delete: (resourceId: string, id: string): Promise<string> =>
    requests.delete(`/resources/${resourceId}/lessons/${id}`),
  get: (resourceId: string): Promise<ILesson[]> => requests.get(`/resources/${resourceId}/lessons/`),
  update: (resourceId: string, id: string, updates: ILesson): Promise<ILesson> =>
    requests.put(`/resources/${resourceId}/lessons/${id}`, updates),
}

// const liaisons = {
//   create: (data: ILiaison): Promise<ILiaison> => requests.post('/liaisons', data),
//   delete: (id: string): Promise<string> => requests.delete(`/liaisons/${id}`),
//   get: (): Promise<ILiaison[]> => requests.get('/liaisons'),
//   update: (id: string, updates: ILiaison): Promise<ILiaison> => requests.put(`/liaisons/${id}`, updates),
// }

const liaisons = {
  create: (data: ILiaison): Promise<ILiaison> => requests.post('/liaisons', data),
  delete: (id: string): Promise<string> => requests.delete(`/liaisons/${id}`),
  get: (): Promise<ILiaison[]> => requests.get('/liaisons'),
  update: (id: string, updates: ILiaison): Promise<ILiaison> => requests.put(`/liaisons/${id}`, updates),
}

const pageInfo = {
  create: (data: IPageInfo): Promise<IPageInfo> => requests.post('/page-info', data),
  get: (page: string): Promise<IPageInfo> => requests.get(`/page-info/${page}`),
  update: (page: string, updates: IPageInfo): Promise<IPageInfo> => requests.put(`/page-info/${page}`, updates),
}

const latestNews = {
  create: (data: ILatestNews): Promise<ILatestNews> => requests.post('/latest-news', data),
  update: (id: string, update: ILatestNews): Promise<ILatestNews> => requests.put(`/latest-news/${id}`, update),
  delete: (id: string): Promise<string> => requests.delete(`/latest-news/${id}`),
  get: (): Promise<ILatestNews[]> => requests.get('/latest-news'),
  getBySlug: (slug: string): Promise<ILatestNews> => requests.get(`/latest-news/${slug}`),
}

const partners = {
  create: (data: Omit<IPartner, 'slug'>): Promise<IPartner> => requests.post('/partners', data),
  delete: (id: string): Promise<string> => requests.delete(`/partners/${id}`),
  get: (): Promise<IPartnerSection[]> => requests.get('/partners'),
  getById: (id: string): Promise<IPartner> => requests.get(`/partners/${id}`),
  update: (id: string, updates: Omit<IPartner, 'slug'>): Promise<IPartner> => requests.put(`/partners/${id}`, updates),
}

const reports = {
  create: (partnerId: string, data: IReport): Promise<IReport> =>
    requests.post(`/partners/${partnerId}/reports/`, data),
  delete: (partnerId: string, id: string): Promise<string> => requests.delete(`/partners/${partnerId}/reports/${id}`),
  get: (partnerId: string): Promise<IReport[]> => requests.get(`/partners/${partnerId}/reports/`),
  update: (partnerId: string, id: string, updates: IReport): Promise<IReport> =>
    requests.put(`/partners/${partnerId}/reports/${id}`, updates),
}

const research = {
  create: (data: IResearch): Promise<IResearch> => requests.post('/research', data),
  delete: (id: string): Promise<string> => requests.delete(`/research/${id}`),
  get: (): Promise<IResearch[]> => requests.get('/research'),
  update: (id: string, updates: IResearch): Promise<IResearch> => requests.put(`/research/${id}`, updates),
}

const resources = {
  create: (data: Omit<IResource, 'slug'>): Promise<IResource> => requests.post('/resources', data),
  delete: (id: string): Promise<string> => requests.delete(`/resources/${id}`),
  get: (): Promise<IResource[]> => requests.get('/resources'),
  getById: (id: string): Promise<IResource> => requests.get(`/resources/${id}`),
  getByParent: (parent: string): Promise<IResource[]> => requests.get(`/resources/nested/${parent}`),
  update: (id: string, updates: Omit<IResource, 'slug'>): Promise<IResource> =>
    requests.put(`/resources/${id}`, updates),
}

const userApplications = {
  create: (data: IUserApplication): Promise<IFullUserApplication> => requests.post('/user-applications', data),
  delete: (id: string): Promise<string> => requests.delete(`/user-applications/${id}`),
  get: (): Promise<IFullUserApplication[]> => requests.get('/user-applications'),
  getByBaseId: (baseId: string): Promise<IFullUserApplication[]> => requests.get(`/user-applications/base/${baseId}`),
  getById: (id: string): Promise<IFullUserApplication> => requests.get(`/user-applications/${id}`),
  getByUserId: (userId: string): Promise<IFullUserApplication[]> => requests.get(`/user-applications/user/${userId}`),
  update: (id: string, updates: IUserApplication): Promise<IFullUserApplication> =>
    requests.put(`/user-applications/${id}`, updates),
}

const users = {
  checkIfSpam: (token: string): Promise<boolean> => requests.post('/users/checkIfSpam', { token }),
  create: (form: IRegisterForm): Promise<IUser> => requests.post('/users', form),
  delete: (id: string): Promise<string> => requests.delete(`/users/${id}`),
  get: (): Promise<IUser[]> => requests.get('/users'),
  getApplicationUserIds: (): Promise<string[]> => requests.get('/users/application-users'),
  login: (accessToken: string): Promise<IUser> => requests.login('/users/login', accessToken),
  // logout: (): Promise<string> => requests.post('/users/logout', {}),
  // logout: (accessToken: string): Promise<string> => requests.logout(accessToken),
  me: (): Promise<IUser> => requests.get('/users/me'),
  register: (form: IRegisterForm): Promise<IUser> => requests.post('/users/register', form),
  update: (id: string, updates: IUser): Promise<IUser> => requests.put(`/users/${id}`, updates),
}

const webinars = {
  create: (data: IWebinar): Promise<IWebinar> => requests.post('/webinars', data),
  delete: (id: string): Promise<string> => requests.delete(`/webinars/${id}`),
  get: (): Promise<IWebinar[]> => requests.get('/webinars'),
  update: (id: string, updates: IWebinar): Promise<IWebinar> => requests.put(`/webinars/${id}`, updates),
}

const cognito = {
  getTokenFromAuthCode: (
    authCode: string
  ): Promise<{
    access_token: string
    expires_in: number
    id_token: string
    refresh_token: string
    token_type: string
  }> => {
    return axios
      .post(
        `${cognitoBaseUrl}/oauth2/token`,
        new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: cognitoClientId,
          code: authCode,
          redirect_uri: cognitoRedirectUri,
        }),
        { headers: { 'content-type': 'application/x-www-form-urlencoded' } }
      )
      .then(getData)
  },
  getTokenFromRefreshToken: (refreshToken: string): Promise<any> => {
    return axios
      .post(
        `${cognitoBaseUrl}/oauth2/token`,
        new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: cognitoClientId,
          refresh_token: refreshToken,
          redirect_uri: cognitoRedirectUri,
        }),
        { headers: { 'content-type': 'application/x-www-form-urlencoded' } }
      )
      .then(getData)
  },
}

function init({
  baseURL = (restApi && restApi.defaults.baseURL) || envBaseURL || '/api',
  axiosOptions = { headers: {} },
} = {}) {
  restApi = (axios as any).create({
    baseURL,
    ...axiosOptions,
    headers: {
      ...axiosOptions.headers,
    },
  })
}

const api = {
  admin,
  applications,
  campDates,
  camps,
  comments,
  init,
  lessons,
  liaisons,
  pageInfo,
  partners,
  latestNews,
  reports,
  research,
  resources,
  userApplications,
  users,
  webinars,
  cognito,
}

export default api
