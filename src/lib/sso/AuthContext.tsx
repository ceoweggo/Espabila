import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import GlobodainSSOAuth from './GlobodainSSOAuth';
import { config, envLog } from '../../config/environment';
import { toast } from 'sonner';

// Definición de tipos para el contexto
interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role?: string;
  active?: boolean;
  subscription?: Subscription; // Añadimos la suscripción al usuario
  [key: string]: any; // Para otras propiedades que pueda tener el usuario
}

// Nuevo tipo para la información del token API
interface ApiTokenInfo {
  token: string;
  expires: string;
}

// Definición de tipos para la suscripción
interface PaymentMethod {
  type: 'credit_card' | 'paypal' | 'bank_transfer' | 'other';
  last_four?: string;
  expiry?: string;
  provider_id?: string;
  additional_info?: any;
}

interface Payment {
  transaction_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  date: string;
}

interface Subscription {
  status: 'active' | 'inactive' | 'trial' | 'expired' | 'cancelled';
  plan: 'basic' | 'premium' | 'enterprise' | 'trial';
  start_date: string;
  end_date: string;
  auto_renew: boolean;
  payment_method?: PaymentMethod;
  features?: string[];
  payment_history?: Payment[];
  updated_at: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  apiToken: ApiTokenInfo | null;
  login: (provider?: string) => void;
  loginWithEmail: (email: string, password: string) => Promise<boolean>;
  registerWithEmail: (email: string, name: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  handleCallback: (code: string) => Promise<boolean>;
  refreshApiToken: () => Promise<boolean>;
  
  // Nuevas funciones para gestión de suscripciones
  hasActiveSubscription: () => boolean;
  getSubscriptionDetails: () => Subscription | null;
  updateSubscription: (subscriptionData: Subscription) => Promise<Subscription | null>;
  cancelSubscription: () => Promise<boolean>;
  changePlan: (planId: string) => Promise<boolean>;
}

// Obtener la configuración del SSO desde el archivo de entorno
const ssoConfig = config.ssoConfig;

// API Endpoint para tokens
const API_ENDPOINT = config.apiUrl;

// Crear instancia del cliente SSO
const ssoAuth = new GlobodainSSOAuth(ssoConfig);

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor del contexto
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [apiToken, setApiToken] = useState<ApiTokenInfo | null>(null);

  // Función para obtener token API desde el backend
  const fetchApiToken = async (accessToken: string, user_data?: any): Promise<boolean> => {
    try {
      console.log('[fetchApiToken] Solicita token API con SSO token:', accessToken);
      console.log('[fetchApiToken] user_data:', user_data);
      const url = `${config.apiUrl}/v1/auth/sso/token`;
      console.log('[fetchApiToken] URL:', url);
      const payload = { user_data };
      console.log('[fetchApiToken] Payload:', payload);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      console.log('[fetchApiToken] Status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[fetchApiToken] Error al obtener token API:', response.status, errorText);
        return false;
      }
      const tokenData = await response.json();
      console.log('[fetchApiToken] Token API obtenido:', tokenData);
      setApiToken({
        token: tokenData.access_token.access_token,
        expires: tokenData.access_token.expires_at || new Date(Date.now() + 24*60*60*1000).toISOString()
      });
      localStorage.setItem('etedata_api_token', tokenData.access_token.access_token);
      localStorage.setItem('etedata_api_token_expires', tokenData.access_token.expires_at || new Date(Date.now() + 24*60*60*1000).toISOString());
      if (tokenData.user) {
        setUser(tokenData.user);
      }
      return true;
    } catch (error) {
      console.error('[fetchApiToken] Error solicitando token API:', error);
      return false;
    }
  };

  // Check if user is already in the database
// Mejora en la función getUserByEmail en AuthContext.tsx

const getUserByEmail = async (email: string) => {
  try {
    // Asegúrate de codificar el email para manejar caracteres especiales
    const encodedEmail = encodeURIComponent(email);
    const url = `${config.apiUrl}/v1/auth/users/${encodedEmail}`;
    console.log('[getUserByEmail] URL:', url);
    
    // Añade manejo de timeout para evitar esperas prolongadas
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 segundos de timeout
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('globodain_access_token') || ''}`
        },
        credentials: 'include',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId); // Limpiar el timeout si la petición se completa
      
      console.log("[getUserByEmail] Response:", response);
      console.log('[getUserByEmail] Status:', response.status);
      
      if (response.status === 404) {
        console.log('[getUserByEmail] Usuario no encontrado');
        return null;
      }
      
      if (!response.ok) {
        try {
          const errorData = await response.json();
          console.error('[getUserByEmail] Error al obtener usuario:', errorData);
          return null;
        } catch {
          console.error('[getUserByEmail] Error al obtener usuario:', response.status, response.statusText);
          return null;
        }
      }
      
      const data = await response.json();
      console.log('[getUserByEmail] Usuario encontrado:', data);
      return data;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        console.error('[getUserByEmail] La solicitud superó el tiempo límite');
        return { error: 'Timeout', isConnectionError: true };
      }
      throw fetchError;
    }
  } catch (error) {
    console.error('[getUserByEmail] Error en la solicitud:', error);
    // Si el servidor no está disponible, devolvemos null para manejar el caso como si el usuario no existiera
    // Esto permitirá que la aplicación siga funcionando con funcionalidad limitada
    return null;
  }
};

  // Función para crear usuario en la API
  const createUserInAPI = async (userData: any) => {
    let password = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    try {
      const url = `${config.apiUrl}/v1/auth/users`;
      const payload = {
        email: userData.email,
        name: userData.name || userData.first_name + " " + userData.last_name || userData.email,
        password: password,
        metadata: {
          sso_user_uuid: userData.uuid || userData.sub,
          sso_provider: userData.provider || "unknown"
        }
      };
      console.log('[createUserInAPI] URL:', url);
      console.log('[createUserInAPI] Payload:', payload);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      console.log('[createUserInAPI] Status:', response.status);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[createUserInAPI] Error al crear usuario:', errorData);
        throw new Error(errorData.detail || `Error al crear usuario (${response.status})`);
      }
      const data = await response.json();
      console.log('[createUserInAPI] Usuario creado:', data);
      return data;
    } catch (error) {
      console.error('[createUserInAPI] Error al crear usuario en API:', error);
      throw error;
    }
  };

  // Login con email y contraseña
  const loginWithEmail = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);
      const url = `${config.apiUrl}/v1/auth/token`;
      console.log('[loginWithEmail] URL:', url);
      console.log('[loginWithEmail] Payload:', formData.toString());
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
      });
      console.log('[loginWithEmail] Status:', response.status);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || 'Error de autenticación';
        console.error('[loginWithEmail] Error:', errorMessage);
        setError(errorMessage);
        setLoading(false);
        return false;
      }
      const tokenData = await response.json();
      console.log('[loginWithEmail] Token recibido:', tokenData);
      setApiToken({
        token: tokenData.access_token,
        expires: tokenData.expires_at
      });
      localStorage.setItem('etedata_api_token', tokenData.access_token);
      localStorage.setItem('etedata_api_token_expires', tokenData.expires_at);
      const userResponse = await fetch(`${config.apiUrl}/v1/users/me`, {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      });
      console.log('[loginWithEmail] userResponse Status:', userResponse.status);
      if (!userResponse.ok) {
        console.error('[loginWithEmail] Error al obtener datos del usuario');
      } else {
        const userData = await userResponse.json();
        console.log('[loginWithEmail] Usuario:', userData);
        setUser(userData);
      }
      setLoading(false);
      return true;
    } catch (error) {
      console.error('[loginWithEmail] Error en login con email:', error);
      setError('Error al intentar iniciar sesión. Por favor, intente nuevamente.');
      setLoading(false);
      return false;
    }
  };
  
  // Registro con email y contraseña
  const registerWithEmail = async (email: string, name: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      // Verificar si el usuario ya existe
      try {
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
          setError('Este email ya está registrado. Intente iniciar sesión.');
          setLoading(false);
          return false;
        }
      } catch (err) {
        // Si la API devuelve 404, significa que el usuario no existe
        // lo cual es lo que queremos, así que continuamos
      }
      
      // Crear usuario
      const response = await fetch(`${config.apiUrl}/v1/auth/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          name,
          password
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || 'Error al registrar usuario';
        setError(errorMessage);
        setLoading(false);
        return false;
      }
      
      // Usuario creado, ahora iniciamos sesión
      const loginSuccess = await loginWithEmail(email, password);
      
      if (loginSuccess) {
        toast.success('Usuario registrado correctamente');
        return true;
      } else {
        setError('Usuario registrado pero no se pudo iniciar sesión automáticamente. Por favor, inicie sesión manualmente.');
        return false;
      }
      
    } catch (error) {
      console.error('Error en registro con email:', error);
      setError('Error al intentar registrarse. Por favor, intente nuevamente.');
      setLoading(false);
      return false;
    }
  };

  // Verificar sesión al cargar
  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      setError(null);
      try {
        // Primero intentamos obtener sesión desde el token API
        const apiToken = localStorage.getItem('etedata_api_token');
        const apiTokenExpires = localStorage.getItem('etedata_api_token_expires');
        
        if (apiToken && apiTokenExpires) {
          // Verificar si el token no ha expirado
          const expiryDate = new Date(apiTokenExpires);
          if (expiryDate > new Date()) {
            // Token válido, obtener información del usuario
            const userResponse = await fetch(`${config.apiUrl}/v1/users/me`, {
              headers: {
                'Authorization': `Bearer ${apiToken}`
              }
            });
            
            if (userResponse.ok) {
              const userData = await userResponse.json();
              setUser(userData);
              setApiToken({
                token: apiToken,
                expires: apiTokenExpires
              });
              setLoading(false);
              return;
            }
          }
        }
        
        // Si no tenemos token API válido, intentamos con SSO
        const sso_token = localStorage.getItem('globodain_access_token');
        if (sso_token) {
          // Verificar token con Globodain SSO
          const userInfo = await ssoAuth.getUserInfo(sso_token);
          if (userInfo) {
            // Obtener información completa del usuario desde la API
            let user_data = await getUserByEmail(userInfo.email);
            if (user_data) {
              const combinedUserData = {
                ...userInfo,
                ...user_data,
                id: user_data.id || userInfo.id,
                email: userInfo.email,
                name: user_data.name || (userInfo.first_name + " " + userInfo.last_name) || userInfo.email
              };
              setUser(combinedUserData);
            } else {
              try {
                // Añadimos el provider en los datos de usuario
                userInfo.provider = 'globodain';
                user_data = await createUserInAPI(userInfo);
                const combinedUserData = {
                  ...userInfo,
                  ...user_data,
                  id: user_data.id || userInfo.id,
                  email: userInfo.email,
                  name: user_data.name || (userInfo.first_name + " " + userInfo.last_name) || userInfo.email
                };
                setUser(combinedUserData);
              } catch (err) {
                envLog('Error creando usuario en la API:', err);
                setUser(userInfo);
              }
            }
            // Obtener un token API válido
            await fetchApiToken(sso_token, userInfo);
          } else {
            // Token inválido, intentar refresh
            const refreshToken = localStorage.getItem('globodain_refresh_token');
            if (refreshToken) {
              try {
                const newTokens = await ssoAuth.refreshToken(refreshToken);
                if (newTokens && newTokens.access_token) {
                  localStorage.setItem('globodain_access_token', newTokens.access_token);
                  if (newTokens.refresh_token) {
                    localStorage.setItem('globodain_refresh_token', newTokens.refresh_token);
                  }
                  const userInfo = await ssoAuth.getUserInfo(newTokens.access_token);
                  if (userInfo) {
                    // Obtenemos información del usuario actualizada
                    const user_data = await getUserByEmail(userInfo.email);
                    if (user_data) {
                      setUser({
                        ...userInfo,
                        ...user_data,
                        id: user_data.id || userInfo.id,
                        email: userInfo.email,
                        name: user_data.name || (userInfo.first_name + " " + userInfo.last_name) || userInfo.email
                      });
                    } else {
                      userInfo.provider = 'globodain';
                      const new_user = await createUserInAPI(userInfo);
                      setUser({
                        ...userInfo,
                        ...new_user,
                        id: new_user.id || userInfo.id
                      });
                    }
                    // Obtener un token API válido
                    await fetchApiToken(newTokens.access_token, userInfo);
                  }
                }
              } catch (refreshError) {
                console.error('Error al refrescar token SSO:', refreshError);
                // Limpiar tokens inválidos
                localStorage.removeItem('globodain_access_token');
                localStorage.removeItem('globodain_refresh_token');
              }
            }
          }
        }
      } catch (error) {
        envLog('Error verificando sesión:', error);
        setError('Error al verificar la sesión');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Renovar token API
  const refreshApiToken = async (): Promise<boolean> => {
    const accessToken = localStorage.getItem('globodain_access_token');
    if (!accessToken) {
      console.error('No hay token SSO para renovar el token API');
      return false;
    }
    
    return await fetchApiToken(accessToken);
  };

  // Iniciar sesión con SSO
  const login = (provider?: string) => {
    try {
      setError(null);
      envLog('[AuthContext] Iniciando proceso de login...');
      
      // Guardar URL actual para redireccionar después de la autenticación
      const currentPath = window.location.pathname + window.location.search;
      localStorage.setItem('globodain_auth_redirect', currentPath);
      
      // Limpiar cualquier token expirado que pudiera causar problemas
      const currentToken = localStorage.getItem('globodain_access_token');
      const tokenExpiry = localStorage.getItem('globodain_token_expires');
      
      // Si el token existe y está expirado, limpiarlo
      if (currentToken && tokenExpiry && new Date(tokenExpiry) <= new Date()) {
        envLog('[AuthContext] Limpiando token expirado antes de login');
        localStorage.removeItem('globodain_access_token');
        localStorage.removeItem('globodain_refresh_token');
        localStorage.removeItem('globodain_token_expires');
      }
      
      // Redirigir al SSO
      const loginUrl = ssoAuth.getLoginUrl(provider);
      envLog('[AuthContext] Redirigiendo a:', loginUrl);
      window.location.href = loginUrl;
    } catch (err) {
      console.error('[AuthContext] Error al iniciar login:', err);
      setError('Error al iniciar el proceso de login.');
    }
  };

  // Cerrar sesión
  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      setError(null);
      console.log('Iniciando proceso de cierre de sesión...');
      
      const accessToken = localStorage.getItem('globodain_access_token');
      const refreshToken = localStorage.getItem('globodain_refresh_token');
      console.log('accessToken presente:', !!accessToken);
      console.log('refreshToken presente:', !!refreshToken);
      
      // Intentar hacer logout en el SSO si tenemos tokens
      if (accessToken && refreshToken) {
        try {
          // Nota: No realizamos el logout directamente al SSO aquí
          // La redirección al endpoint de logout del SSO se hará en la página de logout
          console.log('Limpiando sesión local...');
        } catch (e) {
          console.error('Error al preparar logout en SSO:', e);
        }
      }
      
      // Limpiar la sesión local en todos los casos
      console.log('Limpiando sesión local...');
      localStorage.removeItem('globodain_access_token');
      localStorage.removeItem('globodain_refresh_token');
      localStorage.removeItem('globodain_token_expires');
      localStorage.removeItem('globodain_user');
      localStorage.removeItem('processing_callback');
      
      // Limpiar también tokens API
      localStorage.removeItem('etedata_api_token');
      localStorage.removeItem('etedata_api_token_expires');
      
      // Actualizar el estado
      setUser(null);
      setApiToken(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      setError('Error al cerrar sesión. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Manejar callback del SSO
  const handleCallback = async (code: string): Promise<boolean> => {
    setLoading(true);
    try {
      setError(null);
      console.log('[handleCallback] Iniciando handleCallback con código:', code);
      if (localStorage.getItem('processing_callback')) {
        console.log('[handleCallback] Ya se está procesando un callback');
        return false;
      }
      localStorage.setItem('processing_callback', 'true');
      setTimeout(() => {
        localStorage.removeItem('processing_callback');
      }, 30000);
      console.log('[handleCallback] Intercambiando código por token...');
      const tokenData = await ssoAuth.exchangeCodeForToken(code);
      console.log('[handleCallback] Respuesta de exchangeCodeForToken:', tokenData);
      if (!tokenData || !tokenData.access_token) {
        const errorMsg = 'No se pudo obtener el token de acceso';
        console.error('[handleCallback] ' + errorMsg);
        console.error('[handleCallback] tokenData:', tokenData);
        setError(errorMsg);
        localStorage.removeItem('processing_callback');
        return false;
      }
      localStorage.setItem('globodain_access_token', tokenData.access_token);
      localStorage.setItem('globodain_token_expires', tokenData.expires_at || new Date(Date.now() + 24*60*60*1000).toISOString());
      if (tokenData.refresh_token) {
        localStorage.setItem('globodain_refresh_token', tokenData.refresh_token);
      }
      console.log('[handleCallback] Obteniendo información del usuario...');
      const userInfo = await ssoAuth.getUserInfo(tokenData.access_token);
      console.log('[handleCallback] userInfo:', userInfo);
      if (!userInfo) {
        const errorMsg = 'No se pudo obtener información del usuario';
        console.error('[handleCallback] ' + errorMsg);
        setError(errorMsg);
        localStorage.removeItem('processing_callback');
        return false;
      }
      let existingUser = null;
      try {
        existingUser = await getUserByEmail(userInfo.email);
      } catch (error) {
        console.log('[handleCallback] Usuario no encontrado en la API, se creará un nuevo registro');
      }
      if (!existingUser) {
        try {
          userInfo.provider = userInfo.provider || 'globodain';
          console.log('[handleCallback] Creando usuario en la API...');
          const createdUser = await createUserInAPI(userInfo);
          console.log('[handleCallback] Usuario creado:', createdUser);
          userInfo.id = createdUser.id;
        } catch (error) {
          console.error('[handleCallback] Error al crear usuario en API:', error);
        }
      } else {
        userInfo.id = existingUser.id;
      }
      setUser(userInfo);
      console.log('[handleCallback] Obteniendo token API...');
      await fetchApiToken(tokenData.access_token, userInfo);
      localStorage.removeItem('processing_callback');
      return true;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido en el proceso de callback';
      console.error('[handleCallback] Error en el proceso de callback:', error);
      setError(errorMsg);
      localStorage.removeItem('processing_callback');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // NUEVAS FUNCIONES PARA GESTIÓN DE SUSCRIPCIONES
  
  // Verificar si el usuario tiene una suscripción activa
  const hasActiveSubscription = (): boolean => {
    if (!user || !user.subscription) {
      return false;
    }
    
    return user.subscription.status === 'active';
  };

  // Obtener detalles de la suscripción
  const getSubscriptionDetails = (): Subscription | null => {
    return user?.subscription || null;
  };

  // Actualizar la suscripción del usuario
  const updateSubscription = async (subscriptionData: Subscription): Promise<Subscription | null> => {
    try {
      setLoading(true);
      setError(null);
      
      if (!apiToken) {
        setError('No hay token de API disponible para actualizar la suscripción');
        return null;
      }
      
      // Realizar la solicitud a la API
      const response = await fetch(`${config.apiUrl}/v1/users/me/subscriptions`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${apiToken.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscriptionData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error al actualizar la suscripción:', response.status, errorText);
        setError('Error al actualizar la suscripción');
        return null;
      }
      
      const updatedSubscription = await response.json();
      
      // Actualizar el estado del usuario con la nueva información de suscripción
      setUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          subscription: updatedSubscription
        };
      });
      
      return updatedSubscription;
    } catch (error) {
      console.error('Error al actualizar la suscripción:', error);
      setError('Error al actualizar la suscripción');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Cancelar la suscripción
  const cancelSubscription = async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      if (!apiToken) {
        setError('No hay token de API disponible para cancelar la suscripción');
        return false;
      }
      
      if (!user?.subscription) {
        setError('No hay suscripción activa para cancelar');
        return false;
      }
      
      // Actualizamos la suscripción existente cambiando su estado
      const updatedSubscription = {
        ...user.subscription,
        status: 'cancelled' as 'cancelled',
        updated_at: new Date().toISOString()
      };
      
      const result = await updateSubscription(updatedSubscription);
      
      return !!result;
    } catch (error) {
      console.error('Error al cancelar la suscripción:', error);
      setError('Error al cancelar la suscripción');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Cambiar el plan de suscripción
  const changePlan = async (planId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      if (!apiToken) {
        setError('No hay token de API disponible para cambiar el plan');
        return false;
      }
      
      if (!user?.subscription) {
        // Crear una nueva suscripción
        const newSubscription: Subscription = {
          status: 'active' as 'active',
          plan: planId as 'basic' | 'premium' | 'enterprise' | 'trial',
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 año
          auto_renew: true,
          features: [],
          payment_history: [],
          updated_at: new Date().toISOString()
        };
        
        const result = await updateSubscription(newSubscription);
        return !!result;
      } else {
        // Actualizar la suscripción existente
        const updatedSubscription = {
          ...user.subscription,
          plan: planId as 'basic' | 'premium' | 'enterprise' | 'trial',
          status: 'active' as 'active', // Asegurarse que esté activa
          updated_at: new Date().toISOString()
        };
        
        const result = await updateSubscription(updatedSubscription);
        return !!result;
      }
    } catch (error) {
      console.error('Error al cambiar el plan:', error);
      setError('Error al cambiar el plan de suscripción');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Valor del contexto - Actualizado con funciones de suscripción
  const value: AuthContextType = {
    isAuthenticated: !!user,
    user,
    loading,
    error,
    apiToken,
    login,
    loginWithEmail,
    registerWithEmail,
    logout,
    handleCallback,
    refreshApiToken,
    
    // Nuevas funciones para suscripciones
    hasActiveSubscription,
    getSubscriptionDetails,
    updateSubscription,
    cancelSubscription,
    changePlan
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook para usar el contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};