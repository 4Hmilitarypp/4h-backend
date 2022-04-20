import { Link, RouteComponentProps } from '@reach/router'
import { map } from 'lodash'
import * as React from 'react'
import styled from 'styled-components/macro'
import { CreateButton, Heading, InputGroup } from '../../components/Elements'
import { hoveredRow } from '../../utils/mixins'
import { PartnerContext } from './Partners'

const PartnerTable: React.FC<RouteComponentProps> = () => {
  const context = React.useContext(PartnerContext)

  const [filterText, setFilterText] = React.useState<string>('')
  const isFound = (...args: string[]) => args.some(s => s.toLowerCase().includes(filterText))
  const filterPartners = () => context.partners.filter(partner => !filterText || isFound(partner.title))

  return (
    <div>
      <TableHeader>
        <PartnerHeading>Partners</PartnerHeading>
        <CreateButton as={Link} to="new">
          + New Partner
        </CreateButton>
      </TableHeader>
      <CustomInputGroup color="white">
        <label>Filter Partners</label>
        <input value={filterText} onChange={e => setFilterText(e.currentTarget.value.toLowerCase())} />
      </CustomInputGroup>
      <div>
        {map(filterPartners(), p => (
          <Wrapper to={p._id as string} key={p._id}>
            <Title>{p.title}</Title>
          </Wrapper>
        ))}
      </div>
    </div>
  )
}

export default PartnerTable

const TableHeader = styled.div`
  padding: 0rem 4rem 3.2rem;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`
const PartnerHeading = styled(Heading)`
  padding: 4rem 0 0;
`
const Wrapper = styled(Link)`
  padding: 2rem;
  position: relative;
  display: block;
  ${hoveredRow()};
  &:nth-child(2n - 1) {
    background: ${props => props.theme.white};
  }
`
const Title = styled.span`
  font-weight: 500;
  color: ${props => props.theme.primaryGrey};
`
const CustomInputGroup = styled(InputGroup)`
  margin: 0 2.4rem 2rem;
`
