import { navigate, RouteComponentProps } from '@reach/router'
import * as React from 'react'
import styled from 'styled-components/macro'
import { Button, DeleteButton, HighSevDeleteButton, OutlineButton } from '../../components/Elements'
import FormHeading from '../../components/FormHeading'
import { IApiError, IPartner } from '../../sharedTypes'
import api from '../../utils/api'
import PartnerForm from './PartnerForm'
import { PartnerContext } from './Partners'
import Reports from './reports/Reports'

interface IProps extends RouteComponentProps {
  slug?: string
  handleError: (err: IApiError) => void
}

const Partner: React.FC<IProps> = ({ slug = '', handleError }) => {
  const [partner, setPartner] = React.useState<IPartner | undefined>(undefined)
  const [action, setAction] = React.useState<'create' | 'update'>(slug === 'new' ? 'create' : 'update')
  const [timesDeleteClicked, setTimesDeleteClicked] = React.useState(0)

  const partnerContext = React.useContext(PartnerContext)

  React.useEffect(() => {
    if (slug !== 'new') {
      // If the action is not already update set it to be update
      if (action !== 'update') {
        setAction('update')
      }
      api.partners.getBySlug(slug).then(updatePartner => {
        if (updatePartner) {
          setPartner(updatePartner)
        } else {
          navigate('/partners')
        }
      })
    } else {
      setPartner(undefined)
      setAction('create')
    }
  }, [action, slug])

  const handleCancel = () => {
    setTimesDeleteClicked(0)
    navigate('/partners')
  }

  const handleDeleteClicked = () => {
    if (partner && timesDeleteClicked === 1) {
      api.partners
        .delete(partner._id as string)
        .then(() => {
          partnerContext.updatePartners({ _id: partner._id, action: 'delete' })
          navigate('/partners')
        })
        .catch(handleError)
    } else {
      setTimesDeleteClicked(1)
    }
  }
  return (
    <div>
      <FormHeading _id={slug} action={action} singular="Partner" plural="Partners" route="/partners" />
      <PartnerForm
        action={action}
        handleError={handleError}
        partner={partner}
        updatePartners={partnerContext.updatePartners}
      />
      <Buttons>
        {action === 'update' &&
          (timesDeleteClicked === 0 ? (
            <DeleteButton onClick={handleDeleteClicked}>Delete</DeleteButton>
          ) : (
            <HighSevDeleteButton onClick={handleDeleteClicked}>CONFIRM DELETE</HighSevDeleteButton>
          ))}
        <RightButtons>
          <OutlineButton onClick={handleCancel}>Cancel</OutlineButton>
          <Button form="PartnerForm">{action === 'update' ? 'Update' : 'Create'} Partner</Button>
        </RightButtons>
      </Buttons>
      {slug !== 'new' && action === 'update' && partner && (
        <Reports partnerId={partner ? partner._id || '' : ''} handleError={handleError} reports={partner.reports} />
      )}
    </div>
  )
}

export default Partner

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 2rem 1.4rem;
  align-items: center;
`
const RightButtons = styled.div`
  margin-left: auto;
`
