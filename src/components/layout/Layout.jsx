import { Toaster } from 'react-hot-toast'
import Header from './Header'
import Footer from './Footer'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-primary text-white">
      <Header />
      <main className="pt-16">
        {children}
      </main>
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#2A2A2A',
            color: '#FFFFFF',
            border: '1px solid #C4A484',
          },
          success: {
            iconTheme: {
              primary: '#C4A484',
              secondary: '#000000',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
    </div>
  )
}

export default Layout