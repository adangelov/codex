import { Route, Routes } from 'react-router-dom';

import CourseDetailsPage from './pages/CourseDetailsPage';
import HomePage from './pages/HomePage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/courses/category-b" element={<CourseDetailsPage />} />
    </Routes>
  );
}
