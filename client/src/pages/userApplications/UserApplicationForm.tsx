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
  handleError: (err: IApiError) => void
  userApplication: IFullUserApplication
  updateUserApplications: TUpdateUserApplications
}

const UserApplicationForm: React.FC<IProps> = ({ userApplication, handleError, updateUserApplications }) => {
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
          api.userApplications
            .update(userApplication._id as string, { url: res.info.secure_url, status: 'Not Submitted' })
            .then(newUserApplication => {
              updateUserApplications({ userApplication: newUserApplication, action: 'update' })
              window.location.reload()
            })
            .catch(handleError)
        }
        if (err) handleError(err)
      }
    )
    if (widget) widget.open()
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> & IForm) => {
    e.preventDefault()

    if (!applicationUrl) return handleError(createError('application url is required', 400))
    if (!userApplication) return
    api.userApplications
      .update(userApplication._id as string, { url: applicationUrl, status: 'Submitted' })
      .then(newUserApplication => {
        updateUserApplications({ userApplication: newUserApplication, action: 'update' })
        window.location.reload()
      })
      .catch(handleError)
  }

  const handleUrlChange = (e: any) => setApplicationUrl(e.target.value)
  return (
    // the id on the form must be what the corresponding submit button's formId is
    <Form onSubmit={handleSubmit} id="UserApplicationForm" ref={formRef}>
      <UserApplicationResources>
        <HeadingUploadLabel hasImage={applicationUrl}>Application Upload</HeadingUploadLabel>
        <InputSection>
          <UploadInput type="url" value={applicationUrl || ''} onChange={e => handleUrlChange(e)} />
        </InputSection>
        <UploadApplicationButton type="button" onClick={uploadApplication}>
          {applicationUrl ? 'Upload Different Application' : 'Upload New Application'}
        </UploadApplicationButton>
      </UserApplicationResources>
      <EmbedDocument
        inPage={true}
        url={applicationUrl as string}
        title={userApplication.title}
        open={true}
        setOpen={() => null}
      />
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
  margin-bottom: 3.6rem;
`
const InputSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  input {
    margin: 0 0 2.4rem;
  }
`
