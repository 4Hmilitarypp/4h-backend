import { RouteComponentProps } from '@reach/router'
import * as React from 'react'
import styled from 'styled-components/macro'
import { theme } from '../../App'
import { IForm } from '../../clientTypes'
import {
  BlankUploadBox,
  Button,
  InputGroup,
  SubHeading,
  UploadButton,
  UploadImage,
  UploadLabel,
} from '../../components/Elements'
import Icon from '../../components/Icon'
import useErrorHandler from '../../hooks/useErrorHandler'
import usePermission from '../../hooks/usePermission'
import api from '../../utils/api'

const HomeInfo: React.FC<RouteComponentProps> = () => {
  const handleError = useErrorHandler()
  usePermission('admin')
  const [homeInfo, setHomeInfo] = React.useState<any>()
  React.useEffect(() => {
    api.pageInfo
      .get('home')
      .then(setHomeInfo)
      .catch(handleError)
  }, [])

  const [featuredImageUrl, setFeaturedImageUrl] = React.useState<string | undefined>(undefined)
  const formRef = React.useRef<HTMLFormElement>(null)

  React.useEffect(() => {
    if (homeInfo && homeInfo.featuredImage) {
      setFeaturedImageUrl(homeInfo.featuredImage.url)
    }
    if (!homeInfo && formRef.current) {
      formRef.current.reset()
      setFeaturedImageUrl(undefined)
    }
  }, [homeInfo])

  const uploadImage = () => {
    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: 'four-hmpp',
        uploadPreset: 'camp-images',
      },
      (err: any, res: any) => {
        if (!err && res && res.event === 'success') {
          setFeaturedImageUrl(res.info.secure_url)
        }
        if (err) handleError(err)
      }
    )
    if (widget) widget.open()
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> & IForm) => {
    e.preventDefault()
    const { title, text } = e.currentTarget.elements

    const featuredImage = featuredImageUrl
      ? {
          alt: title.value,
          url: featuredImageUrl,
        }
      : undefined

    homeInfo
      ? api.pageInfo.update('home', { title: title.value, featuredImage, text: text.value })
      : api.pageInfo.create({ featuredImage, title: title.value, text: text.value, page: 'home' })
  }
  return (
    <Form onSubmit={handleSubmit} id="LiaisonForm">
      <SubHeading>Home Page Information</SubHeading>
      <CustomInputGroup>
        <label htmlFor="title">Section Title</label>
        <input type="text" id="title" defaultValue={(homeInfo && homeInfo.title) || ''} />
      </CustomInputGroup>
      <CustomInputGroup>
        <label htmlFor="text">Section Text</label>
        {homeInfo ? (
          <>
            <textarea id="text" name="text" defaultValue={homeInfo.text} rows={5} />
          </>
        ) : (
          <textarea id="text" name="text" rows={5} />
        )}
      </CustomInputGroup>
      <ResourceSection>
        <UploadLabel hasImage={featuredImageUrl}>
          Featured Image
          {featuredImageUrl && (
            <DeleteIcon
              name="delete"
              height={2.5}
              color={theme.warning}
              onClick={() => setFeaturedImageUrl(undefined)}
            />
          )}
        </UploadLabel>
        {featuredImageUrl ? (
          <UploadImage
            src={featuredImageUrl.split('h_850,q_80,w_1650').join('h_250,q_80,w_250')}
            onClick={uploadImage}
          />
        ) : (
          <BlankUploadBox onClick={uploadImage}>
            <UploadButton>Upload Image</UploadButton>
          </BlankUploadBox>
        )}
      </ResourceSection>
      <Button type="submit">Update</Button>
    </Form>
  )
}

export default HomeInfo
const Form = styled.form`
  padding: 1.2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  max-width: 90rem;
  margin: 0 auto;
`
const ResourceSection = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.8rem;
`
const DeleteIcon = styled(Icon)`
  &:hover {
    cursor: pointer;
  }
`
const CustomInputGroup = styled(InputGroup)`
  input,
  textarea {
    background: ${props => props.theme.white};
  }
`
