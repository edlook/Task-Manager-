import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface SignupFormProps {
  onSuccess: () => void;
}

export const SignupForm = ({ onSuccess }: SignupFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: t('signupError'),
        description: error.message,
      });
    } else if (data.user) {
      // Create profile
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          user_id: data.user.id,
          display_name: displayName,
        });

      if (profileError) {
        console.error("Profile creation error:", profileError);
      }

      toast({
        title: t('signupSuccess'),
        description: t('signupSuccessDesc'),
      });
      onSuccess();
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="displayName">{t('displayName')}</Label>
        <Input
          id="displayName"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
          placeholder={t('displayName')}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-email">{t('email')}</Label>
        <Input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="your@email.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-password">{t('password')}</Label>
        <Input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
          minLength={6}
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? t('signupLoading') : t('signupButton')}
      </Button>
    </form>
  );
};
