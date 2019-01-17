const mock = {
  emails: undefined,
  liaisons: undefined,
  research: undefined,
  reset: undefined,
  resources: undefined,
  users: undefined,
  webinars: undefined,
}
function reset() {
  Object.assign(mock, {
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
    users: Object.assign(mock.users || {}, {
      login: jest.fn(() => Promise.resolve({})),
      logout: jest.fn(() => Promise.resolve({})),
      me: jest.fn(() => Promise.resolve({})),
      register: jest.fn(() => Promise.resolve({})),
    }),
    webinars: Object.assign(mock.webinars || {}, {
      get: jest.fn(() => Promise.resolve([])),
    }),
  })
}
reset()

export default mock
