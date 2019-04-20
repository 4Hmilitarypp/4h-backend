import { map } from 'lodash'
import * as React from 'react'
import styled from 'styled-components/macro'
import { Heading } from '../../../components/Elements'
import { IApiError, IReport } from '../../../sharedTypes'
import Report from './Report'
import ReportModal from './ReportModal'
import useReports from './useReports'

interface IProps {
  partnerId: string
  handleError: (err: IApiError) => void
  reports: IReport[]
}

const Reports: React.FC<IProps> = ({ partnerId, handleError, reports: propReports }) => {
  const { modalController, reports } = useReports(handleError, propReports)
  return (
    <Wrapper>
      <TableHeader>
        <CustomHeading>Reports</CustomHeading>
        <CreateButton onClick={() => modalController.set({ action: 'create', partnerId })}>+ New Report</CreateButton>
      </TableHeader>
      <div>
        {map(reports, r => {
          return <Report report={r} key={r._id} partnerId={partnerId} setModalState={modalController.set} />
        })}
      </div>
      <ReportModal controller={modalController} />
      <BottomPadding />
    </Wrapper>
  )
}

export default Reports
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
