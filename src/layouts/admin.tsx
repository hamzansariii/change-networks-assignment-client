import { ReactNode } from "react";
import Header from "../components/header";
import "../styles/Layout.css"; // External CSS

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">{children}</main>
    </div>
  );
};

export default AdminLayout;
