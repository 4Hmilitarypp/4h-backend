export interface ILiaison {
  abbreviation?: string | null
  email?: string | null
  image: string
  _id?: string
  name?: string | null
  phoneNumber?: string | null
  region: string
}

export interface IPartnerSection {
  _id?: string
  title: string
  featuredImages: IImage[]
  shortDescription: string
  slug: string
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
  title: string
  url: string
}

export interface IPartner extends IPartnerSection {
  annualReports?: IReport[]
  images?: IImage[]
  longDescription: string
  videoReports?: IReport[]
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

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
