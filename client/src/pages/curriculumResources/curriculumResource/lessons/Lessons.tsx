import { Link, RouteComponentProps } from '@reach/router'
import { map } from 'lodash'
import * as React from 'react'
import styled from 'styled-components/macro'
import { Button, Heading } from '../../../components/Elements'
import { ILesson } from '../../../sharedTypes'
import { hoveredRow } from '../../../utils/mixins'
import { CurriculumResourceContext } from '../CurriculumResources'

const Lessons: React.FC<IProps> = RouteComponentProps => {
  const context = React.useContext(CurriculumResourceContext)
  return (
    <div>
      <TableHeader>
        <CurriculumResourceHeading>Curriculum Resources</CurriculumResourceHeading>
        <Button as={Link} to="new">
          + Create a new CurriculumResource
        </Button>
      </TableHeader>
      <ul>
        {map(context.curriculumResources, r => (
          <Wrapper to={r._id} key={r._id}>
            <Title>{r.title}</Title>
          </Wrapper>
        ))}
      </ul>
    </div>
  )
}

{
  /* <Lessons>
        {lessons.map(l => (
          <div key={l.title} onClick={() => setClickedLesson(l)}>
            {l.title}
          </div>
        ))}
      </Lessons> */
}
;<SubHeading>Lesson Form</SubHeading>

export default Lessons

const TableHeader = styled.div`
  padding: 0rem 4rem 1.6rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`
const CurriculumResourceHeading = styled(Heading)`
  padding: 4rem 0 0;
`
const Wrapper = styled(Link)`
  padding: 2rem;
  position: relative;
  ${hoveredRow()};
  &:nth-child(2n - 1) {
    background: ${props => props.theme.white};
  }
`
const Title = styled.span`
  font-weight: 500;
`
