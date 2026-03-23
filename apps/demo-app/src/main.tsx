import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Renderer } from '@agent-k/core';
import { UserCard } from './components/UserCard';
import { initMockData } from './mockData';
import homePageSpec from './pages/home.json';

// Initialize App
async function bootstrap() {
  await initMockData();
  
  const root = ReactDOM.createRoot(document.getElementById('root')!);
  
  const App = () => {
    // In a real app, page spec might verify dynamic, but here it's static
    const [page] = useState(homePageSpec);

    // Context for navigation/global state
    const context = {
      routeParams: {},
      global: {},
      state: {},
      navigate: (path: string) => console.log('Navigate to', path)
    };

    return (
      <Renderer 
        page={page} 
        components={{ UserCard }} 
        context={context} 
      />
    );
  };

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

bootstrap();
