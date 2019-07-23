import { filter, map } from 'lodash'
import * as React from 'react'
import FlashContext from '../../contexts/FlashContext'
import useErrorHandler from '../../hooks/useErrorHandler'
import { IPartnerSection } from '../../sharedTypes'
import api from '../../utils/api'
import { numericSort } from '../../utils/string'

export type TUpdatePartners = ({
  _id,
  action,
  partner,
}: {
  _id?: string
  action: 'create' | 'update' | 'delete'
  partner?: IPartnerSection
}) => void

const usePartners = () => {
  const [partners, setPartners] = React.useState<IPartnerSection[]>([])
  const handleError = useErrorHandler()
  React.useEffect(() => {
    api.partners
      .get()
      .then(p => setPartners(p))
      .catch(handleError)
  }, [handleError])

  const flashContext = React.useContext(FlashContext)

  const updatePartners: TUpdatePartners = ({ _id, action, partner }) => {
    let newPartners: IPartnerSection[] = []
    if (action === 'update' && partner) {
      newPartners = map(partners, r => (r._id === partner._id ? partner : r))
      flashContext.set({ message: 'Partner Updated Successfully' })
    } else if (action === 'create' && partner) {
      const unsorted = [partner, ...partners]
      newPartners = numericSort(unsorted, 'title')
      flashContext.set({ message: 'Partner Created Successfully' })
    } else if (action === 'delete') {
      newPartners = filter(partners, r => r._id !== _id)
      flashContext.set({ message: 'Partner Deleted Successfully' })
    }
    setPartners(newPartners)
  }
  return { handleError, partners, updatePartners }
}
export default usePartners
