import { navigate } from '@reach/router'
import * as React from 'react'
import styled from 'styled-components/macro'
import { IForm } from '../../clientTypes'
import {
  BlankUploadBox,
  ResourceSection,
  TextUploadBox,
  TrashCan,
  UploadButton,
  UploadLabel,
} from '../../components/Elements'
import { createError } from '../../hooks/useErrorHandler'
import { IApiError, IUserApplication } from '../../sharedTypes'
import api from '../../utils/api'
import { TUpdateUserApplications } from './useUserApplications'

interface IProps {
  action: 'create' | 'update'
  handleError: (err: IApiError) => void
  userApplication?: IUserApplication
  updateUserApplications: TUpdateUserApplications
}

const UserApplicationForm: React.FC<IProps> = ({ action, userApplication, handleError, updateUserApplications }) => {
  const [applicationUrl, setApplicationUrl] = React.useState<string | undefined>(undefined)
  const formRef = React.useRef<HTMLFormElement>(null)

  React.useEffect(() => {
    if (userApplication && userApplication.url) {
      setApplicationUrl(userApplication.url)
    }
    if (!userApplication && formRef.current) {
      formRef.current.reset()
      setApplicationUrl(undefined)
    }
  }, [userApplication])

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

    const updateUserApplication = {
      _id: userApplication ? userApplication._id : undefined,
      url: applicationUrl,
    }
    if (action === 'update') {
      api.userApplications
        .update(updateUserApplication._id as string, updateUserApplication)
        .then(newUserApplication => {
          updateUserApplications({ userApplication: newUserApplication, action })
          navigate(`/applications/${newUserApplication._id}`)
        })
        .catch(handleError)
    } else if (action === 'create') {
      api.userApplications
        .create(updateUserApplication)
        .then(newUserApplication => {
          updateUserApplications({ userApplication: newUserApplication, action })
          navigate(`/applications/${newUserApplication._id}`)
        })
        .catch(handleError)
    }
  }

  return (
    // the id on the form must be what the corresponding submit button's formId is
    <Form onSubmit={handleSubmit} id="UserApplicationForm" ref={formRef}>
      <UserApplicationResources>
        <ResourceSection>
          <HeadingUploadLabel hasImage={applicationUrl}>
            Application Upload
            {applicationUrl && <TrashCan onClick={() => setApplicationUrl(undefined)} />}
          </HeadingUploadLabel>
          {applicationUrl ? (
            <TextUploadBox>{applicationUrl}</TextUploadBox>
          ) : (
            <BlankUploadBox onClick={uploadApplication}>
              <UploadButton>Upload Application</UploadButton>
            </BlankUploadBox>
          )}
        </ResourceSection>
      </UserApplicationResources>
    </Form>
  )
}

export default UserApplicationForm

const Form = styled.form`
  padding: 1.2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
`
const UserApplicationResources = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
const HeadingUploadLabel = styled(UploadLabel)`
  font-size: 2.4rem;
  padding-bottom: 3.6rem;
`
