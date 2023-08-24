import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/Home'
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar/Navbar';
import Login from './pages/Login';
import { Container } from "react-bootstrap";
import { MantineProvider } from '@mantine/core';


function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Router>
        <Navbar />
        <Container className='d-flex flex-wrap'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route element={<NotFound />} />
          </Routes>
        </Container>
      </Router >
    </MantineProvider>
  );
}

export default App;