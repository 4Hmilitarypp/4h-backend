const mock = {
  auth: undefined,
  emails: undefined,
  liaisons: undefined,
  research: undefined,
  reset: undefined,
  resources: undefined,
  webinars: undefined,
}
const authResponse = { user: { _id: 1 } }
function reset() {
  Object.assign(mock, {
    auth: Object.assign(mock.auth || {}, {
      login: jest.fn(() => Promise.resolve(authResponse)),
      logout: jest.fn(() => Promise.resolve(authResponse)),
      me: jest.fn(() => Promise.resolve(authResponse)),
      register: jest.fn(() => Promise.resolve(authResponse)),
    }),
    emails: Object.assign(mock.emails || {}, {
      create: jest.fn(() => Promise.resolve({ email: {} })),
    }),
    liaisons: Object.assign(mock.liaisons || {}, {
      get: jest.fn(() => Promise.resolve({ liaisons: {} })),
    }),
    research: Object.assign(mock.research || {}, {
      get: jest.fn(() => Promise.resolve([])),
    }),
    reset,
    resources: Object.assign(mock.resources || {}, {
      get: jest.fn(() => Promise.resolve([])),
      getBySlug: jest.fn((_: string) => Promise.resolve({})),
    }),
    webinars: Object.assign(mock.webinars || {}, {
      get: jest.fn(() => Promise.resolve([])),
    }),
  })
}
reset()

export default mock
