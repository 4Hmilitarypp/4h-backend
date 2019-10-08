import * as React from 'react'
import { IForm } from '../../clientTypes'
import Editor from '../../components/Editor'
import { InputGroup, ModalForm } from '../../components/Elements'
import { IModalController } from '../../components/table/useTable'
import { ILatestNews } from '../../sharedTypes'
import api from '../../utils/api'
import UserContext from '../../contexts/UserContext'

interface IProps {
  modalController: IModalController<ILatestNews>
}

const LatestNewsForm: React.FC<IProps> = ({ modalController }) => {
  const { handleError, reset: resetModalState, updateItems } = modalController
  const { item: article, action } = modalController.state
  const [shortDescription, setShortDescription] = React.useState<string>()
  const [body, setBody] = React.useState<string>()
  const user = React.useContext(UserContext).user
  React.useEffect(() => {
    if (article) setShortDescription(article.shortDescription)
  }, [article])
  React.useEffect(() => {
    if (article) setBody(article.body)
  }, [article])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> & IForm) => {
    e.preventDefault()
    const { title } = e.currentTarget.elements
    const updateArticle = {
      title: title.value,
      body: body || '',
      shortDescription: shortDescription || '',
      featuredImage: {
        url: article ? article.featuredImage.url : '',
        alt: article ? article.featuredImage.alt : '',
      },
      postedDate: article ? article.postedDate : '',
      author: article ? article.author : '',
      slug: article ? article.slug : '',
      id: article ? article.id : '',
      createdAt: article ? article.createdAt : '',
      updatedBy: user ? user.name : '',
      updatedAt: article ? article.updatedAt : '',
      createdBy: action === 'create' ? (user ? user.name : '') : article ? article.createdBy : '',
    }
    if (action === 'update') {
      api.latestNews
        .update(updateArticle.id as string, updateArticle)
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
    <ModalForm onSubmit={handleSubmit} id="ArticleForm">
      <InputGroup>
        <label htmlFor="title">Article Title</label>
        <input type="text" id="title" defaultValue={article ? article.title : ''} required={true} autoFocus={true} />
      </InputGroup>
      <label>Created By: {article ? article.createdBy : ''}</label>
      <label>Last Updated By: {article ? article.updatedBy : ''}</label>
      <InputGroup>
        <label>Short Description</label>
        <Editor initialData={shortDescription} handleChange={setShortDescription} />
      </InputGroup>
      <InputGroup>
        <label>Body</label>
        <Editor initialData={body} handleChange={setBody} />
      </InputGroup>
    </ModalForm>
  )
}

export default LatestNewsForm
