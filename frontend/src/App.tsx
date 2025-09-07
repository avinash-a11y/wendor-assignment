import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BookingPage } from './components/BookingPage';
import { ReviewPage } from './components/ReviewPage';
import { MyBookingsPage } from './components/MyBookingsPage';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { BecomeProviderPage } from './components/BecomeProviderPage';
import { NotificationProvider } from './components/NotificationProvider';
import { AuthProvider } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import { Footer } from './components/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingProvider } from './components/LoadingProvider';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NotificationProvider>
            <LoadingProvider>
              <Router>
                <div className="min-h-screen bg-gray-50 flex flex-col">
                  <Navigation />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<BookingPage />} />
                      <Route path="/booking" element={<BookingPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/signup" element={<SignupPage />} />
                      <Route path="/my-bookings" element={<MyBookingsPage />} />
                      <Route path="/become-provider" element={<BecomeProviderPage />} />
                      <Route path="/review/:bookingId" element={<ReviewPage />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </Router>
            </LoadingProvider>
          </NotificationProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-gray-600 mb-8">Page not found</p>
        <a
          href="/"
          className="btn btn-primary btn-md"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}

export default App;
