import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { SignIn, SignUp, useUser } from "@clerk/clerk-react";
import dashboardPreview from "@/assets/dashboard-preview.jpg";

const Login = () => {
  const navigate = useNavigate();
  const { user, isLoaded: userLoaded } = useUser();
  const [isSignUp, setIsSignUp] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (userLoaded && user) {
      navigate("/dashboard");
    }
  }, [user, userLoaded, navigate]);

  const features = [
    "5 free AI queries per month",
    "Access to basic templates",
    "Secure document storage",
    "No credit card required",
  ];

  if (!userLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex">
        {/* Left side - Integrated Clerk UI */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-md">
            <Link to="/" className="inline-block mb-8 text-center w-full">
              <span className="font-display text-2xl font-bold text-foreground">
                Reluno Legal Ai
              </span>
            </Link>

            <div className="flex justify-center w-full min-h-[450px]">
              {isSignUp ? (
                <SignUp 
                  routing="hash" 
                  signInUrl="/login" 
                  fallbackRedirectUrl="/dashboard"
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "shadow-none border border-border bg-card w-full",
                      formButtonPrimary: "bg-primary hover:bg-primary/90 text-sm",
                      footerAction: "hidden" // Hides the built-in Clerk toggle
                    }
                  }}
                />
              ) : (
                <SignIn 
                  routing="hash" 
                  signUpUrl="/signup" 
                  fallbackRedirectUrl="/dashboard"
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "shadow-none border border-border bg-card w-full",
                      formButtonPrimary: "bg-primary hover:bg-primary/90 text-sm",
                      footerAction: "hidden" // Hides the built-in Clerk toggle
                    }
                  }}
                />
              )}
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary hover:underline font-medium"
              >
                {isSignUp ? "Sign in" : "Sign up for free"}
              </button>
            </p>
          </div>
        </div>

        {/* Right side - Dashboard preview */}
        <div className="hidden lg:block lg:w-1/2 bg-muted/30 p-8">
          <div className="h-full flex flex-col items-center justify-center">
            {/* Smoothly show features ONLY on Sign Up */}
            <div className={`transition-all duration-500 transform ${isSignUp ? 'opacity-100 translate-y-0 h-auto' : 'opacity-0 -translate-y-4 h-0 overflow-hidden'}`}>
              <div className="mb-10 w-full max-w-sm p-6 rounded-xl bg-background border border-border shadow-lg">
                <p className="text-sm font-bold mb-4">Free plan includes:</p>
                <ul className="space-y-3">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-center text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <img
              src={dashboardPreview}
              alt="Dashboard Preview"
              className="max-w-full rounded-lg shadow-2xl border border-border transition-transform duration-500 hover:scale-[1.02]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
