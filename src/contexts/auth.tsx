import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the AuthContext type
interface AuthContextType {
  token: string | "";
  setToken: (value: string | "") => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  role: string | null;
  setRole: (value: string | null) => void;
  userEmail: string | null;
  setUserEmail: (value: string | null) => void;
}

// Create context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        isAuthenticated,
        setIsAuthenticated,
        role,
        setRole,
        userEmail,
        setUserEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext safely
const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
