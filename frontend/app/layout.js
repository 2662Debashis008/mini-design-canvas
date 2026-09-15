import './globals.css';
import { AuthProvider } from '../context/AuthContext';

export const metadata = {
  title: 'Mini Design Canvas - Glazia',
  description: 'Interactive graphic design editor built with Next.js, React Konva, Express, and MongoDB'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="app-container">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
