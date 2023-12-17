import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react'
import { Login } from './components/login';
import { Ini } from './components/ini';
import { Lists } from './components/lists';
import { Seeresults } from './components/seeresults';
import { Results } from './components/results';
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Admin } from "./components/admin";

function App() {
  const [user, setUser] = useState(null)
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route element={<ProtectedRoute isAllowed={!!user} />} >
          <Route path="/ini" element={<Ini />} />
          <Route path="/lists" element={<Lists user={user} />} />
          <Route path="/results" element={<Results />} />
          <Route path="/admin" element={
            <ProtectedRoute isAllowed={!!user && user.permission}>
              <Admin setUser={setUser}/>
            </ProtectedRoute>
          } />
          <Route path="/seeresults" element={<Seeresults setUser={setUser} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
