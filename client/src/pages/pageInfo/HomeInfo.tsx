import { RouteComponentProps } from '@reach/router'
import * as React from 'react'
import styled from 'styled-components/macro'
import { IForm } from '../../clientTypes'
import Editor from '../../components/Editor'
import {
  BlankUploadBox,
  Button,
  InputGroup,
  ResourceSection,
  SubHeading,
  TrashCan,
  UploadButton,
  UploadImage,
  UploadLabel,
} from '../../components/Elements'
import useErrorHandler from '../../hooks/useErrorHandler'
import usePermission from '../../hooks/usePermission'
import api from '../../utils/api'

const HomeInfo: React.FC<RouteComponentProps> = () => {
  const handleError = useErrorHandler()
  usePermission('admin')
  const [homeInfo, setHomeInfo] = React.useState<any>()
  React.useEffect(() => {
    api.pageInfo.get('home').then(setHomeInfo).catch(handleError)
  }, []) // eslint-disable-line

  const [featuredImageUrl, setFeaturedImageUrl] = React.useState<string | undefined>(undefined)
  const [sectionText, setSectionText] = React.useState<string>()
  const formRef = React.useRef<HTMLFormElement>(null)

  React.useEffect(() => {
    if (homeInfo) setSectionText(homeInfo.text)
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
          const optimizedUrl = res.info.secure_url.split('/upload/').join('/upload/f_auto,q_80/')
          setFeaturedImageUrl(optimizedUrl)
        }
        if (err) handleError(err)
      }
    )
    if (widget) widget.open()
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> & IForm) => {
    e.preventDefault()
    const { title } = e.currentTarget.elements

    const featuredImage = featuredImageUrl
      ? {
          alt: title.value,
          url: featuredImageUrl,
        }
      : { alt: '', url: '' }

    if (homeInfo) {
      api.pageInfo
        .update('home', { page: 'home', title: title.value, featuredImage, text: sectionText || '' })
        .then(newHomeInfo => {
          setHomeInfo(newHomeInfo)
        })
        .catch(handleError)
    } else {
      api.pageInfo
        .create({ featuredImage, title: title.value, text: sectionText || '', page: 'home' })
        .then(newHomeInfo => {
          setHomeInfo(newHomeInfo)
        })
        .catch(handleError)
    }
  }
  return (
    <Form onSubmit={handleSubmit} id="LiaisonForm">
      <SubHeading>Home Page Information</SubHeading>
      <CustomInputGroup>
        <label htmlFor="title">Section Title</label>
        <input type="text" id="title" defaultValue={(homeInfo && homeInfo.title) || ''} />
      </CustomInputGroup>
      <CustomInputGroup>
        <label>Section Text</label>
        <Editor initialData={sectionText} handleChange={setSectionText} />
      </CustomInputGroup>
      <CustomResourceSection>
        <UploadLabel hasImage={featuredImageUrl}>
          Featured Image
          {featuredImageUrl && <TrashCan onClick={() => setFeaturedImageUrl(undefined)} />}
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
      </CustomResourceSection>
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
const CustomResourceSection = styled(ResourceSection)`
  margin-bottom: 1.8rem;
`
const CustomInputGroup = styled(InputGroup)`
  input,
  textarea {
    background: ${props => props.theme.white};
  }
`
