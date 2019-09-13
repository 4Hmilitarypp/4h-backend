import { map } from 'lodash'
import * as React from 'react'
import styled from 'styled-components/macro'
import { SubHeading } from '../../../components/Elements'
import { IApiError } from '../../../sharedTypes'
import Comment from './Comment'
import CommentModal from './CommentModal'
import useComments from './useComments'

interface IProps {
  applicationId: string
  handleError: (err: IApiError) => void
}

const Comments: React.FC<IProps> = ({ applicationId, handleError }) => {
  const { modalController, comments } = useComments(handleError, applicationId)
  return (
    <Wrapper>
      <CustomSubHeading>Comments</CustomSubHeading>
      <TableHeader>
        <div />
        <CreateButton onClick={() => modalController.set({ action: 'create', applicationId })}>
          + New Comment
        </CreateButton>
      </TableHeader>
      <div>
        {map(comments, r => {
          return <Comment comment={r} key={r._id} applicationId={applicationId} setModalState={modalController.set} />
        })}
      </div>
      <CommentModal controller={modalController} />
      <BottomPadding />
    </Wrapper>
  )
}

export default Comments
const Wrapper = styled.div`
  margin-top: 3.2rem;
  /* background: ${props => props.theme.primaryLight}; */
`
const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 2rem 3.2rem;
`
const CustomSubHeading = styled(SubHeading)`
  padding-bottom: 1.2rem;
  padding-bottom: 0rem;
`
const CreateButton = styled.button`
  background: ${props => props.theme.white};
  border: none;
  color: ${props => props.theme.primaryLink};
  font-weight: 500;
  padding: 0.8rem 1.2rem;
  border-radius: 20px;
  font-size: 1.6rem;
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
