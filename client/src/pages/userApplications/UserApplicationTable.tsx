import { Link, RouteComponentProps } from '@reach/router'
import { format } from 'date-fns'
import { map } from 'lodash'
import * as React from 'react'
import styled from 'styled-components/macro'
import { B, Heading, InputGroup } from '../../components/Elements'
import { hoveredRow } from '../../utils/mixins'
import { UserApplicationContext } from './UserApplications'

const BaseApplicationTable: React.FC<RouteComponentProps> = () => {
  const context = React.useContext(UserApplicationContext)

  const [filterText, setFilterText] = React.useState<string>('')
  const isFound = (...args: string[]) => args.some(s => s.toLowerCase().includes(filterText))
  const filterAndSortBaseApplications = () =>
    context.userApplications
      .filter(userApplication => !filterText || isFound(userApplication.title))
      .sort((a, b) => (a.dueDate > b.dueDate ? 1 : -1))

  return (
    <div>
      <TableHeader>
        <BaseApplicationHeading>Applications</BaseApplicationHeading>
      </TableHeader>
      <CustomInputGroup color="white">
        <label>Filter Applications</label>
        <input value={filterText} onChange={e => setFilterText(e.currentTarget.value.toLowerCase())} />
      </CustomInputGroup>
      <div>
        {map(filterAndSortBaseApplications(), p => (
          <Wrapper to={p._id || ''} key={p._id}>
            <TitleAndDate>
              <Title>{p.title}</Title>
              <span>{format(new Date(p.dueDate), 'MMMM d yyyy')}</span>
            </TitleAndDate>
            <B>{p.status}</B>
          </Wrapper>
        ))}
      </div>
    </div>
  )
}

export default BaseApplicationTable

const TableHeader = styled.div`
  padding: 0rem 4rem 3.2rem;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`
const BaseApplicationHeading = styled(Heading)`
  padding: 4rem 0 0;
`
const Wrapper = styled(Link)`
  padding: 1.2rem 4rem;
  position: relative;
  display: grid;
  grid-template-columns: 1fr 3fr;
  justify-content: center;
  align-items: center;
  ${hoveredRow()};
  &:nth-child(2n - 1) {
    background: ${props => props.theme.white};
  }
`
const TitleAndDate = styled.span`
  color: ${props => props.theme.primaryGrey};
  padding-right: 2.4rem;
  display: flex;
  flex-direction: column;
`
const Title = styled.span`
  font-weight: 500;
`

const CustomInputGroup = styled(InputGroup)`
  margin: 0 2.4rem 2rem;
`
