import { navigate } from '@reach/router'
import * as React from 'react'
import styled from 'styled-components/macro'
import { IForm } from '../../clientTypes'
import {
  BlankUploadBox,
  InputGroup,
  LeftSubHeading,
  ResourceSection,
  SubHeading,
  TextUploadBox,
  TrashCan,
  UploadButton,
  UploadInput,
  UploadLabel,
} from '../../components/Elements'
import { createError } from '../../hooks/useErrorHandler'
import { IApiError, IApplication } from '../../sharedTypes'
import api from '../../utils/api'
import { TUpdateBaseApplications } from './useBaseApplications'

interface IProps {
  action: 'create' | 'update'
  handleError: (err: IApiError) => void
  baseApplication?: IApplication
  updateBaseApplications: TUpdateBaseApplications
}

const BaseApplicationForm: React.FC<IProps> = ({ action, baseApplication, handleError, updateBaseApplications }) => {
  const [applicationUrl, setApplicationUrl] = React.useState<string | undefined>(undefined)
  const formRef = React.useRef<HTMLFormElement>(null)

  React.useEffect(() => {
    if (baseApplication && baseApplication.url) {
      setApplicationUrl(baseApplication.url)
    }
    if (!baseApplication && formRef.current) {
      formRef.current.reset()
      setApplicationUrl(undefined)
    }
  }, [baseApplication])

  const uploadApplication = () => {
    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: 'four-hmpp',
        uploadPreset: 'applications',
      },
      (err: any, res: any) => {
        if (!err && res && res.event === 'success') {
          setApplicationUrl(res.info.secure_url)
        }
        if (err) handleError(err)
      }
    )
    if (widget) widget.open()
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> & IForm) => {
    e.preventDefault()

    if (!applicationUrl) return handleError(createError('application url is required', 400))

    const { dueDate, name, applicationUser } = e.currentTarget.elements as any

    const userGroups = []

    if (applicationUser.checked) userGroups.push('application-user')

    const updateBaseApplication = {
      _id: baseApplication ? baseApplication._id : undefined,
      dueDate: dueDate.value,
      name: name.value,
      url: applicationUrl,
      userGroups,
    }
    if (action === 'update') {
      api.applications
        .update(updateBaseApplication._id as string, updateBaseApplication)
        .then(newBaseApplication => {
          updateBaseApplications({ baseApplication: newBaseApplication, action })
          navigate(`/applications-admin/${newBaseApplication._id}`)
        })
        .catch(handleError)
    } else if (action === 'create') {
      api.applications
        .create(updateBaseApplication)
        .then(newBaseApplication => {
          updateBaseApplications({ baseApplication: newBaseApplication, action })
          navigate(`/applications-admin/${newBaseApplication._id}`)
        })
        .catch(handleError)
    }
  }

  const handleUrlChange = (e: any) => setApplicationUrl(e.target.value)

  return (
    // the id on the form must be what the corresponding submit button's formId is
    <Form onSubmit={handleSubmit} id="BaseApplicationForm" ref={formRef}>
      <SubHeading>Application Information</SubHeading>
      <CustomInputGroup>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" defaultValue={(baseApplication && baseApplication.name) || ''} autoFocus={true} />
      </CustomInputGroup>
      <CustomInputGroup>
        <label htmlFor="city">Due Date</label>
        <input
          type="date"
          id="dueDate"
          defaultValue={(baseApplication && baseApplication.dueDate.substr(0, 10)) || ''}
        />
      </CustomInputGroup>
      <CustomSubHeading>User Groups that should see this application</CustomSubHeading>
      <PermissionGroup>
        <label htmlFor="applicationUser">Application User</label>
        <CheckBox type="checkbox" id="applicationUser" defaultChecked={true} />
      </PermissionGroup>
      <BaseApplicationResources>
        <ResourceSection>
          <UploadLabel hasImage={applicationUrl}>
            Application Upload
            {applicationUrl && <TrashCan onClick={() => setApplicationUrl(undefined)} />}
          </UploadLabel>
          {applicationUrl ? (
            <TextUploadBox>{applicationUrl}</TextUploadBox>
          ) : (
            <BlankUploadBox onClick={uploadApplication}>
              <UploadButton>Upload Application</UploadButton>
            </BlankUploadBox>
          )}
          <UploadInput type="url" value={applicationUrl || ''} onChange={e => handleUrlChange(e)} />
        </ResourceSection>
      </BaseApplicationResources>
    </Form>
  )
}

export default BaseApplicationForm

const Form = styled.form`
  padding: 1.2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
`
const CustomInputGroup = styled(InputGroup)`
  input,
  textarea,
  select {
    background: ${props => props.theme.white};
  }
`
const BaseApplicationResources = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
const CustomSubHeading = styled(LeftSubHeading)`
  font-size: 2rem;
  padding-bottom: 0.8rem;
`
const PermissionGroup = styled.div`
  flex-grow: 1;
  margin: 0 0 1.2rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`
const CheckBox = styled.input`
  margin-left: 1.6rem;
`
