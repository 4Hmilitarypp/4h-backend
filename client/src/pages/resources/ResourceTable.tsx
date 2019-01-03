import { Link, RouteComponentProps } from '@reach/router'
import { map } from 'lodash'
import * as React from 'react'
import styled from 'styled-components/macro'
import { Button, Heading } from '../../components/Elements'
import { hoveredRow } from '../../utils/mixins'
import { ResourceContext } from './Resources'

const ResourceTable: React.FC<RouteComponentProps> = () => {
  const context = React.useContext(ResourceContext)
  return (
    <div>
      <TableHeader>
        <ResourceHeading>Resources</ResourceHeading>
        <Button as={Link} to="new">
          + Create a new Resource
        </Button>
      </TableHeader>
      <div>
        {map(context.resources, r => (
          <Wrapper to={r._id} key={r._id}>
            <Title>{r.title}</Title>
          </Wrapper>
        ))}
      </div>
    </div>
  )
}

export default ResourceTable

const TableHeader = styled.div`
  padding: 0rem 4rem 1.6rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`
const ResourceHeading = styled(Heading)`
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
