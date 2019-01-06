import { RouteComponentProps } from '@reach/router'
import { filter, map } from 'lodash'
import * as React from 'react'
import styled from 'styled-components/macro'
import { Button, Heading } from '../../components/Elements'
import FlashContext from '../../contexts/FlashContext'
import useErrorHandler from '../../hooks/useErrorHandler'
import { IWebinar } from '../../sharedTypes'
import api from '../../utils/api'
import Webinar from './Webinar'
import WebinarModal from './WebinarModal'

interface IWebinarsContext {
  webinars: IWebinar[] | undefined
  updateWebinars: (
    args: {
      _id?: string
      action: 'create' | 'update' | 'delete'
      webinar?: IWebinar
    }
  ) => void
}
export const WebinarsContext = React.createContext<IWebinarsContext>(undefined as any)

const Webinars: React.FC<RouteComponentProps> = () => {
  const [webinars, setWebinars] = React.useState<IWebinar[] | undefined>(undefined)
  const [modalOpen, setModalOpen] = React.useState(false)

  const flashContext = React.useContext(FlashContext)
  const { handleError } = useErrorHandler()

  const updateWebinars = ({
    _id,
    action,
    webinar,
  }: {
    _id?: string
    action: 'create' | 'update' | 'delete'
    webinar?: IWebinar
  }) => {
    if (webinars) {
      let newWebinars: IWebinar[] = []
      if (action === 'update' && webinar) {
        newWebinars = map(webinars, l => (l._id === webinar._id ? webinar : l))
        flashContext.set({ message: 'Webinar Updated Successfully' })
      } else if (action === 'create' && webinar) {
        newWebinars = [webinar, ...webinars]
        flashContext.set({ message: 'Webinar Created Successfully' })
      } else if (action === 'delete') {
        newWebinars = filter(webinars, l => l._id !== _id)
        flashContext.set({ message: 'Webinar Deleted Successfully' })
      }
      setWebinars(newWebinars)
    }
  }

  React.useEffect(() => {
    api.webinars
      .get()
      .then(l => setWebinars(l))
      .catch(handleError)
  }, [])

  return (
    <WebinarsContainer>
      <WebinarsContext.Provider value={{ webinars, updateWebinars }}>
        <TableHeader>
          <WebinarHeading>Webinars</WebinarHeading>
          <Button onClick={() => setModalOpen(true)}>+ Create a new Webinar</Button>
        </TableHeader>
        {webinars && (
          <ul>
            {map(webinars, w => (
              <Webinar key={w.title} webinar={w} />
            ))}
          </ul>
        )}
        <WebinarModal open={modalOpen} setOpen={setModalOpen} action="create" />
      </WebinarsContext.Provider>
    </WebinarsContainer>
  )
}
export default Webinars

const WebinarsContainer = styled.div``
const TableHeader = styled.div`
  padding: 0rem 4rem 1.6rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`
const WebinarHeading = styled(Heading)`
  padding: 4rem 0 0;
`
