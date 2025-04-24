import './assets/main.css'

import ReactDOM from 'react-dom/client'
import { ThemeProvider } from './components/theme-provider'
import Router from './Router'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  </ThemeProvider>
)
