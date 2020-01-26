import { Link, RouteComponentProps } from '@reach/router'
import { format } from 'date-fns'
import { map } from 'lodash'
import * as React from 'react'
import styled from 'styled-components/macro'
import BackButton from '../../../components/BackButton'
import { CreateButton, Heading, InputGroup } from '../../../components/Elements'
import { hoveredRow } from '../../../utils/mixins'
import { BaseApplicationContext } from './BaseApplications'

const BaseApplicationTable: React.FC<RouteComponentProps> = () => {
  const context = React.useContext(BaseApplicationContext)

  const [filterText, setFilterText] = React.useState<string>('')
  const isFound = (...args: string[]) => args.some(s => s.toLowerCase().includes(filterText))
  const filterAndSortBaseApplications = () =>
    context.baseApplications
      .filter(baseApplication => !filterText || isFound(baseApplication.title))
      .sort((a, b) => (a.dueDate > b.dueDate ? 1 : -1))

  return (
    <div>
      <TableHeader>
        <BackButton
          route={'/applications-admin'}
          backText={'Applications Dashboard'}
          title={'Applications Dashboard'}
        />
        <BaseApplicationHeading>Base Applications</BaseApplicationHeading>
        <CustomCreateButton as={Link} to="new">
          + New Application
        </CustomCreateButton>
      </TableHeader>
      <CustomInputGroup color="white">
        <label>Filter Applications</label>
        <input value={filterText} onChange={e => setFilterText(e.currentTarget.value.toLowerCase())} />
      </CustomInputGroup>
      <div>
        {map(filterAndSortBaseApplications(), p => (
          <Wrapper to={p._id || ''} key={p._id}>
            <CityAndState>{`${p.title}`}</CityAndState>
            <DueDate>{`${format(new Date(p.dueDate), 'MMMM D YYYY')}`}</DueDate>
          </Wrapper>
        ))}
      </div>
    </div>
  )
}

export default BaseApplicationTable

const TableHeader = styled.div`
  padding: 0rem 4rem 3.2rem;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  justify-content: center;
  align-items: baseline;
`
const BaseApplicationHeading = styled(Heading)`
  padding: 4rem 0 0;
`
const CustomCreateButton = styled(CreateButton)`
  justify-self: flex-end;
`
const Wrapper = styled(Link)`
  padding: 2rem;
  position: relative;
  display: grid;
  grid-template-columns: 1fr 3fr;
  ${hoveredRow()};
  &:nth-child(2n - 1) {
    background: ${props => props.theme.white};
  }
`
const CityAndState = styled.span`
  color: ${props => props.theme.primaryGrey};
  padding-right: 2.4rem;
`
const DueDate = styled.span`
  font-weight: 500;
  color: ${props => props.theme.primaryGrey};
`
const CustomInputGroup = styled(InputGroup)`
  margin: 0 2.4rem 2rem;
`
