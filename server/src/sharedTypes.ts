import { Document } from 'mongoose'

export interface I4HDocument extends Document {
  archivedBy: string
  createdBy: string
  updatedBy: string
  createdAt: number
  updatedAt: number
}

export interface IApplication {
  _id: string
  dueDate: string
  title: string
  url: string
  userGroups: string[]
}

export interface ICampDate {
  _id?: string
  beginDate: Date
  endDate: Date
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
  serviceBranch: 'Air Force' | 'Navy' | 'Army'
  state: string
  title: string
  type: 'Residential' | 'Day'
}

export interface ICampWithDates extends ICamp {
  dates: ICampDate[]
}

export interface ILiaison {
  abbreviation?: string | null
  email?: string | null
  image: string
  _id?: string
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

interface IReport {
  _id: string
  image: IImage
  title: string
  url: string
}

export interface IPartnerSection {
  _id?: string
  title: string
  featuredImage1: IImage
  featuredImage2?: IImage
  shortDescription: string
  slug: string
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

export interface IResourceWithLessons extends IResource {
  lessons?: ILesson[]
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
  affiliation: string
  email: string
  name: string
  password: string
  permissions: string[]
  university: string
}

export interface IComment {
  _id: string
  text: string
  userId: string
}

export interface IUserApplication {
  _id: string
  baseId: string
  comments: IComment[]
  createdBy: string
  dueDate: string
  title: string
  status: 'Not Submitted' | 'Submitted' | 'Late' | 'Rejected' | 'Approved'
  updatedBy: string
  url: string
  userGroups: string[]
  userId: string
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
