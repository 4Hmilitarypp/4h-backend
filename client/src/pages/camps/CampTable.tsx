import { Link, RouteComponentProps } from '@reach/router'
import { map } from 'lodash'
import * as React from 'react'
import styled from 'styled-components/macro'
import { CreateButton, Heading } from '../../components/Elements'
import { hoveredRow } from '../../utils/mixins'
import { CampContext } from './Camps'

const CampTable: React.FC<RouteComponentProps> = () => {
  const context = React.useContext(CampContext)
  const sortedCamps = context.camps.sort((a, b) => (a.state > b.state ? 1 : -1))
  return (
    <div>
      <TableHeader>
        <CampHeading>Camps</CampHeading>
        <CreateButton as={Link} to="new">
          + New Camp
        </CreateButton>
      </TableHeader>
      <div>
        {map(sortedCamps, p => (
          <Wrapper to={p._id} key={p._id}>
            <CityAndState>{`${p.city}, ${p.state}:`}</CityAndState>
            <Title>{p.title}</Title>
          </Wrapper>
        ))}
      </div>
    </div>
  )
}

export default CampTable

const TableHeader = styled.div`
  padding: 0rem 4rem 3.2rem;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`
const CampHeading = styled(Heading)`
  padding: 4rem 0 0;
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
const Title = styled.span`
  font-weight: 500;
  color: ${props => props.theme.primaryGrey};
`
