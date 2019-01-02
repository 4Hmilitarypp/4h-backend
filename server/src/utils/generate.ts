import faker from 'faker'
import { ObjectId } from 'mongodb'
import {
  ICurriculumResource,
  ICurriculumResourceWithLessons,
  ILesson,
  ILiaison,
  IResearch,
  IWebinar,
} from '../sharedTypes'

const generate = {
  curriculumResource: (overrides?: Partial<ICurriculumResource>, lesson?: ILesson): ICurriculumResourceWithLessons => ({
    _id: generate.objectId(),
    description: faker.lorem.paragraph(),
    featuredImage: { url: faker.internet.url(), alt: faker.company.catchPhrase() },
    lessons: lesson ? [lesson] : undefined,
    slug: faker.lorem.word(),
    title: faker.company.catchPhrase(),
    ...overrides,
  }),
  curriculumResources: (length: number): ICurriculumResourceWithLessons[] =>
    Array.from({ length }, () => generate.curriculumResource()),
  lesson: (overrides?: Partial<ILesson>): ILesson => ({
    _id: generate.objectId(),
    pdfUrl: faker.internet.url(),
    pptUrl: faker.internet.url(),
    title: faker.company.catchPhrase(),
    ...overrides,
  }),
  lessons: (length: number): ILesson[] => Array.from({ length }, () => generate.lesson()),
  liaison: (overrides?: Partial<ILiaison>): ILiaison => ({
    _id: generate.objectId(),
    email: faker.internet.email(),
    image: faker.random.image(),
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    phoneNumber: `${faker.phone.phoneNumberFormat(0)}`,
    region: faker.address.state(),
    ...overrides,
  }),
  liaisons: (length: number): ILiaison[] => Array.from({ length }, () => generate.liaison()),
  objectId: () => new ObjectId().toHexString(),
  research: (descriptionLength: number = 100, overrides: {} = {}): IResearch => ({
    _id: generate.objectId(),
    description: faker.lorem.words(descriptionLength),
    title: faker.company.catchPhrase(),
    type: new Array('doc', 'pdf', 'link')[faker.random.number({ min: 0, max: 2 })] as 'doc' | 'pdf' | 'link',
    url: faker.internet.domainName(),
    ...overrides,
  }),
  researches: (length: number): IResearch[] => Array.from({ length }, () => generate.research(100)),
  webinar: (descriptionLength: number = 100, overrides: {} = {}): IWebinar => ({
    _id: generate.objectId(),
    category: faker.commerce.productAdjective(),
    description: faker.lorem.words(descriptionLength),
    title: faker.company.catchPhrase(),
    url: faker.internet.domainName(),
    ...overrides,
  }),
  webinars: (length: number): IWebinar[] => Array.from({ length }, () => generate.webinar(100)),
}

export default generate
