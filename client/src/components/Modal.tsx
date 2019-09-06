import * as React from 'react'
import styled from 'styled-components/macro'
import Icon from '../components/Icon'
import { media } from '../utils/mixins'
import { Button, DeleteButton, HighSevDeleteButton, OutlineButton } from './Elements'
import Portal from './Portal'

interface IProps {
  open: boolean
  setOpen: (on: boolean) => void
  closeButton?: boolean
}

const Modal: React.FC<IProps> = ({ children, open, setOpen, closeButton = true }) => {
  React.useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    if (open) {
      window.addEventListener('keydown', handleKeydown)
    } else {
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [open]) // eslint-disable-line

  return (
    <Portal>
      {open && (
        <ModalWrapper>
          <ModalCard>
            {closeButton && (
              <CloseButton onClick={() => setOpen(false)} data-testid="close-button">
                <Icon name="close" color="#ffffff" />
              </CloseButton>
            )}
            <div>{children}</div>
          </ModalCard>
          <Background onClick={() => setOpen(false)} data-testid="background" />
        </ModalWrapper>
      )}
    </Portal>
  )
}

interface IModalButtonsProps {
  action: 'create' | 'update' | 'delete' | 'close'
  cancelHandler: () => void
  deleteHandler: () => void
  formId: string
  itemName: string
  timesDeleteClicked: number
}

export const ModalButtons: React.FC<IModalButtonsProps> = ({
  action,
  cancelHandler,
  deleteHandler,
  formId,
  itemName,
  timesDeleteClicked,
}) => {
  return (
    <Buttons>
      {action === 'update' &&
        (timesDeleteClicked === 0 ? (
          <DeleteButton onClick={deleteHandler}>Delete</DeleteButton>
        ) : (
          <HighSevDeleteButton onClick={deleteHandler}>CONFIRM DELETE</HighSevDeleteButton>
        ))}
      <RightButtons>
        <OutlineButton onClick={cancelHandler}>Cancel</OutlineButton>
        <Button form={formId}>
          {action === 'update' ? 'Update' : 'Create'} {itemName}
        </Button>
      </RightButtons>
    </Buttons>
  )
}
export default Modal

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ModalCard = styled.div`
  position: relative;
  background: white;
  border-radius: 5px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
  z-index: 2;
  min-width: 70rem;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  ${media.tabletPort`
    min-width: unset;
  `}
`
const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
`
const CloseButton = styled.button`
  position: absolute;
  top: 0.9rem;
  padding: 0;
  right: 1.2rem;
  border: none;
  background: transparent;
  fill: ${props => props.theme.white};
  width: 20px;
  height: 20px;
  cursor: pointer;
`
export const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 3.2rem 1.2rem 2rem;
  align-items: center;
`
export const RightButtons = styled.div`
  margin-left: auto;
`
