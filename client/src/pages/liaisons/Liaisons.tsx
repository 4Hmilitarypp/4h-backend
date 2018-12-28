import { RouteComponentProps } from '@reach/router'
import { filter, map } from 'lodash'
import * as React from 'react'
import styled from 'styled-components/macro'
import { Button, Heading } from '../../components/Elements'
import Flash from '../../components/Flash'
import { useFlash } from '../../hooks/hooks'
import { ILiaison } from '../../sharedTypes'
import api from '../../utils/api'
import Liaison from './Liaison'
import LiaisonModal from './LiaisonModal'

interface ILiaisonsContext {
  liaisons: ILiaison[] | undefined
  updateLiaisons: (
    args: {
      _id?: string
      action: 'create' | 'update' | 'delete'
      liaison?: ILiaison
    }
  ) => void
}
export const LiaisonsContext = React.createContext<ILiaisonsContext>(undefined as any)

const Liaisons: React.FC<RouteComponentProps> = () => {
  const [liaisons, setLiaisons] = React.useState<ILiaison[] | undefined>(undefined)
  const [modalOpen, setModalOpen] = React.useState(false)
  const { submitted, setSubmitted, successMessage, setSuccessMessage } = useFlash({ initialSubmitted: false })

  const updateLiaisons = ({
    _id,
    action,
    liaison,
  }: {
    _id?: string
    action: 'create' | 'update' | 'delete'
    liaison?: ILiaison
  }) => {
    if (liaisons) {
      let newLiaisons: ILiaison[] = []
      if (action === 'update' && liaison) {
        newLiaisons = map(liaisons, l => (l._id === liaison._id ? liaison : l))
        setSuccessMessage('Liaison Updated Successfully')
        setSubmitted(true)
      } else if (action === 'create' && liaison) {
        newLiaisons = [liaison, ...liaisons]
        setSuccessMessage('Liaison Created Successfully')
        setSubmitted(true)
      } else if (action === 'delete') {
        newLiaisons = filter(liaisons, l => l._id !== _id)
        setSuccessMessage('Liaison Deleted Successfully')
        setSubmitted(true)
      }
      setLiaisons(newLiaisons)
    }
  }

  React.useEffect(() => {
    api.liaisons
      .get()
      .then(l => setLiaisons(l))
      .catch(err => console.error(err))
  }, [])

  return (
    <LiaisonsContainer>
      <Flash successMessage={successMessage} submitted={submitted} closeClicked={() => setSubmitted(false)} />
      <LiaisonsContext.Provider value={{ liaisons, updateLiaisons }}>
        <TableHeader>
          <LiaisonHeading>Liaisons</LiaisonHeading>
          <Button onClick={() => setModalOpen(true)}>+ Create a new Liaison</Button>
        </TableHeader>
        {liaisons && (
          <ul>
            {map(liaisons, l => (
              <Liaison key={l.region} liaison={l} />
            ))}
          </ul>
        )}
        <LiaisonModal open={modalOpen} setOpen={setModalOpen} action="create" />
      </LiaisonsContext.Provider>
    </LiaisonsContainer>
  )
}
export default Liaisons

const LiaisonsContainer = styled.div``
const TableHeader = styled.div`
  padding: 0rem 4rem 1.6rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`
const LiaisonHeading = styled(Heading)`
  padding: 4rem 0 0;
`
