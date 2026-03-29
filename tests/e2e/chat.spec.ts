// daychat/tests/e2e/chat.spec.ts
import { test, expect } from '../fixtures/test-users'

test.describe('Chat', () => {
  test('shows chat list page', async ({ page, loginAsUser, testUser }) => {
    await loginAsUser(testUser.email, testUser.password)
    
    await expect(page.getByRole('heading', { name: 'Chats' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'New chat' })).toBeVisible()
  })

  test('displays mobile navigation', async ({ page, loginAsUser, testUser }) => {
    await loginAsUser(testUser.email, testUser.password)
    
    await expect(page.getByText('Chats')).toBeVisible()
    await expect(page.getByText('Rooms')).toBeVisible()
    await expect(page.getByText('Profile')).toBeVisible()
  })

  test('shows empty state when no chats', async ({ page, loginAsUser, testUser }) => {
    await loginAsUser(testUser.email, testUser.password)
    
    await expect(page.getByText('No chats yet')).toBeVisible()
  })
})
