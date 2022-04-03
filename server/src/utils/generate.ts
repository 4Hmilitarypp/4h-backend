import faker from '@faker-js/faker'
import { ObjectId } from 'mongodb'

import {
  IImage,
  ILesson,
  ILiaison,
  ILoginForm,
  IPartner,
  IRegisterForm,
  IResearch,
  IResourceWithLessons,
  IUser,
  IWebinar,
  LessonLinkType,
} from '../sharedTypes'
const generate = {
  dbUser: (overrides?: Partial<IUser>): IUser => ({
    _id: generate.objectId(),
    affiliation: faker.lorem.word(),
    email: faker.internet.email().toLowerCase(),
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    password: faker.internet.password(),
    permissions: [],
    university: faker.lorem.word(),
    ...overrides,
  }),
  image: (overrides?: Partial<IImage>): IImage => ({
    alt: faker.company.catchPhrase(),
    url: faker.internet.url(),
    ...overrides,
  }),
  lesson: (overrides?: Partial<ILesson>): ILesson => ({
    _id: generate.objectId(),
    links: Array.from({ length: faker.random.number({ min: 1, max: 4 }) }, () => ({
      type: ['doc', 'pdf', 'external', 'ppt'][faker.random.number({ min: 0, max: 3 })] as LessonLinkType,
      url: faker.internet.url(),
    })),
    title: faker.company.catchPhrase(),
    ...overrides,
  }),
  lessons: (length: number): ILesson[] => Array.from({ length }, () => generate.lesson()),
  liaison: (overrides?: Partial<ILiaison>): ILiaison => ({
    _id: generate.objectId(),
    email: faker.internet.email(),
    image: faker.random.image(),
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    phoneNumber: `913-206-8228`,
    region: faker.address.state(),
    ...overrides,
  }),
  liaisons: (length: number): ILiaison[] => Array.from({ length }, () => generate.liaison()),

  loginForm: (overrides?: Partial<ILoginForm>): ILoginForm => ({
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...overrides,
  }),
  objectId: () => new ObjectId().toHexString(),
  partner: (overrides?: Partial<IPartner>): IPartner => ({
    _id: generate.objectId(),
    featuredImage1: generate.image(),
    featuredImage2: generate.image(),
    longDescription: faker.lorem.paragraph(),
    reports: [
      { image: generate.image(), title: faker.lorem.words(), url: faker.internet.url(), _id: generate.objectId() },
    ],
    shortDescription: faker.lorem.word(),
    slug: faker.lorem.word(),
    title: faker.lorem.word(),
    ...overrides,
  }),
  partners: (length: number): IPartner[] => Array.from({ length }, () => generate.partner()),
  registerForm: (overrides?: Partial<IRegisterForm>): IRegisterForm => {
    const password = faker.internet.password()
    return {
      confirmPassword: password,
      email: faker.internet.email(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      password,
      ...overrides,
    }
  },
  research: (descriptionLength: number = 100, overrides: {} = {}): IResearch => ({
    _id: generate.objectId(),
    description: faker.lorem.words(descriptionLength),
    title: faker.company.catchPhrase(),
    type: ['doc', 'pdf', 'external'][faker.random.number({ min: 0, max: 2 })] as 'doc' | 'pdf' | 'external',
    url: faker.internet.url(),
    ...overrides,
  }),
  researches: (length: number): IResearch[] => Array.from({ length }, () => generate.research(100)),
  resource: (overrides?: Partial<IResourceWithLessons>): IResourceWithLessons => ({
    _id: generate.objectId(),
    featuredImage: { url: faker.internet.url(), alt: faker.company.catchPhrase() },
    longDescription: faker.lorem.paragraph(),
    shortDescription: faker.lorem.words(20),
    slug: faker.lorem.word(),
    title: faker.company.catchPhrase(),
    ...overrides,
  }),
  resources: (length: number): IResourceWithLessons[] => Array.from({ length }, () => generate.resource()),
  webinar: (descriptionLength: number = 100, overrides: {} = {}): IWebinar => ({
    _id: generate.objectId(),
    category: faker.commerce.productAdjective(),
    description: faker.lorem.words(descriptionLength),
    title: faker.company.catchPhrase(),
    url: faker.internet.url(),
    ...overrides,
  }),
  webinars: (length: number): IWebinar[] => Array.from({ length }, () => generate.webinar(100)),
}

export default generate
