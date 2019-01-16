import * as React from 'react'
import { ThemedStyledProps } from 'styled-components/macro'

export interface IHashProps {
  refToFocus: React.RefObject<HTMLElement>
  hash: string
  location: any
}

/**
 * Styles
 */

export interface IHeadingProps
  extends ThemedStyledProps<
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>,
    any
  > {
  center?: boolean
  color?: string
}

export interface IForm {
  currentTarget: {
    elements: {
      [key: string]: HTMLInputElement | HTMLTextAreaElement
    }
  }
}
