import faker from 'faker'
import { ILesson, ILessonType, ILiaison, IResearch, IResource, IResourceWithLessons, IWebinar } from '../sharedTypes'
import { IContactUsEmail, ISignInForm } from '../types'

const generate = {
  contactUsEmail: (overrides?: Partial<IContactUsEmail>): IContactUsEmail => ({
    email: faker.internet.email(),
    message: faker.lorem.paragraph(),
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  }),
  lesson: (overrides?: Partial<ILesson>): ILesson => ({
    _id: generate.objectId(),
    links: Array.from({ length: faker.random.number({ min: 1, max: 4 }) }, () => ({
      type: new Array('doc', 'pdf', 'external', 'ppt')[faker.random.number({ min: 0, max: 3 })] as ILessonType,
      url: faker.internet.url(),
    })),
    title: faker.company.catchPhrase(),
    ...overrides,
  }),
  lessons: (length: number): ILesson[] => Array.from({ length }, () => generate.lesson()),
  liaison: (overrides?: Partial<ILiaison>): ILiaison => ({
    email: faker.internet.email(),
    image: faker.random.image(),
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    phoneNumber: `+1-${faker.phone.phoneNumberFormat(0)}`,
    region: faker.address.state(),
    ...overrides,
  }),
  liaisons: (length: number): ILiaison[] => Array.from({ length }, () => generate.liaison()),
  objectId: () => faker.random.alphaNumeric(24),
  research: (descriptionLength: number = 100, overrides: {} = {}): IResearch => ({
    _id: generate.objectId(),
    description: faker.lorem.words(descriptionLength),
    title: faker.company.catchPhrase(),
    type: new Array('doc', 'pdf', 'external')[faker.random.number({ min: 0, max: 2 })] as 'doc' | 'pdf' | 'external',
    url: faker.internet.url(),
    ...overrides,
  }),
  researches: (length: number): IResearch[] => Array.from({ length }, () => generate.research(100)),
  resource: (overrides?: Partial<IResource>, lessons?: ILesson[]): IResourceWithLessons => ({
    _id: generate.objectId(),
    featuredImage: { url: faker.internet.url(), alt: faker.company.catchPhrase() },
    lessons: lessons ? [...lessons] : undefined,
    longDescription: faker.lorem.paragraph(),
    shortDescription: faker.lorem.words(20),
    slug: faker.lorem.word(),
    title: faker.company.catchPhrase(),
    ...overrides,
  }),
  resources: (length: number): IResourceWithLessons[] => Array.from({ length }, () => generate.resource()),
  signInForm: (): ISignInForm => ({ email: faker.internet.email(), password: faker.internet.password() }),
  webinar: (descriptionLength: number): IWebinar => ({
    category: faker.commerce.productAdjective(),
    description: faker.lorem.words(descriptionLength),
    title: faker.company.catchPhrase(),
    url: faker.internet.url(),
  }),
  webinars: (length: number): IWebinar[] => Array.from({ length }, () => generate.webinar(100)),
}

export default generate
