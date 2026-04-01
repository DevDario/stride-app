import * as SecureStore from 'expo-secure-store'
import type { tokenCache } from '@clerk/expo/token-cache'

export const TokenCacheImpl: typeof tokenCache = {
  async getToken(key: string) {
    try {
      const token = await SecureStore.getItemAsync(key)

      // optional sanity check
      if (!token) return null

      return token
    } catch (err) {
      console.warn('[TokenCache] getToken error:', err)
      return null
    }
  },

  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value, {
        keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
      })
    } catch (err) {
      console.warn('[TokenCache] saveToken error:', err)
    }
  },

  async clearToken(key: string) {
    try {
      await SecureStore.deleteItemAsync(key)
    } catch (err) {
      console.warn('[TokenCache] clearToken error:', err)
    }
  },
}