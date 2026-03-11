import { Navigate, Route, Routes } from 'react-router-dom';
import PostsPage from './pages/PostsPage';
import NewPostPage from './pages/NewPostPage';
import EditPostPage from './pages/EditPostPage';

function App() {
  return (
    <Routes>
      <Route path="/posts" element={<PostsPage />} />
      <Route path="/posts/new" element={<NewPostPage />} />
      <Route path="/posts/:id/edit" element={<EditPostPage />} />
      <Route path="/" element={<Navigate to="/posts" replace />} />
      <Route path="*" element={<Navigate to="/posts" replace />} />
    </Routes>
  );
}

export default App;
