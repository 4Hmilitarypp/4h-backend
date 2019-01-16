import * as React from 'react'
import styled from 'styled-components/macro'
import { Button, Heading } from '../Elements'
import { IModalController } from './useTable'

interface IProps {
  itemTitle: string
  modalController: IModalController<any>
}

const Table: React.FC<IProps> = ({ itemTitle, modalController, children }) => {
  return (
    <TableContainer>
      <TableHeader>
        <TableHeading>{itemTitle}</TableHeading>
        <Button onClick={() => modalController.set({ action: 'create' })}>+ Create a new {itemTitle}</Button>
      </TableHeader>
      {children}
    </TableContainer>
  )
}
export default Table

const TableContainer = styled.div``
const TableHeader = styled.div`
  padding: 0rem 4rem 1.6rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`
const TableHeading = styled(Heading)`
  padding: 4rem 0 0;
`
