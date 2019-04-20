import * as React from 'react'
import { IHashProps } from '../clientTypes'

const useHash = ({ refToFocus, hash, location }: IHashProps) => {
  React.useEffect(() => {
    if (location && location.hash === hash) {
      const node = refToFocus.current
      if (node) {
        node.scrollIntoView()
      }
    }
  })
}
export default useHash
