import { RouteComponentProps } from '@reach/router'
import * as React from 'react'
import styled from 'styled-components/macro'
import { Heading } from '../../components/Elements'
import { ILiaison } from '../../sharedTypes'
import api from '../../utils/api'
import Liaison from './Liaison'

interface ILiaisonsContext {
  liaisons: ILiaison[] | undefined
  updateLiaisons: (l: ILiaison) => void
}
export const LiaisonsContext = React.createContext<ILiaisonsContext>(undefined as any)

const Liaisons: React.FC<RouteComponentProps> = () => {
  const [liaisons, setLiaisons] = React.useState<ILiaison[] | undefined>(undefined)

  const updateLiaisons = (liaison: ILiaison) => {
    if (liaisons) {
      const newLiaisons = liaisons.map(l => (l.liaisonId === liaison.liaisonId ? liaison : l))
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
      <LiaisonsContext.Provider value={{ liaisons, updateLiaisons }}>
        <LiaisonHeading>Liaisons</LiaisonHeading>
        {liaisons && (
          <ul>
            {liaisons.map(l => (
              <Liaison key={l.region} liaison={l} />
            ))}
          </ul>
        )}
      </LiaisonsContext.Provider>
    </LiaisonsContainer>
  )
}
export default Liaisons

const LiaisonsContainer = styled.div``
const LiaisonHeading = styled(Heading)`
  padding-left: 4rem;
  padding-bottom: 4rem;
`
