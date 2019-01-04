import faker from 'faker'
import { ILiaison, IResearch, IWebinar } from '../sharedTypes'

const generate = {
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
