import faker from 'faker'
import {
  IImage,
  ILesson,
  ILiaison,
  ILoginForm,
  IPartner,
  IResearch,
  IResource,
  IResourceWithLessons,
  IWebinar,
  LessonLinkType,
} from '../sharedTypes'

const generate = {
  image: (overrides?: Partial<IImage>): IImage => ({
    alt: faker.company.catchPhrase(),
    url: faker.internet.url(),
    ...overrides,
  }),
  lesson: (overrides?: Partial<ILesson>): ILesson => ({
    _id: generate.objectId(),
    links: Array.from({ length: faker.random.number({ min: 1, max: 4 }) }, () => ({
      type: new Array('doc', 'pdf', 'external', 'ppt')[faker.random.number({ min: 0, max: 3 })] as LessonLinkType,
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
  partner: (overrides?: Partial<IPartner>): IPartner => ({
    _id: generate.objectId(),
    featuredImage1: generate.image(),
    featuredImage2: generate.image(),
    longDescription: faker.lorem.paragraph(),
    reports: [{ image: generate.image(), title: faker.lorem.words(), url: faker.internet.url() }],
    shortDescription: faker.lorem.word(),
    slug: faker.lorem.word(),
    title: faker.lorem.word(),
    ...overrides,
  }),
  partners: (length: number): IPartner[] => Array.from({ length }, () => generate.partner()),
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
  signInForm: (): ILoginForm => ({ email: faker.internet.email(), password: faker.internet.password() }),
  webinar: (descriptionLength: number): IWebinar => ({
    category: faker.commerce.productAdjective(),
    description: faker.lorem.words(descriptionLength),
    title: faker.company.catchPhrase(),
    url: faker.internet.url(),
  }),
  webinars: (length: number): IWebinar[] => Array.from({ length }, () => generate.webinar(100)),
}

export default generate
