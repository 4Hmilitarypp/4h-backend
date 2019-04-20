import { Link } from '@reach/router'
import * as React from 'react'
import styled from 'styled-components/macro'
import UnstyledBackButton from './BackButton'
import { CreateButton, Heading } from './Elements'

interface IProps {
  action: string
  _id?: string
  singular: string
  plural: string
  route: string
}

const FormHeading: React.FC<IProps> = ({ action, _id, singular, plural, route }) => (
  <HeaderWrapper>
    <UnstyledBackButton route={route} title={plural} />
    <CustomHeading>{`${action === 'update' ? `Updating a ${singular}` : `Create a new ${singular}`}`}</CustomHeading>
    <CreateButtonWrapper>
      {_id !== 'new' && (
        <CreateButton as={Link} to={`${route}/new`}>
          New {singular}
        </CreateButton>
      )}
    </CreateButtonWrapper>
  </HeaderWrapper>
)

export default FormHeading

const CustomHeading = styled(Heading)`
  font-size: 2.4rem;
`
const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 3.2rem;
`
const CreateButtonWrapper = styled.div`
  width: 20.2rem;
  display: flex;
  justify-content: flex-end;
  padding-right: 1.6rem;
`
