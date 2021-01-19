import { AppContext } from './libs/contextLib';
import React, { useState, useEffect } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import './App.css';
import Routes from './Routes';
import { LinkContainer } from 'react-router-bootstrap';
import { Auth } from 'aws-amplify';
import { useHistory } from 'react-router-dom';


function App() {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const history = useHistory();

  useEffect(()=>{
    onLoad();
    console.log(onLoad);
    console.log(onLoad());
  },[]);

  async function onLoad(){
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    }
    catch(e){
      if(e !== 'No current user'){
        alert(e);
      }
    }
    setIsAuthenticating(false);
  }

  async function handleLogout() {
    await Auth.signOut();
    console.log(Auth.signOut());
    userHasAuthenticated(false);
    history.push("/login");
  }

  return (
    !isAuthenticating && (
    <div className="App container py-3">
      <Navbar collapseOnSelect bg="light" expand="md" className="mb-3" >
        <Navbar.Brand className="font-weigh-bold text-muted" >
          Notes
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav activeKey={window.location.pathname}>
            {isAuthenticated ? (
              <Nav.Link onClick={handleLogout} >Logout</Nav.Link>
            ) : (
              <>
              <LinkContainer to="/signup">
              <Nav.Link href="/signup">Signup</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/login">
              <Nav.Link href="/login">Login</Nav.Link>
              </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }} >
      <Routes /> 
      </AppContext.Provider>
    </div>
    )
  );
}

export default App;
