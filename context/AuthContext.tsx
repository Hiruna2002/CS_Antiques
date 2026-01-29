// import { useLoader } from "@/hooks/useLoader"
// import { auth } from "@/services/firebase"
// import { onAuthStateChanged, User } from "firebase/auth"
// import { createContext, ReactNode, useEffect, useState } from "react"

// interface AuthContextType {
//   user: User | null
//   loading: boolean
//   setUser: (user: User | null) => void
// }

// export const AuthContext = createContext<AuthContextType>({
//   user: null,
//   loading: false,
//   setUser: () => {}
// })

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const { showLoader, hideLoader } = useLoader()
//   const [user, setUser] = useState<User | null>(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     showLoader()
//     const unsubscribe = onAuthStateChanged(auth, (usr) => {
//       setUser(usr)
//       setLoading(false)
//       hideLoader()
//     })

//     // cleanup function (component unmount)
//     return () => unsubscribe()
//   }, [])

//   return (
//     <AuthContext.Provider value={{ user, loading, setUser }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

import { useLoader } from "@/hooks/useLoader";
import { getAuthInstance } from "@/services/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import { createContext, ReactNode, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  setUser: () => {}
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { showLoader, hideLoader } = useLoader();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub: (() => void) | null = null;

    (async () => {
      try {
        showLoader();
        const auth = getAuthInstance(); // initialize/get auth at runtime (safe)
        unsub = onAuthStateChanged(auth, (usr) => {
          setUser(usr);
          setLoading(false);
          hideLoader();
        });
      } catch (err) {
        // if auth init fails, ensure loader is hidden and mark not-loading
        console.warn("Auth initialization failed:", err);
        setLoading(false);
        hideLoader();
      }
    })();

    return () => {
      if (unsub) unsub();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
