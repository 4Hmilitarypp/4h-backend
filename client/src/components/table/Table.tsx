import * as React from 'react'
import styled from 'styled-components/macro'
import { CreateButton, Heading } from '../Elements'
import { IModalController } from './useTable'

interface IProps {
  itemTitle: string
  itemTitlePlural: string
  modalController: IModalController<any>
}

const Table: React.FC<IProps> = ({ itemTitle, itemTitlePlural, modalController, children }) => {
  return (
    <TableContainer>
      <TableHeader>
        <TableHeading>{itemTitlePlural}</TableHeading>
        <CreateButton onClick={() => modalController.set({ action: 'create' })}>
          + Create a new {itemTitle}
        </CreateButton>
      </TableHeader>
      {children}
    </TableContainer>
  )
}
export default Table

const TableContainer = styled.div``
const TableHeader = styled.div`
  padding: 0rem 4rem 3.2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`
const TableHeading = styled(Heading)`
  padding: 4rem 0 0;
`
