import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { Root } from '@/app/Root'
import './index.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element #root was not found in index.html')
}

createRoot(rootElement).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
