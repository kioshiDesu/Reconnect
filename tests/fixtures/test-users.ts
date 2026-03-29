// daychat/tests/fixtures/test-users.ts
/* eslint-disable react-hooks/rules-of-hooks */
import { test as base } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const test = base.extend<{
  testUser: { email: string; password: string; username: string }
  loginAsUser: (email: string, password: string) => Promise<void>
}>({
  testUser: async ({}, use) => {
    const testUser = {
      email: `test+${Date.now()}@example.com`,
      password: 'testpassword123',
      username: `testuser${Date.now()}`,
    }

    // Create test user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testUser.email,
      password: testUser.password,
    })

    if (authError) throw authError

    if (authData.user) {
      await supabase.from('profiles').insert({
        id: authData.user.id,
        username: testUser.username,
        status: 'online',
      })
    }

    await use(testUser)

    // Cleanup
    if (authData.user) {
      await supabase.from('profiles').delete().eq('id', authData.user.id)
      await supabase.auth.admin.deleteUser(authData.user.id)
    }
  },

  loginAsUser: async ({ page }, use) => {
    const loginFunction = async (email: string, password: string) => {
      await page.goto('/login')
      await page.fill('input[type="email"]', email)
      await page.fill('input[type="password"]', password)
      await page.click('button[type="submit"]')
      await page.waitForURL('/')
    }
    await use(loginFunction)
  },
})

export { expect } from '@playwright/test'
