import { Toaster } from "react-hot-toast";

import "../src/globals.css"; // Assuming Tailwind CSS is set up here
import Header from "../src/components/layout/Header";
import Footer from "../src/components/layout/Footer";
import { useCartStore } from "../src/store/cart";

export const metadata = {
  title: "ArrowTech",
  description: "Premium technology for a premium lifestyle",
};

export default function RootLayout({ children }) {
  // Reset cart on initial load to ensure clean state (optional, for debugging)
  // useEffect(() => {
  //   resetCart();
  // }, [resetCart]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white font-sans">
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow pt-20">{children}</main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#1e293b",
                color: "#ffffff",
                border: "1px solid #d4af37",
              },
              success: {
                iconTheme: {
                  primary: "#d4af37",
                  secondary: "#1e293b",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#ffffff",
                },
              },
            }}
          />
        </div>
      </body>
    </html>
  );
}
