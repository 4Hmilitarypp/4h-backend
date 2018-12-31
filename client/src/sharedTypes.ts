export interface ILiaison {
  _id?: string
  abbreviation?: string | null
  email?: string | null
  image: string
  name?: string | null
  phoneNumber?: string | null
  region: string
}

export interface IPartnerSection {
  title: string
  featuredImages: IImage[]
  partnerSectionId: string
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

export interface IResearch {
  _id?: string
  description?: string
  title: string
  type: 'doc' | 'pdf' | 'link'
  url: string
}

export interface ICurriculumResource {
  _id?: string
  description: string
  featuredImage?: IImage
  title: string
}

export interface ILesson {
  _id?: string
  category?: string
  docUrl?: string
  externalUrl?: string
  pdfUrl?: string
  pptUrl?: string
  title: string
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
