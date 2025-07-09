import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AppLayout from "./AppLayout";
import Dashboard from "./pages/Dashboard";
import Recommendations from "./pages/Recommendations";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import AuthPage from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import EnterpriseApp from "./components/EnterpriseApp";
import { getEnterpriseConfig } from "./config/enterprise";
import ProfilePage from './pages/Profile';
import ChannelDetailDemo from './components/channel-detail/ChannelDetailDemo';

const App = () => {
  const config = getEnterpriseConfig();

  // Register Service Worker
  useEffect(() => {
    if (config.caching.enableServiceWorker && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, [config.caching.enableServiceWorker]);

  return (
    <EnterpriseApp pageName="app" pageTitle="Digital Marketing Hub">
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <div className="App">
          
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="recommendations" element={<Recommendations />} />
                <Route path="reports" element={<Reports />} />
                <Route path="settings" element={<Settings />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>
            </Route>
            <Route path="/demo" element={<ChannelDetailDemo />} />
          </Routes>
        </div>
      </Router>
    </EnterpriseApp>
  );
};

export default App; 