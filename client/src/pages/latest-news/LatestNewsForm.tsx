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
  const userContext = React.useContext(UserContext)
  console.log(userContext)

  React.useEffect(() => {
    if (article) setShortDescription('Short Description')
  }, [article])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> & IForm) => {
    e.preventDefault()
    const { title } = e.currentTarget.elements
    const updateArticle = {
      _id: article ? article._id : '',
      title: title.value,
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
    <ModalForm onSubmit={handleSubmit} id="News ItemForm">
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
      <InputGroup>
        <label>Short Description</label>
        <Editor initialData={shortDescription} handleChange={setShortDescription} />
      </InputGroup>
    </ModalForm>
  )
}

export default LatestNewsForm
