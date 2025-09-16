import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      
      login: async (email, password) => {
        set({ loading: true })
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock user data
        const user = {
          id: '1',
          email: email,
          name: 'John Doe',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
        }
        
        set({ user, isAuthenticated: true, loading: false })
        return { success: true }
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
      
      register: async (email, password, name) => {
        set({ loading: true })
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const user = {
          id: '1',
          email: email,
          name: name,
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
        }
        
        set({ user, isAuthenticated: true, loading: false })
        return { success: true }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
)