// @ts-ignore
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
// @ts-ignore
import { CKEditor } from '@ckeditor/ckeditor5-react'
import React from 'react'
import styled from 'styled-components/macro'

interface IEditorProps {
  handleChange: (data: string) => void
  initialData?: string
  className?: string
}

const Editor: React.FC<IEditorProps> = ({ handleChange, initialData, className }) => {
  const internalHandleChange = (_: any, editor: any) => {
    handleChange(editor.getData())
  }

  ClassicEditor.defaultConfig = {
    toolbar: [
      'heading',
      '|',
      'bold',
      'italic',
      'link',
      'numberedList',
      'bulletedList',
      'blockQuote',
      'insertTable',
      'undo',
      'redo',
    ],
  }

  return (
    <EditorWrapper>
      <CKEditor className={className} editor={ClassicEditor} data={initialData} onChange={internalHandleChange} />
    </EditorWrapper>
  )
}

export default Editor

const EditorWrapper = styled.div`
  a {
    font-weight: 500;
    color: ${props => props.theme.primaryLink};
    &:hover {
      opacity: 0.8;
      cursor: pointer;
    }
  }
  p {
    padding-bottom: 1.5rem;
    &:last-child {
      padding-bottom: 0;
    }
  }
  ul {
    list-style: initial;
    padding-left: 4rem;
  }
  .ck-editor__editable {
    max-height: 80vh;
  }
`
