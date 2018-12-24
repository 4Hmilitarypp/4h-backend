import * as React from 'react'
import styled from 'styled-components/macro'
import { Button } from '../../components/Elements'
import Flash from '../../components/Flash'
import Modal from '../../components/Modal'
import { useFlash } from '../../hooks/hooks'
import { IResearch } from '../../sharedTypes'
import { IApiError, IForm } from '../../types'
import api from '../../utils/api'
import { ResearchContext } from './Researches'
import ResearchForm from './ResearchForm'

interface IProps {
  research?: IResearch
  open: boolean
  setOpen: (open: boolean) => void
  action: 'update' | 'create'
}

const formatError = (err: IApiError) => err.response.data.message

const ResearchModal: React.FC<IProps> = ({ open, setOpen, research, action }) => {
  const { error, setError } = useFlash({ initialSubmitted: false })
  const [timesDeleteClicked, setTimesDeleteClicked] = React.useState(0)
  const context = React.useContext(ResearchContext)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> & IForm) => {
    e.preventDefault()
    const { description, title, type, url } = e.currentTarget.elements
    const updateResearch = {
      description: description.value,
      researchId: research ? research.researchId : undefined,
      title: title.value,
      type: type.value as 'pdf' | 'doc' | 'link',
      url: url.value,
    }
    if (action === 'update') {
      api.research
        .update(updateResearch)
        .then(newResearch => {
          context.updateResearches({ research: newResearch, action })
          setOpen(false)
        })
        .catch((err: IApiError) => setError(formatError(err)))
    } else if (action === 'create') {
      api.research
        .create(updateResearch)
        .then(newResearch => {
          context.updateResearches({ research: newResearch, action })
          setOpen(false)
        })
        .catch((err: IApiError) => setError(formatError(err)))
    }
  }

  const handleCancel = () => {
    setOpen(false)
    setTimesDeleteClicked(0)
  }

  const handleDeleteClicked = () => {
    if (research && timesDeleteClicked === 1) {
      api.research
        .delete(research.researchId as string)
        .then(res => {
          context.updateResearches({ researchId: research.researchId, action: 'delete' })
        })
        .catch((err: IApiError) => {
          setError(formatError(err))
        })
    } else {
      setTimesDeleteClicked(1)
    }
  }

  return (
    <Modal open={open} setOpen={setOpen} closeButton={false}>
      <Flash error={error} closeClicked={() => setError(undefined)} fixed={false} />
      <ModalHeading>{`${action === 'update' ? 'Updating a research item' : 'Create a new Research'}`}</ModalHeading>
      <ResearchForm onSubmit={handleSubmit} research={research}>
        <Buttons>
          {action === 'update' &&
            (timesDeleteClicked === 0 ? (
              <DeleteButton type="button" onClick={handleDeleteClicked}>
                Delete
              </DeleteButton>
            ) : (
              <HighSevDeleteButton type="button" onClick={handleDeleteClicked}>
                CONFIRM DELETE
              </HighSevDeleteButton>
            ))}
          <RightButtons>
            <OutlineButton type="button" onClick={handleCancel}>
              Cancel
            </OutlineButton>
            <Button>{action === 'update' ? 'Update' : 'Create'} Research</Button>
          </RightButtons>
        </Buttons>
      </ResearchForm>
    </Modal>
  )
}

export default ResearchModal

const ModalHeading = styled.h3`
  color: ${props => props.theme.primaryText};
  padding: 1.2rem 1.6rem 0;
  text-align: center;
`
const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 2rem;
  align-items: center;
`
const DeleteButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.warning};
  font-weight: 500;
  padding: 0;
  margin-left: 1.2rem;
  &:hover {
    cursor: pointer;
  }
`
const HighSevDeleteButton = styled(Button)`
  background: ${props => props.theme.warning};
  letter-spacing: 0.6px;
`
const RightButtons = styled.div`
  margin-left: auto;
`
const OutlineButton = styled(Button)`
  border: 2px solid ${props => props.theme.buttonBackground};
  padding: 0.8rem 1.4rem;
  background: none;
  color: ${props => props.theme.buttonBackground};
  margin-right: 1.6rem;
`
