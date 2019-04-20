import { map } from 'lodash'
import * as React from 'react'
import styled from 'styled-components/macro'
import { Heading } from '../../../components/Elements'
import { IApiError } from '../../../sharedTypes'
import CampDate from './CampDate'
import CampDateModal from './CampDateModal'
import useCampDates from './useCampDates'

interface IProps {
  campId: string
  handleError: (err: IApiError) => void
}

const CampDates: React.FC<IProps> = ({ campId, handleError }) => {
  const { modalController, campDates } = useCampDates(handleError, campId)
  return (
    <Wrapper>
      <TableHeader>
        <CustomHeading>Camp Dates</CustomHeading>
        <CreateButton onClick={() => modalController.set({ action: 'create', campId })}>+ New Camp Date</CreateButton>
      </TableHeader>
      <div>
        {map(campDates, r => {
          return <CampDate campDate={r} key={r._id} campId={campId} setModalState={modalController.set} />
        })}
      </div>
      <CampDateModal controller={modalController} />
      <BottomPadding />
    </Wrapper>
  )
}

export default CampDates
const Wrapper = styled.div`
  margin-top: 3.2rem;
  background: ${props => props.theme.primaryLight};
`
const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 0 3.2rem;
`
const CustomHeading = styled(Heading)`
  font-size: 2.4rem;
`
const CreateButton = styled.button`
  background: ${props => props.theme.primaryBackground};
  border: none;
  color: ${props => props.theme.primaryLink};
  font-weight: 500;
  padding: 0.8rem 1.2rem;
  border-radius: 20px;
  font-size: 1.4rem;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`
const BottomPadding = styled.div`
  height: 3.2rem;
  width: 100%;
  background: ${props => props.theme.primaryBackground};
`
