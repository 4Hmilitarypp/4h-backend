import { Router } from '@reach/router'
import * as React from 'react'
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components/macro'
import FlashContext, { useFlash } from './contexts/FlashContext'
import UserContext, { useUser } from './contexts/UserContext'
import Flash from './Flash'
import Header from './Header'
import Camps from './pages/camps/Camps'
import Home from './pages/Home'
import Liaisons from './pages/liaisons/Liaisons'
import NotFound from './pages/NotFound'
import Partners from './pages/partners/Partners'
import Register from './pages/Register'
import Researches from './pages/research/Researches'
import Resources from './pages/resources/Resources'
import Webinars from './pages/webinars/Webinars'
import Sidebar from './Sidebar'

export const theme = {
  lightGrey: 'hsl(150, 20%, 40%)',
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
  const { user, login, logout, register } = useUser()
  return (
    <ThemeProvider theme={theme}>
      <AppContainer data-testid="app">
        <GlobalStyle />
        <UserContext.Provider value={{ user, login, logout, register }}>
          <FlashContext.Provider value={{ ...flashState, reset: resetFlashState, set: setFlashState }}>
            <Flash />
            <HeaderContainer>
              <Header path="/*" />
            </HeaderContainer>
            <SidebarContainer>
              <Sidebar path="/*" />
            </SidebarContainer>
            <Router primary={false}>
              <Home path="/" />
              <Camps path="/camps/*" />
              <Liaisons path="/liaisons" />
              <Partners path="/partners/*" />
              <Register path="/elevated-users" />
              <Researches path="/research" />
              <Resources path="/curriculum-resources/*" />
              <Webinars path="/webinars" />
              <NotFound default={true} />
            </Router>
          </FlashContext.Provider>
        </UserContext.Provider>
      </AppContainer>
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
  .grecaptcha-badge {
    visibility: hidden !important;
    opacity: 0 !important;
  }
`
const AppContainer = styled.div`
  display: grid;
  grid-template-rows: 6.04rem 1fr;
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
