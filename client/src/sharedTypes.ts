export interface IApiError {
  response?: { data: { message: string }; status: number; statusText: string }
  error?: string
  message?: string
  statusCode?: number
}

export interface IApplication {
  _id?: string
  dueDate: string
  title: string
  url: string
  userGroups: string[]
}

export interface ICampDate {
  _id?: string
  beginDate: string
  endDate: string
}

export interface ILatestNews {
  title: string // modifiable
  _id: string
  shortDescription: string
  author: string
  createdAt: string
  updatedAt: string
  body: string
  featuredImage: IImage
  resourceUrl?: string
}

export interface ITest {
  title: 'Test '
}

export interface ICampContact {
  email?: string
  name: string
  phoneNumber?: string
  url?: string
  urlText?: string
}

export interface ICamp {
  _id?: string
  ageRange: string
  city: string
  contact: ICampContact
  description: string
  descriptionTitle: string
  featuredImage?: IImage
  flyerUrl?: string
  serviceBranch: 'Air Force' | 'Navy' | 'Army' | 'Guard/Reserve' | 'Guard/Reserve/Retired' | 'All Services'
  state: string
  title: string
  type: 'Residential' | 'Day'
}

export interface ILiaison {
  _id?: string
  abbreviation?: string
  email?: string
  image: string
  name?: string
  phoneNumber?: string
  stateOrRegion: string
  countryCode: string
}

export interface IImage {
  alt?: string
  url: string
}

export interface ILink {
  linkText: string
  title: string
  url: string
}

export interface IReport {
  _id?: string
  image: IImage
  title: string
  url: string
}

export interface IPartnerSection {
  _id?: string
  featuredImage1: IImage
  featuredImage2?: IImage
  shortDescription: string
  slug: string
  title: string
}

export interface IPartner extends IPartnerSection {
  reports: IReport[]
  longDescription: string
}

export interface IWebinar {
  _id?: string
  category: string
  description: string
  title: string
  url: string
}

export type ResearchType = 'doc' | 'pdf' | 'external'

export interface IResearch {
  _id?: string
  description: string
  title: string
  type: ResearchType
  url: string
}

export interface IResource {
  _id?: string
  featuredImage?: IImage
  longDescription: string
  shortDescription: string
  slug: string
  title: string
}

export type LessonLinkType = 'ppt' | 'pdf' | 'doc' | 'external'

export interface ILessonLink {
  url: string
  type: LessonLinkType
}

export interface ILesson {
  _id?: string
  category?: string
  links: ILessonLink[]
  title: string
}

export interface ILoginForm {
  email: string
  password: string
}

export interface IRegisterForm extends ILoginForm {
  affiliation: string
  name: string
  confirmPassword: string
  university: string
}

export interface IUser {
  _id?: string
  affiliation: string
  email: string
  name: string
  permissions: string[]
  university: string
}

export interface IComment {
  _id?: string
  text: string
  userId: string
  userName: string
}
export interface IApiComment {
  _id?: string
  text: string
}

export interface IUserApplication {
  _id?: string
  status: 'Not Submitted' | 'Submitted' | 'Late' | 'Rejected' | 'Approved'
  url: string
}

export interface IFullUserApplication extends IUserApplication {
  baseApplicationUrl: string
  baseId: string
  comments: IComment[]
  dueDate: string
  title: string
  userGroups: string[]
  userId: string
  userName: string
}

export interface IPageInfo {
  page: string
  title: string
  text: string
  featuredImage: IImage
}
