import './App.css';
import React from 'react';
import { AddAuthors } from './components/ViewLibrary/Authors/AddAuthors';
import { AddBooks } from './components/ViewLibrary/Books/AddBooks';
import { HomeScreen } from './components/HomeScreen';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ViewLibrary } from './components/ViewLibrary/ViewLibrary';
import { GlobalLibraryPage } from './components/ViewLibrary/LibraryFromSecondAPI/GlobalLibraryPage';


function App() {
  const [authUser, setAuthUser] = React.useState(null);

 

 function handleAdminLogin(user) {
    setAuthUser(user);
  }
  function handleAdminLogout() {
    setAuthUser(null);
     localStorage.removeItem("accessToken");
  }

  
  const isAdmin = authUser?.role?.toLowerCase() === 'admin';

  const ProtectedRoute = ({ allowAdminOnly = false, children }) => {
    if (!authUser) {
      return <Navigate to="/" replace />;
    }
    if (allowAdminOnly && !isAdmin) {
      return <Navigate to="/view-library" replace />;
    }
    return children;
  };
  


  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <HomeScreen
                authUser={authUser}
                onAuthSuccess={handleAdminLogin}
                onLogout={handleAdminLogout}
              />
            }
          />
          <Route
            path="/add-authors"
            element={
              <ProtectedRoute allowAdminOnly>
                <AddAuthors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-books"
            element={
              <ProtectedRoute allowAdminOnly>
                <AddBooks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/view-library"
            element={
              <ProtectedRoute>
                <ViewLibrary authUser={authUser} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/global-library"
            element={
              <ProtectedRoute allowAdminOnly>
                <GlobalLibraryPage authUser={authUser} />
              </ProtectedRoute>
            }
          />
         
        </Routes>
      </div>
    </Router>
  );
}

export default App;
