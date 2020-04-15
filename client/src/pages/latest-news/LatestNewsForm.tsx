import * as React from 'react'
import { IForm } from '../../clientTypes'
import Editor from '../../components/Editor'
import {
  InputGroup,
  ResourceSection,
  UploadLabel,
  TrashCan,
  UploadImage,
  BlankUploadBox,
  UploadButton,
  TextUploadBox,
} from '../../components/Elements'
import { IModalController } from '../../components/table/useTable'
import { ILatestNews } from '../../sharedTypes'
import api from '../../utils/api'
import UserContext from '../../contexts/UserContext'
import { createError } from '../../hooks/useErrorHandler'
import styled from 'styled-components/macro'

interface IProps {
  modalController: IModalController<ILatestNews>
}

const LatestNewsForm: React.FC<IProps> = ({ modalController }) => {
  const { handleError, reset: resetModalState, updateItems } = modalController
  const { item: article, action } = modalController.state
  const [featuredImageUrl, setFeaturedImageUrl] = React.useState<string | undefined>()
  const [resourceUrl, setResourceUrl] = React.useState<string | undefined>()
  const [shortDescription, setShortDescription] = React.useState<string>()
  const [body, setBody] = React.useState<string>()

  const userContext = React.useContext(UserContext)
  const user = userContext.user

  React.useEffect(() => {
    if (article) {
      setBody(article.body)
      setShortDescription(article.shortDescription)
      setFeaturedImageUrl(article.featuredImage ? article.featuredImage.url : '')
    }
  }, [article])

  const uploadImage = () => {
    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: 'four-hmpp',
        uploadPreset: 'latest-news',
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
  const uploadResource = () => {
    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: 'four-hmpp',
        uploadPreset: 'latest-news',
      },
      (err: any, res: any) => {
        if (!err && res && res.event === 'success') {
          setResourceUrl(res.info.secure_url)
        }
        if (err) handleError(err)
      }
    )
    if (widget) widget.open()
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> & IForm) => {
    e.preventDefault()
    const { title } = e.currentTarget.elements

    if (!featuredImageUrl) return handleError(createError('Please supply a featured image', 400))

    const featuredImage = {
      alt: `${title.value} logo`,
      url: featuredImageUrl,
    }
    const updateArticle = {
      _id: article ? article._id : '',
      title: title.value,
      featuredImage,
      shortDescription: shortDescription ? shortDescription : '',
      author: action === 'create' ? (user ? user.name : '') : article ? article.author : '',
      createdAt: action === 'create' ? new Date().toDateString() : article ? article.createdAt : '',
      updatedAt: new Date().toDateString(),
      body: body ? body : '',
      resourceUrl: article ? article.resourceUrl : '',
    }

    if (action === 'update') {
      api.latestNews
        .update(updateArticle._id as string, updateArticle)
        .then(newArticle => {
          updateItems({ item: newArticle, action })
          resetModalState()
        })
        .catch(handleError)
    } else if (action === 'create') {
      api.latestNews
        .create(updateArticle)
        .then(newArticle => {
          updateItems({ item: newArticle, action })
          resetModalState()
        })
        .catch(handleError)
    }
  }

  return (
    <Form onSubmit={handleSubmit} id="ArticleForm">
      <InputGroup>
        <label htmlFor="title">Article Title</label>
        <input
          type="text"
          id="title"
          defaultValue={(article && article.title) || ''}
          required={true}
          autoFocus={true}
        />
      </InputGroup>
      <p>Created: {article && new Date(article.createdAt).toDateString()}</p>
      <p>Last Updated: {article && new Date(article.updatedAt).toDateString()}</p>
      <InputGroup>
        <label>Short Description</label>
        <Editor initialData={shortDescription} handleChange={setShortDescription} />
      </InputGroup>
      <InputGroup>
        <label>Body</label>
        <Editor initialData={body} handleChange={setBody} />
      </InputGroup>
      <NewsResources>
        <ResourceSection>
          <UploadLabel hasImage={featuredImageUrl}>
            Featured Image
            {featuredImageUrl && <TrashCan onClick={() => setFeaturedImageUrl(undefined)} />}
          </UploadLabel>
          {featuredImageUrl ? (
            <UploadImage src={featuredImageUrl} onClick={uploadImage} />
          ) : (
            <BlankUploadBox onClick={uploadImage}>
              <UploadButton>Upload Image</UploadButton>
            </BlankUploadBox>
          )}
        </ResourceSection>
        <ResourceSection>
          <UploadLabel hasImage={resourceUrl}>
            Featured Resource
            {resourceUrl && <TrashCan onClick={() => setResourceUrl(undefined)} />}
          </UploadLabel>
          {resourceUrl ? (
            <TextUploadBox>{resourceUrl}</TextUploadBox>
          ) : (
            <BlankUploadBox onClick={uploadResource}>
              <UploadButton>Upload Resource</UploadButton>
            </BlankUploadBox>
          )}
        </ResourceSection>
      </NewsResources>
    </Form>
  )
}

export default LatestNewsForm

const Form = styled.form`
  padding: 1.2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
`
const NewsResources = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
