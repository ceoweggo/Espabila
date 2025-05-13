import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { Separator } from "@/components/ui/separator";
import { Mail, LogIn, UserPlus } from 'lucide-react';
import { useTranslation } from '@/lib/TranslationProvider';
import { useAuth } from '@/lib/sso/AuthContext';
import { SSO_PROVIDERS } from '@/lib/sso/GlobodainSSOAuth';

type AuthFormProps = {
  onSuccess: () => void;
}

const AuthForm = ({ onSuccess }: AuthFormProps) => {
  const { t } = useTranslation();
  const { login, loginWithEmail, registerWithEmail, error: authError } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ssoLoading, setSsoLoading] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsLoading(true);
    
    try {
      let success = false;
      
      if (isLogin) {
        // Iniciar sesión con email y contraseña
        success = await loginWithEmail(email, password);
      } else {
        // Validar campos
        if (!name.trim()) {
          setFormError(t('auth.error.name_required'));
          setIsLoading(false);
          return;
        }
        
        if (password.length < 8) {
          setFormError(t('auth.error.password_too_short'));
          setIsLoading(false);
          return;
        }
        
        // Registrar nuevo usuario
        success = await registerWithEmail(email, name, password);
      }
      
      if (success) {
        toast.success(isLogin ? t('auth.login_success') : t('auth.signup_success'));
        onSuccess();
      } else {
        // El error se maneja internamente en los métodos de auth y se establece en authError
        setFormError(authError || t('auth.error.generic'));
      }
    } catch (error) {
      console.error('Error en el proceso de autenticación:', error);
      setFormError(t('auth.error.generic'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSSOLogin = (provider: string) => {
    setSsoLoading(provider);
    
    try {
      // Iniciar el proceso de login SSO real
      login(provider);
      
      // Nota: No necesitamos resetear ssoLoading ni mostrar mensaje de éxito
      // porque el usuario será redirigido a la página de login de SSO
    } catch (error) {
      console.error('Error iniciando sesión SSO:', error);
      setSsoLoading(null);
      toast.error(`${t('auth.login_provider_error')} ${provider}`);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border-none p-6 dark:bg-gray-800">
      <CardHeader className="space-y-1 p-0 mb-6">
        <CardTitle className="text-2xl font-bold text-center text-primary dark:text-white">
          {isLogin ? t('auth.login') : t('auth.signup')}
        </CardTitle>
        <CardDescription className="text-center dark:text-gray-300">
          {isLogin 
            ? t('auth.login.description') 
            : t('auth.signup.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-0">
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={() => handleSSOLogin(SSO_PROVIDERS.GOOGLE)}
            disabled={ssoLoading !== null || isLoading}
            className="w-full border-border dark:border-gray-600 hover:border-accent hover:bg-accent/5 dark:hover:border-accent dark:hover:bg-accent/10 dark:text-white dark:bg-gray-700"
          >
            {ssoLoading === SSO_PROVIDERS.GOOGLE ? (
              <span className="flex items-center">
                <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent dark:border-white dark:border-t-transparent" />
                <span>Google</span>
              </span>
            ) : (
              <>
                <svg
                  className="mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSSOLogin(SSO_PROVIDERS.GLOBODAIN)}
            disabled={ssoLoading !== null || isLoading}
            className="w-full border-border dark:border-gray-600 hover:border-accent hover:bg-accent/5 dark:hover:border-accent dark:hover:bg-accent/10 dark:text-white dark:bg-gray-700"
          >
            {ssoLoading === SSO_PROVIDERS.GLOBODAIN ? (
              <span className="flex items-center">
                <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent dark:border-white dark:border-t-transparent" />
                <span>Globodain</span>
              </span>
            ) : (
              <>
                <img src="/globodain.png" alt="Globodain" className="mr-2 h-4 " />
                Globodain
              </>
            )}
          </Button>
        </div>

        <div className="flex items-center my-4">
          <Separator className="flex-1 dark:bg-gray-600" />
          <span className="px-3 text-xs text-muted-foreground dark:text-gray-400">{t('auth.or')}</span>
          <Separator className="flex-1 dark:bg-gray-600" />
        </div>

        {formError && (
          <div className="p-3 rounded bg-destructive/10 border border-destructive text-destructive text-sm">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-primary dark:text-white">{t('profile.name')}</Label>
              <Input 
                id="name" 
                placeholder={t('auth.name.placeholder')} 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
                disabled={isLoading}
                className="border-border dark:border-gray-600 focus-visible:ring-accent dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-primary dark:text-white">{t('auth.email')}</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              disabled={isLoading}
              className="border-border dark:border-gray-600 focus-visible:ring-accent dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-primary dark:text-white">{t('auth.password')}</Label>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              disabled={isLoading}
              className="border-border dark:border-gray-600 focus-visible:ring-accent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <Button 
            type="submit"
            className="w-full" 
            variant="globodain"
            disabled={isLoading || ssoLoading !== null}
          >
            {isLoading ? (
              <span className="flex items-center">
                <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span>Processing...</span>
              </span>
            ) : (
              <span className="flex items-center">
                {isLogin ? <LogIn className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                {isLogin ? t('auth.login') : t('auth.signup')}
              </span>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col p-0 mt-6">
        <p className="text-center text-sm dark:text-gray-300">
          {isLogin ? t('auth.no_account') : t('auth.has_account')}
          <button 
            onClick={() => { 
              setIsLogin(!isLogin);
              setFormError(null);
            }}
            className="text-accent underline hover:text-accent/80 font-medium ml-1 dark:text-accent dark:hover:text-accent/80"
            type="button"
            disabled={isLoading}
          >
            {isLogin ? t('auth.signup') : t('auth.login')}
          </button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
