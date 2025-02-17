import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect
  } from 'react'
  import { axiosInstance } from '@/lib/Utils'
  import { API_ENDPOINTS } from '@/lib/Constants'
  import { config } from '@/config/Config'
  import { IUser } from '@/interfaces/interfaces'

  interface User extends IUser {
    isGuest: boolean
  }
  
  interface AuthContextProps {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    accessToken: string | null
    refreshToken: string | null
    // login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    getProfile: () => Promise<void>
    oauthLogin: (provider: 'discord' | 'github' | 'google') => Promise<void>
  }
  
  // ✅ สร้าง Context ให้ถูกต้อง
  export const AuthContext = createContext<AuthContextProps | undefined>(undefined);
  
  export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [accessToken, setAccessToken] = useState<string | null>(null)
    const [refreshToken, setRefreshToken] = useState<string | null>(null)
  
    // const login = async (email: string, password: string) => {
    //   setIsLoading(true)
    //   try {
    //     const response = await axiosInstance.post(
    //       `${config.apiUrl}${API_ENDPOINTS.AUTH.LOGIN}`,
    //       { email, password }
    //     )
  
    //     const data = response.data as {
    //       user: User
    //       credentials: {
    //         accessToken: string
    //         refreshToken: string
    //       }
    //     }

    //     setUser({
    //       id: data.user.id,
    //       firstName: data.user.firstName,
    //       lastName: data.user.lastName,
    //       email: data.user.email,
    //       avatar: data.user.avatar,
    //       createdAt: data.user.createdAt,
    //       updatedAt: data.user.updatedAt,
    //       deletedAt: data.user.deletedAt,
    //       events: data.user.events,
    //       polls: data.user.polls,
    //       whitelist: data.user.whitelist,
    //       votes: data.user.votes,
    //       userVotes: data.user.userVotes,
    //       dataLogs: data.user.dataLogs,
    //       isGuest: data.user  
    //     })

    //     setIsAuthenticated(true)
    //     setAccessToken(data.credentials.accessToken)
    //     setRefreshToken(data.credentials.refreshToken)
  
    //     localStorage.setItem('accessToken', data.credentials.accessToken)
    //     localStorage.setItem('refreshToken', data.credentials.refreshToken)
    //   } finally {
    //     setIsLoading(false)
    //   }
    // }
  
    const oauthLogin = async (provider: 'discord' | 'github' | 'google') => {
      const service = 'vote'
      window.location.href = `${config.apiOpenIdConnectUrl}/auth/${provider}?service=${service}&redirect=${config.appUrlCallback}`
    }
  
    const logout = async () => {
      setIsLoading(true)
      try {
        localStorage.clear()
        window.location.reload()
      } finally {
        setIsLoading(false)
      }
    }
  
    const getProfile = async () => {
      setIsLoading(true)
      try {
        const response = await axiosInstance.get(
          `${config.apiUrl}${API_ENDPOINTS.AUTH.ME}`
        )
        const data = response.data as User
        setUser({
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          avatar: data.avatar,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          isGuest: data.isGuest || false,
        })
        setIsAuthenticated(true)
      } finally {
        setIsLoading(false)
      }
    }
  
    useEffect(() => {
      getProfile()
    }, [])

    return (
        <AuthContext.Provider
          value={{
            user,
            isAuthenticated,
            isLoading,
            accessToken,
            refreshToken,
            // login,
            logout,
            getProfile,
            oauthLogin,
          }}
        >
          {children}
        </AuthContext.Provider>
      )
  }
  
  // ✅ ใช้ useContext ให้ถูกต้อง
  export const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext)
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
  }
  