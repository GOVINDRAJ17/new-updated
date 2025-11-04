import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          setError(error.message);
          console.error("Auth error:", error);
          setTimeout(() => navigate("/auth"), 3000);
          return;
        }

        if (data?.session?.user) {
          const userId = data.session.user.id;
          const email = data.session.user.email;
          const fullName = data.session.user.user_metadata?.full_name || email?.split("@")[0] || "User";

          try {
            await supabase.from("profiles").upsert({
              id: userId,
              full_name: fullName,
            });
          } catch (profileError) {
            console.warn("Profile creation warning:", profileError);
          }

          setLoading(false);
          setTimeout(() => navigate("/"), 500);
        } else {
          setError("No session found. Please try signing in again.");
          setTimeout(() => navigate("/auth"), 3000);
        }
      } catch (err) {
        setError((err && err.message) || "An unexpected error occurred");
        console.error("Callback error:", err);
        setTimeout(() => navigate("/auth"), 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
      <div className="text-center">
        {loading ? (
          <>
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Signing you in...</h1>
            <p className="text-white/80">Completing authentication</p>
          </>
        ) : error ? (
          <>
            <h1 className="text-2xl font-bold text-red-500 mb-2">Authentication Error</h1>
            <p className="text-white/80 mb-4">{error}</p>
            <p className="text-white/60 text-sm">Redirecting to sign in...</p>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default AuthCallback;
