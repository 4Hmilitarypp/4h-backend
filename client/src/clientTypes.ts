import * as React from 'react'

export interface IHashProps {
  refToFocus: React.RefObject<HTMLElement>
  hash: string
  location: any
}

export interface IForm {
  currentTarget: {
    elements: {
      [key: string]: HTMLInputElement | HTMLTextAreaElement
    }
  }
}
