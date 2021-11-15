import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import OtherPage from './otherPage';
import Fib from './fib';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {/* <p>
            Edit <code>src/App.js</code> and save to reload.
          </p> */}
          <Link to="/">Home</Link>
          <Link to="/other-page">Other Page</Link>
          <Routes>
            <Route exact path="/" element={<Fib />} />
            <Route path="/other-page" element={<OtherPage />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
