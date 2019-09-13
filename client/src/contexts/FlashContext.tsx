import * as React from 'react'

export interface ISetFlashStateArgs {
  message: string
  isError?: boolean
}

export interface IFlashContext {
  message: string
  isError: boolean
  set: (args: ISetFlashStateArgs) => void
  reset: () => void
}

const FlashContext = React.createContext<IFlashContext>(undefined as any)

export const useFlash = () => {
  const initialState = { message: '', isError: false }
  const [flashState, setFlashState] = React.useState<{ message: string; isError: boolean }>(initialState)
  const mySetFlashState = ({ message, isError = false }: ISetFlashStateArgs) => setFlashState({ message, isError })
  const resetFlashState = React.useCallback(() => setFlashState(initialState), [initialState])

  React.useEffect(() => {
    if (flashState.message && !flashState.isError) {
      const timeout = setTimeout(() => {
        resetFlashState()
      }, 2500)
      return () => {
        clearTimeout(timeout)
      }
    }
    return undefined
  }, [flashState.isError, flashState.message]) // eslint-disable-line

  return { flashState, setFlashState: mySetFlashState, resetFlashState }
}

export default FlashContext
