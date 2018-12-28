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

export interface IDisplayCurriculumResource {
  _id?: string
  description: string
  featuredImage?: IImage
  title: string
}

export interface ICurriculumResource extends IDisplayCurriculumResource {
  lessons: ILesson[]
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
