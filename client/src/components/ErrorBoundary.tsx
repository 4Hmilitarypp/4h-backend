import * as Sentry from '@sentry/browser'
import * as React from 'react'
import styled from 'styled-components/macro'
import { Button, Heading, PageWrapper, SubHeading } from './Elements'

class ErrorBoundary extends React.Component<{}, { eventId?: string }> {
  state = { eventId: undefined }

  componentDidCatch(error: any, errorInfo: any) {
    Sentry.withScope(scope => {
      scope.setExtras(errorInfo)
      const eventId = Sentry.captureException(error)
      this.setState({ eventId })
    })
  }

  render() {
    if (this.state.eventId) {
      return (
        <PageWrapper>
          <Heading>Sorry, we encountered an unexpected error.</Heading>
          <SubHeading>
            We are working on getting everything sorted out. Feel free to refresh the page and continue browsing
          </SubHeading>
          <CustomButton onClick={() => Sentry.showReportDialog({ eventId: this.state.eventId })}>
            Report feedback
          </CustomButton>
        </PageWrapper>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary

const CustomButton = styled(Button)`
  margin: 0 auto;
  display: block;
  font-family: Rubik;
`
