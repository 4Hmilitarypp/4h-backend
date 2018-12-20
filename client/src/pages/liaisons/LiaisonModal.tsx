import { isEqual } from 'lodash'
import * as React from 'react'
import styled from 'styled-components/macro'
import { Button } from '../../components/Elements'
import Flash from '../../components/Flash'
import Modal from '../../components/Modal'
import { useFlash } from '../../hooks/hooks'
import { ILiaison } from '../../sharedTypes'
import { IApiError, IForm } from '../../types'
import api from '../../utils/api'
import LiaisonForm from './LiaisonForm'
import { LiaisonsContext } from './Liaisons'

interface IProps {
  liaison?: ILiaison
  open: boolean
  setOpen: (open: boolean) => void
  action: 'update' | 'create'
}

const formatError = (err: IApiError) => err.response.data.message

const LiaisonModal: React.FC<IProps> = ({ open, setOpen, liaison, action }) => {
  const { error, setError } = useFlash({ initialSubmitted: false })
  const [timesDeleteClicked, setTimesDeleteClicked] = React.useState(0)
  const context = React.useContext(LiaisonsContext)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> & IForm) => {
    e.preventDefault()
    const { abbreviation, email, image, name, phoneNumber, region } = e.currentTarget.elements
    const updateLiaison = {
      abbreviation: abbreviation.value,
      email: email.value,
      image: image.value,
      liaisonId: liaison ? liaison.liaisonId : undefined,
      name: name.value,
      phoneNumber: phoneNumber.value,
      region: region.value,
    }
    if (action === 'update') {
      api.liaisons
        .update(updateLiaison)
        .then(newLiaison => {
          context.updateLiaisons({ liaison: newLiaison, action })
          if (isEqual(newLiaison, liaison)) {
            setOpen(false)
          }
        })
        .catch((err: IApiError) => setError(formatError(err)))
    } else if (action === 'create') {
      api.liaisons
        .create(updateLiaison)
        .then(newLiaison => {
          context.updateLiaisons({ liaison: newLiaison, action })
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
    if (liaison && timesDeleteClicked === 1) {
      api.liaisons
        .delete(liaison.liaisonId as string)
        .then(res => {
          context.updateLiaisons({ liaisonId: liaison.liaisonId, action: 'delete' })
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
      <ModalHeading>{`${
        action === 'update' ? `Updating ${liaison && liaison.name}` : 'Create a new Liaison'
      }`}</ModalHeading>
      <LiaisonForm onSubmit={handleSubmit} liaison={liaison}>
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
            <Button>{action === 'update' ? 'Update' : 'Create'} Liaison</Button>
          </RightButtons>
        </Buttons>
      </LiaisonForm>
    </Modal>
  )
}

export default LiaisonModal

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
