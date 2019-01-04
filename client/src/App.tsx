import { Router } from '@reach/router'
import * as React from 'react'
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components/macro'
import FlashContext, { useFlash } from './contexts/FlashContext'
import Flash from './Flash'
import Header from './Header'
import Camps from './pages/Camps'
import Home from './pages/Home'
import Liaisons from './pages/liaisons/Liaisons'
import Media from './pages/Media'
import NotFound from './pages/NotFound'
import Partners from './pages/Partners'
import Researches from './pages/research/Researches'
import Resources from './pages/resources/Resources'
import Webinars from './pages/Webinars'
import Sidebar from './Sidebar'

export const theme = {
  lightGrey: 'hsl(150, 20%, 40%)',
  offWhite: 'hsl(150, 40%, 96%)',
  primary: 'hsl(150, 50%, 40%)',
  primaryBackground: 'hsl(150,39%,96%)',
  primaryBlack: 'hsl(150, 20%, 20%)',
  primaryDark: 'hsl(150, 39%, 27%)',
  primaryGrey: 'hsl(150, 6%, 31%)',
  primaryLight: 'hsl(149, 32%, 85%)',
  primaryLink: 'hsl(150, 80%, 28%)',
  secondary: 'hsl(266, 55%, 35%)',
  secondaryBackground: 'hsl(268, 48%, 95%)',
  secondaryBlack: 'hsl(266, 20%, 20%)',
  secondaryGrey: 'hsl(266, 6%, 31%)',
  secondaryLight: 'hsl(266, 32%, 85%)',
  secondaryMiddle: 'hsl(266, 33%, 55%)',
  success: 'hsl(154, 90%, 41%)',
  warning: 'hsl(0, 100%, 37%)',
  white: 'hsl(0, 0%, 100%)',
}

const App: React.FC<{}> = () => {
  const { flashState, resetFlashState, setFlashState } = useFlash()
  return (
    <ThemeProvider theme={theme}>
      <AppWContainer data-testid="app">
        <GlobalStyle />
        <HeaderContainer>
          <Header path="/*" />
        </HeaderContainer>
        <SidebarContainer>
          <Sidebar path="/*" />
        </SidebarContainer>
        <FlashContext.Provider value={{ ...flashState, reset: resetFlashState, set: setFlashState }}>
          <Flash />
          <Router primary={false}>
            <Home path="/" />
            <Liaisons path="/liaisons" />
            <Partners path="/partners" />
            <Camps path="/camps" />
            <Webinars path="/webinars" />
            <Researches path="/research" />
            <Resources path="/curriculum-resources/*" />
            <Media path="/media" />
            <NotFound default={true} />
          </Router>
        </FlashContext.Provider>
      </AppWContainer>
    </ThemeProvider>
  )
}

export default App

const GlobalStyle = createGlobalStyle`
  body {
  background: ${theme.primaryBackground};
  font-family: Rubik, arial, sans-serif;
  }
  input,
  textarea, button {
    font-family: Rubik, arial, sans-serif;
  }
`
const AppWContainer = styled.div`
  display: grid;
  grid-template-rows: 6.4rem 1fr;
  grid-template-columns: 24rem 1fr;
  height: 100%;
  width: 100%;
  color: ${props => props.theme.black};
`
const HeaderContainer = styled(Router)`
  grid-column: 1 / -1;
  grid-row: 1 / 1;
`
const SidebarContainer = styled(Router)`
  grid-column: 1 / 1;
  grid-row: 2 / -1;
`
