import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import { NotesProvider } from './context/NotesContext.jsx';
import { AppContextProvider } from './context/AppContext.jsx';
import { FileProvider } from './context/FileContext.jsx';

createRoot(document.getElementById('root')).render(
  <Router>
    {/* ✅ ADDED: Opening fragment to group elements */}
    <>
      <ToastContainer
        position="bottom-right"
        theme="dark"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <AppContextProvider>
        <NotesProvider>
          <FileProvider>
            <App />
          </FileProvider>
        </NotesProvider>
      </AppContextProvider>
    </>
    {/* ✅ ADDED: Closing fragment */}
  </Router>
)