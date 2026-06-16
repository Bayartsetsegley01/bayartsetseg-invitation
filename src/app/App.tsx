import React from 'react';
import { RouterProvider } from 'react-router';
import { createBrowserRouter } from 'react-router';
import { Home } from './Home';
import { Admin } from './Admin';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';

const Root = () => (
  <ThemeProvider>
    <LanguageProvider>
      <Home />
    </LanguageProvider>
  </ThemeProvider>
);

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
  },
  {
    path: '/admin',
    Component: Admin,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
