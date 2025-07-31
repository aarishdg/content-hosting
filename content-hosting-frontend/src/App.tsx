import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './pages/public/HomePage';
import ArticlesPage from './pages/public/ArticlesPage';
import PodcastsPage from './pages/public/PodcastsPage';
import ContentDetailPage from './pages/public/ContentDetailPage';
import LoginForm from './components/forms/LoginForm';
import RegisterForm from './components/forms/RegisterForm';
import DashboardPage from './pages/contributor/DashboardPage';
import CreateContentPage from './pages/contributor/CreateContentPage';
import EditContentPage from './pages/contributor/EditContentPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/content/:id" element={<ContentDetailPage />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/podcasts" element={<PodcastsPage />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={
                <div className="min-h-screen bg-gray-50 py-12">
                  <LoginForm />
                </div>
              } />
              <Route path="/register" element={
                <div className="min-h-screen bg-gray-50 py-12">
                  <RegisterForm />
                </div>
              } />
              
              {/* Contributor Routes */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/create" element={<CreateContentPage />} />
              <Route path="/dashboard/edit/:id" element={<EditContentPage />} />
              
              {/* 404 Page */}
              <Route path="*" element={
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-gray-600 mb-6">Page not found</p>
                    <a href="/" className="btn-primary">
                      Go Home
                    </a>
                  </div>
                </div>
              } />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
