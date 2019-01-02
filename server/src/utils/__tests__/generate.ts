import generate from '../generate'

describe('generate.curriculumResource', () => {
  it('should return a correct curriculumResource', () => {
    const res = generate.curriculumResource()
    expect(res).toEqual({
      _id: expect.any(String),
      description: expect.any(String),
      featuredImage: { url: expect.any(String), alt: expect.any(String) },
      slug: expect.any(String),
      title: expect.any(String),
    })
  })
})

describe('generate.curriculumResources', () => {
  it('should return multiple curriculumResources', () => {
    const res = generate.curriculumResources(2)
    expect(res.length).toBe(2)
    expect(res).toEqual(
      expect.arrayContaining([
        {
          _id: expect.any(String),
          description: expect.any(String),
          featuredImage: { url: expect.any(String), alt: expect.any(String) },
          slug: expect.any(String),
          title: expect.any(String),
        },
        {
          _id: expect.any(String),
          description: expect.any(String),
          featuredImage: { url: expect.any(String), alt: expect.any(String) },
          slug: expect.any(String),
          title: expect.any(String),
        },
      ])
    )
  })
})

describe('generate.lesson', () => {
  it('should return a correct lesson', () => {
    const res = generate.lesson()
    expect(res).toEqual({
      _id: expect.any(String),
      pdfUrl: expect.any(String),
      pptUrl: expect.any(String),
      title: expect.any(String),
    })
  })
})

describe('generate.lessons', () => {
  it('should return multiple lessons', () => {
    const res = generate.lessons(2)
    expect(res.length).toBe(2)
    expect(res).toEqual(
      expect.arrayContaining([
        {
          _id: expect.any(String),
          pdfUrl: expect.any(String),
          pptUrl: expect.any(String),
          title: expect.any(String),
        },
        {
          _id: expect.any(String),
          pdfUrl: expect.any(String),
          pptUrl: expect.any(String),
          title: expect.any(String),
        },
      ])
    )
  })
})

describe('generate.liaison', () => {
  it('should return a full liaison', () => {
    const res = generate.liaison()
    expect(res).toEqual({
      _id: expect.any(String),
      email: expect.any(String),
      image: expect.any(String),
      name: expect.any(String),
      phoneNumber: expect.any(String),
      region: expect.any(String),
    })
  })
  it('should return a liaison with the given region', () => {
    const testRegion = 'Kansas'
    const res = generate.liaison({ region: testRegion })
    expect(res).toEqual({
      _id: expect.any(String),
      email: expect.any(String),
      image: expect.any(String),
      name: expect.any(String),
      phoneNumber: expect.any(String),
      region: testRegion,
    })
  })
})

describe('generate.liaisons', () => {
  it('should return multiple liaisons', () => {
    const res = generate.liaisons(2)
    expect(res.length).toBe(2)
    expect(res).toEqual(
      expect.arrayContaining([
        {
          _id: expect.any(String),
          email: expect.any(String),
          image: expect.any(String),
          name: expect.any(String),
          phoneNumber: expect.any(String),
          region: expect.any(String),
        },
        {
          _id: expect.any(String),
          email: expect.any(String),
          image: expect.any(String),
          name: expect.any(String),
          phoneNumber: expect.any(String),
          region: expect.any(String),
        },
      ])
    )
  })
})

describe('generate.webinar', () => {
  it('should return a correct webinar', () => {
    const res = generate.webinar(100)
    expect(res).toEqual({
      _id: expect.any(String),
      category: expect.any(String),
      description: expect.any(String),
      title: expect.any(String),
      url: expect.any(String),
    })
    expect(res.description.split(' ').length).toBe(100)
  })
})

describe('generate.webinars', () => {
  it('should return multiple webinars', () => {
    const res = generate.webinars(2)
    expect(res.length).toBe(2)
    expect(res).toEqual(
      expect.arrayContaining([
        {
          _id: expect.any(String),
          category: expect.any(String),
          description: expect.any(String),
          title: expect.any(String),
          url: expect.any(String),
        },
        {
          _id: expect.any(String),
          category: expect.any(String),
          description: expect.any(String),
          title: expect.any(String),
          url: expect.any(String),
        },
      ])
    )
  })
})
describe('generate.research', () => {
  it('should return a correct research', () => {
    const res = generate.research(100)
    expect(res).toEqual({
      _id: expect.any(String),
      description: expect.any(String),
      title: expect.any(String),
      type: expect.stringMatching(/doc|pdf|link/),
      url: expect.any(String),
    })
  })
})

describe('generate.researches', () => {
  it('should return multiple researches', () => {
    const res = generate.researches(2)
    expect(res.length).toBe(2)
    expect(res).toEqual(
      expect.arrayContaining([
        {
          _id: expect.any(String),
          description: expect.any(String),
          title: expect.any(String),
          type: expect.stringMatching(/doc|pdf|link/),
          url: expect.any(String),
        },
        {
          _id: expect.any(String),
          description: expect.any(String),
          title: expect.any(String),
          type: expect.stringMatching(/doc|pdf|link/),
          url: expect.any(String),
        },
      ])
    )
  })
})
