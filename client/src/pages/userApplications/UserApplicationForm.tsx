import { navigate } from '@reach/router'
import * as React from 'react'
import styled from 'styled-components/macro'
import { IForm } from '../../clientTypes'
import { Button, UploadInput, UploadLabel } from '../../components/Elements'
import EmbedDocument from '../../components/EmbedDocument'
import { createError } from '../../hooks/useErrorHandler'
import { IApiError, IFullUserApplication } from '../../sharedTypes'
import api from '../../utils/api'
import { TUpdateUserApplications } from './useUserApplications'

interface IProps {
  action: 'create' | 'update'
  handleError: (err: IApiError) => void
  userApplication?: IFullUserApplication
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

  const handleUrlChange = (e: any) => setApplicationUrl(e.target.value)

  return (
    // the id on the form must be what the corresponding submit button's formId is
    <Form onSubmit={handleSubmit} id="UserApplicationForm" ref={formRef}>
      <UserApplicationResources>
        <HeadingUploadLabel hasImage={applicationUrl}>Application Upload</HeadingUploadLabel>
        {userApplication && (
          <EmbedDocument
            inPage={true}
            url={applicationUrl as string}
            title={userApplication.title}
            open={true}
            setOpen={() => null}
          />
        )}
        <UploadApplicationButton type="button" onClick={uploadApplication}>
          {applicationUrl ? 'Upload Different Application' : 'Upload New Application'}
        </UploadApplicationButton>
        <InputSection>
          <UploadInput type="url" value={applicationUrl || ''} onChange={e => handleUrlChange(e)} />
        </InputSection>
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
  flex-direction: column;
`
const HeadingUploadLabel = styled(UploadLabel)`
  font-size: 2.7rem;
  padding: 3.6rem 0;
  color: ${props => props.theme.primaryBlack};
  width: auto;
  font-weight: 600;
  font-family: Raleway;
`
const UploadApplicationButton = styled(Button)`
  margin-top: 3.6rem;
`
const InputSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`
