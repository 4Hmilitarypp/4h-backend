import { navigate, RouteComponentProps } from '@reach/router'
import * as React from 'react'
import styled from 'styled-components/macro'
import { Button, DeleteButton, HighSevDeleteButton, OutlineButton } from '../../components/Elements'
import FormHeading from '../../components/FormHeading'
import { IApiError, ICamp } from '../../sharedTypes'
import api from '../../utils/api'
import CampDates from './campDates/CampDates'
import CampForm from './CampForm'
import { CampContext } from './Camps'

interface IProps extends RouteComponentProps {
  _id?: string
  handleError: (err: IApiError) => void
}

const Camp: React.FC<IProps> = ({ _id = '', handleError }) => {
  const [camp, setCamp] = React.useState<ICamp | undefined>(undefined)
  const [action, setAction] = React.useState<'create' | 'update'>(_id === 'new' ? 'create' : 'update')
  const [timesDeleteClicked, setTimesDeleteClicked] = React.useState(0)

  const campContext = React.useContext(CampContext)

  React.useEffect(() => {
    if (_id !== 'new') {
      // If the action is not already update set it to be update
      if (action !== 'update') {
        setAction('update')
      }
      const updateCamp = campContext.findById(_id)
      if (updateCamp) {
        setCamp(updateCamp)
      } else {
        navigate('/camps')
      }
    } else {
      setCamp(undefined)
      setAction('create')
    }
  }, [_id])

  const handleCancel = () => {
    setTimesDeleteClicked(0)
    navigate('/camps')
  }

  const handleDeleteClicked = () => {
    if (camp && timesDeleteClicked === 1) {
      api.camps
        .delete(camp._id as string)
        .then(() => {
          campContext.updateCamps({ _id: camp._id, action: 'delete' })
          navigate('/camps')
        })
        .catch(handleError)
    } else {
      setTimesDeleteClicked(1)
    }
  }
  return (
    <div>
      <FormHeading _id={_id} action={action} singular="Camp" plural="Camps" route="/camps" />
      <CampForm action={action} handleError={handleError} camp={camp} updateCamps={campContext.updateCamps} />
      <Buttons>
        {action === 'update' &&
          (timesDeleteClicked === 0 ? (
            <DeleteButton onClick={handleDeleteClicked}>Delete Camp</DeleteButton>
          ) : (
            <HighSevDeleteButton onClick={handleDeleteClicked}>CONFIRM DELETE</HighSevDeleteButton>
          ))}
        <RightButtons>
          <OutlineButton onClick={handleCancel}>Cancel</OutlineButton>
          <Button form="CampForm">{action === 'update' ? 'Update' : 'Create'} Camp</Button>
        </RightButtons>
      </Buttons>
      {_id !== 'new' && action === 'update' && camp && <CampDates campId={camp._id || ''} handleError={handleError} />}
    </div>
  )
}

export default Camp

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 2rem 1.4rem;
  align-items: center;
`
const RightButtons = styled.div`
  margin-left: auto;
`
