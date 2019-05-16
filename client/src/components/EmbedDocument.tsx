import * as React from 'react'
import styled from 'styled-components/macro'

interface IProps {
  inPage?: boolean
  open: boolean
  setOpen: any
  title: string
  url: string
}

const EmbedDocument: React.FC<IProps> = ({ inPage = false, open, setOpen, title, url }) => {
  const [iframeInterval, setIframeInterval] = React.useState<number | undefined>(undefined)
  const iframeRef = React.useRef<HTMLIFrameElement | undefined>(undefined)

  React.useEffect(() => {
    if (open) {
      window.addEventListener('keydown', handleKeydown)
      const reloadInterval = window.setInterval(() => {
        if (iframeRef.current) {
          iframeRef.current.src += ''
        }
      }, 2000)
      setIframeInterval(reloadInterval)
    } else {
      window.removeEventListener('keydown', handleKeydown)
    }
    return () => {
      clearInterval(iframeInterval)
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [open])

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  if (open) {
    return inPage ? (
      <InPageWrapper>
        <DocumentCommands>
          <DocumentCloseButton as="a" href={url} download={title} target="_blank">
            Download
          </DocumentCloseButton>
        </DocumentCommands>
        <Doc
          src={`https://docs.google.com/gview?url=${url}&embedded=true`}
          onLoad={() => clearInterval(iframeInterval)}
          ref={iframeRef}
        />
      </InPageWrapper>
    ) : (
      <EmbedWrapper>
        <DocumentCommands>
          <DocumentCloseButton as="a" href={url} download={title}>
            Download
          </DocumentCloseButton>
          <DocumentCloseButton onClick={() => setOpen(false)}>Close</DocumentCloseButton>
        </DocumentCommands>
        <Doc
          src={`https://docs.google.com/gview?url=${url}&embedded=true`}
          onLoad={() => clearInterval(iframeInterval)}
          ref={iframeRef}
        />
      </EmbedWrapper>
    )
  }
  return null
}

export default EmbedDocument

const Doc: any = styled.iframe`
  height: 100%;
  width: 100%;
`
const InPageWrapper = styled.div`
  background: hsl(206, 7%, 21%);
  width: 90%;
  height: 80rem;
  margin: 0 auto;
  padding-bottom: 6.5rem;
`
const EmbedWrapper = styled.div`
  position: fixed;
  z-index: 2000;
  top: 0;
  right: 0;
  height: 100%;
  width: 100%;
  background: hsl(206, 7%, 21%);
`
const DocumentCloseButton: any = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  margin: 0 1.6rem;
  color: ${props => props.theme.white} !important;
  font-weight: 400 !important;
  &:hover {
    opacity: 0.8;
    cursor: pointer;
  }
`
const DocumentCommands = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  padding: 1.6rem 4rem;
`
