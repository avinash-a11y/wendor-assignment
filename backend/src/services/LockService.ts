import { v4 as uuidv4 } from 'uuid';

export interface LockOptions {
  ttl?: number; // Time to live in milliseconds
  retryDelay?: number; // Delay between retry attempts
  maxRetries?: number; // Maximum number of retry attempts
}

export class LockService {
  private locks: Map<string, { id: string; expiresAt: number }> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired locks every 30 seconds
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredLocks();
    }, 30000);
  }

  /**
   * Acquire a lock for a given key
   * @param key - The key to lock
   * @param options - Lock options
   * @returns Promise<boolean> - True if lock acquired, false otherwise
   */
  async acquireLock(key: string, options: LockOptions = {}): Promise<boolean> {
    const {
      ttl = 30000, // 30 seconds default
      retryDelay = 100, // 100ms default
      maxRetries = 10 // 10 retries default
    } = options;

    const lockId = uuidv4();
    const expiresAt = Date.now() + ttl;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      // Check if lock exists and is still valid
      const existingLock = this.locks.get(key);
      if (existingLock && existingLock.expiresAt > Date.now()) {
        // Lock is held by someone else and still valid
        if (attempt === maxRetries) {
          return false; // Max retries reached
        }
        await this.delay(retryDelay);
        continue;
      }

      // Try to acquire the lock
      this.locks.set(key, { id: lockId, expiresAt });
      
      // Verify we got the lock (in case of race condition)
      const currentLock = this.locks.get(key);
      if (currentLock && currentLock.id === lockId) {
        return true;
      }

      // Someone else got the lock, retry
      if (attempt === maxRetries) {
        return false;
      }
      await this.delay(retryDelay);
    }

    return false;
  }

  /**
   * Release a lock for a given key
   * @param key - The key to unlock
   * @param lockId - The lock ID to verify ownership
   * @returns Promise<boolean> - True if lock released, false otherwise
   */
  async releaseLock(key: string, lockId: string): Promise<boolean> {
    const lock = this.locks.get(key);
    if (lock && lock.id === lockId) {
      this.locks.delete(key);
      return true;
    }
    return false;
  }

  /**
   * Extend the TTL of an existing lock
   * @param key - The key to extend
   * @param lockId - The lock ID to verify ownership
   * @param additionalTtl - Additional TTL in milliseconds
   * @returns Promise<boolean> - True if lock extended, false otherwise
   */
  async extendLock(key: string, lockId: string, additionalTtl: number): Promise<boolean> {
    const lock = this.locks.get(key);
    if (lock && lock.id === lockId) {
      lock.expiresAt += additionalTtl;
      return true;
    }
    return false;
  }

  /**
   * Check if a key is currently locked
   * @param key - The key to check
   * @returns boolean - True if locked, false otherwise
   */
  isLocked(key: string): boolean {
    const lock = this.locks.get(key);
    return lock ? lock.expiresAt > Date.now() : false;
  }

  /**
   * Get lock information for a key
   * @param key - The key to check
   * @returns Lock info or null if not locked
   */
  getLockInfo(key: string): { id: string; expiresAt: number } | null {
    const lock = this.locks.get(key);
    return lock && lock.expiresAt > Date.now() ? lock : null;
  }

  /**
   * Clean up expired locks
   */
  private cleanupExpiredLocks(): void {
    const now = Date.now();
    for (const [key, lock] of this.locks.entries()) {
      if (lock.expiresAt <= now) {
        this.locks.delete(key);
      }
    }
  }

  /**
   * Delay execution for a given number of milliseconds
   * @param ms - Milliseconds to delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Destroy the lock service and clean up resources
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.locks.clear();
  }
}

// Singleton instance
export const lockService = new LockService();
