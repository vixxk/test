import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MemoriesPage from './pages/MemoriesPage';
import AdminPage from './pages/AdminPage';
import PandalDetailPage from './pages/PandalDetailPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pandal/:id" element={<PandalDetailPage />} />
        <Route path="/experiences/:id" element={<PandalDetailPage />} />
        <Route path="/3d-memories" element={<MemoriesPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
