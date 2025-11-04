import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Chrome } from "lucide-react";

export default function GoogleSignIn({ className = "", variant = "outline", size = "default" }) {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message || "Failed to sign in with Google");
      }
    } catch (error) {
      toast.error((error && error.message) || "An error occurred during Google sign-in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleGoogleSignIn}
      disabled={loading}
      variant={variant}
      size={size}
      className={className}
    >
      <Chrome className="mr-2 h-4 w-4" />
      {loading ? "Signing in..." : "Continue with Google"}
    </Button>
  );
}
