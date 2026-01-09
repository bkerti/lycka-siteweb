import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import logoPng from '/sc/log.png';
import logoWebp from '/sc/log.png?format=webp';

interface AdminLoginProps {
  onLogin: (username: string, token: string) => void;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("0000");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Échec de la connexion');
      }

      toast({
        title: "Connexion réussie",
        description: `Bienvenue, ${data.username}`,
      });
      
      onLogin(data.username, data.token);

    } catch (err) {
      let errorMessage = "Une erreur inconnue est survenue";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      toast({
        title: "Échec de la connexion",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: "url(/sc/m.jpg)" }}
    >
      <div className="max-w-md w-full bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm shadow-2xl rounded-2xl p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2">
            <picture>
              <source srcSet={logoWebp} type="image/webp" />
              <source srcSet={logoPng} type="image/png" />
              <img
                src={logoPng}
                alt="LYCKA Logo"
                className="h-12"
              />
            </picture>
            <span className="text-2xl md:text-3xl font-bold font-heading bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 bg-clip-text text-transparent">
              LYCKA
            </span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            Connectez-vous pour accéder au panneau d'administration
          </p>
        </div>
        
        {error && (
          <div className="mb-6 p-3 bg-red-100/80 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-gray-800 dark:text-gray-200">
              Nom d'utilisateur
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Entrez votre nom d'utilisateur"
              disabled={isLoading}
              className="bg-white/50 dark:bg-gray-800/50"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-800 dark:text-gray-200">
              Mot de passe
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez le mot de passe"
                disabled={isLoading}
                className="bg-white/50 dark:bg-gray-800/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full bg-lycka-primary hover:bg-lycka-secondary text-white"
            disabled={isLoading}
          >
            {isLoading ? "Connexion en cours..." : "Se connecter"}
            {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;