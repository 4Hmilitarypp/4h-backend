import { Link, RouteComponentProps } from '@reach/router'
import { map } from 'lodash'
import * as React from 'react'
import styled from 'styled-components/macro'
import { Heading } from '../../components/Elements'
import { hoveredRow } from '../../utils/mixins'
import { ResourceContext } from './Resources'

const ResourceTable: React.FC<RouteComponentProps> = () => {
  const context = React.useContext(ResourceContext)
  return (
    <div>
      <TableHeader>
        <ResourceHeading>Resources</ResourceHeading>
        <CreateButton as={Link} to="new">
          + New Resource
        </CreateButton>
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
  padding: 0rem 4rem 3.2rem;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
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
const CreateButton: any = styled.button`
  background: ${props => props.theme.primary};
  border: none;
  color: ${props => props.theme.white};
  font-weight: 500;
  padding: 0.4rem 1.2rem;
  border-radius: 20px;
  font-size: 1.4rem;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`
