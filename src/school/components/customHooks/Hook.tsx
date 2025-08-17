import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

interface UserPermissions {
  [key: string]: { [key: string]: boolean };
}

interface DecodedToken {
  sub: string;
  permission: string; // String format, needs parsing
  role?: string; // Role dynamic hona chahiye
  iat: number;
  exp: number;
}

interface User {
  email: string;
  role: string;
  permission: {
    permissions: UserPermissions;
  };
}

const useUser = (): User | null => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = () => {
      const userData = localStorage.getItem("user");
      if (!userData) {
        setUser(null);
        return;
      }

      try {
        const parsedData = JSON.parse(userData);
        if (!parsedData.token) {
          setUser(null);
          return;
        }

        const decodedToken: DecodedToken = jwtDecode(parsedData.token);

        // ✅ Token Expiry Check
        if (decodedToken.exp * 1000 < Date.now()) {
          console.warn("Token expired, logging out...");
          localStorage.removeItem("user");
          setUser(null);
          return;
        }

        // ✅ Safe Permission Parsing
        let parsedPermissions: UserPermissions = {};
        try {
          parsedPermissions = JSON.parse(decodedToken.permission);
        } catch (err) {
          console.error("Error parsing permissions:", err);
        }

        const finalUser: User = {
          email: decodedToken.sub,
          role: parsedData.role || "null",  
          permission: {
            permissions: parsedPermissions,
          },
        };
        

        setUser(finalUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser(null);
      }
    };

    fetchUserData();

    // ✅ LocalStorage Update Listener
    const handleStorageChange = () => fetchUserData();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return user;
};

export default useUser;
