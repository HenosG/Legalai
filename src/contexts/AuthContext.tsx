import { createContext, useContext, ReactNode } from "react";
import { useUser, useClerk, useSignIn, useSignUp } from "@clerk/clerk-react";

interface AuthContextType {
  user: { id: string; email: string; fullName: string | null } | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, isLoaded } = useUser();
  const { signOut: clerkSignOut, setActive } = useClerk();
  const { signIn: clerkSignIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp: clerkSignUp, isLoaded: signUpLoaded } = useSignUp();

  const signOut = async () => await clerkSignOut();

  const signIn = async (email: string, password: string) => {
    if (!signInLoaded) return { error: { message: "Auth not loaded" } };
    try {
      const result = await clerkSignIn.create({ identifier: email, password });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        return { error: null };
      }
      return { error: { message: "Sign in incomplete" } };
    } catch (err: any) { return { error: err }; }
  };

  const signUp = async (email: string, password: string, name: string) => {
    if (!signUpLoaded) return { error: { message: "Auth not loaded" } };
    try {
      const result = await clerkSignUp.create({ emailAddress: email, password, firstName: name });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        // Sync new user to Neon
        await fetch("http://localhost:5000/api/users/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name }),
        });
        return { error: null };
      }
      return { error: { message: "Verification required." } };
    } catch (err: any) { return { error: err }; }
  };

  return (
    <AuthContext.Provider value={{
      user: user ? {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress || "",
        fullName: user.fullName
      } : null,
      loading: !isLoaded,
      signOut,
      signIn,
      signUp,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
