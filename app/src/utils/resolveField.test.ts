import { describe, it, expect } from 'vitest'
import { resolveField } from './resolveField'

describe('resolveField', () => {
  it('resolves nested path correctly', () => {
    const obj = {
      user: {
        profile: {
          name: 'John Doe',
          contact: {
            email: 'john@example.com'
          }
        }
      }
    }

    expect(resolveField(obj, 'user.profile.name')).toBe('John Doe')
    expect(resolveField(obj, 'user.profile.contact.email')).toBe('john@example.com')
  })

  it('handles fallback behavior', () => {
    const obj = {
      user: {
        name: 'John'
      }
    }

    expect(resolveField(obj, 'user.name', 'default')).toBe('John')
    expect(resolveField(obj, 'user.email', 'default')).toBe('default')
  })

  it('handles null/undefined input', () => {
    expect(resolveField(null, 'user.name')).toBeUndefined()
    expect(resolveField(undefined, 'user.name')).toBeUndefined()

    const obj = { user: null }
    expect(resolveField(obj, 'user.name')).toBeNull()
  })

  it('handles non-existent paths', () => {
    const obj = { user: { name: 'John' } }

    expect(resolveField(obj, 'user.email')).toBeUndefined()
    expect(resolveField(obj, 'profile.name')).toBeUndefined()
  })

  it('handles array access in paths', () => {
    const obj = {
      users: [{ name: 'John' }, { name: 'Jane' }]
    }

    // Note: This assumes the resolveField implementation supports array indices
    // If not, it would return undefined for such paths
    expect(resolveField(obj, 'users.0.name')).toBe('John')
    expect(resolveField(obj, 'users.1.name')).toBe('Jane')
  })
})
