import * as React from 'react'
import styled from 'styled-components/macro'
import { InputGroup } from '../../../components/Elements'
import { IDisplayCurriculumResource } from '../../../sharedTypes'

interface IProps {
  curriculumResource?: IDisplayCurriculumResource
  onSubmit: (e: any) => void
  setRef: (ref: React.RefObject<HTMLFormElement>) => void
}

const CurriculumResourceForm: React.FC<IProps> = ({ onSubmit, curriculumResource, setRef }) => {
  const formRef = React.useRef<HTMLFormElement>(null)

  React.useEffect(() => setRef(formRef), [formRef])

  return (
    <Form onSubmit={onSubmit} ref={formRef}>
      {console.log(curriculumResource, curriculumResource && curriculumResource.description)}
      <CustomInputGroup>
        <label htmlFor="title">Curriculum Resource Title</label>
        <input type="text" id="title" defaultValue={(curriculumResource && curriculumResource.title) || ''} />
      </CustomInputGroup>
      <CustomInputGroup>
        <label htmlFor="featuredImageUrl">Featured Image Url</label>
        <input
          type="text"
          id="featuredImageUrl"
          defaultValue={
            (curriculumResource && curriculumResource.featuredImage && curriculumResource.featuredImage.url) || ''
          }
        />
      </CustomInputGroup>
      <CustomInputGroup>
        <label htmlFor="featuredImageAlt">Featured Image Description</label>
        <input
          type="text"
          id="featuredImageAlt"
          defaultValue={
            (curriculumResource && curriculumResource.featuredImage && curriculumResource.featuredImage.url) || ''
          }
        />
        <CustomInputGroup>
          <label htmlFor="description">Description</label>
          {/* Had to do the following because the description was not showing up for some reason */}
          {curriculumResource ? (
            <>
              <textarea id="description" defaultValue={curriculumResource.description} rows={5} />
            </>
          ) : (
            <textarea id="description" rows={5} />
          )}
        </CustomInputGroup>
      </CustomInputGroup>
    </Form>
  )
}

export default CurriculumResourceForm
const Form = styled.form`
  padding: 1.2rem 2rem 0;
  display: flex;
  flex-direction: column;
`
const CustomInputGroup = styled(InputGroup)`
  input,
  textarea {
    background: ${props => props.theme.white};
  }
`
