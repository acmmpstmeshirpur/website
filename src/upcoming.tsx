import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './styles/base';
import UpcomingApp from './UpcomingApp';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UpcomingApp />
  </StrictMode>,
);
