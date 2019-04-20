export interface IApiError {
  response: { data: { message: string }; status: number; statusText: string }
}

export interface ICampDate {
  _id?: string
  beginDate: string
  endDate: string
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
  // dates: ICampDate[]
  description: string
  descriptionTitle: string
  featuredImage?: IImage
  state: string
  title: string
}

export interface ILiaison {
  _id?: string
  abbreviation?: string | null
  email?: string | null
  image: string
  name?: string | null
  phoneNumber?: string | null
  region: string
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
  name: string
  confirmPassword: string
}

export interface IUser {
  _id: string
  email: string
  name: string
  permissions: string[]
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
