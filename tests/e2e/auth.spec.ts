// daychat/tests/e2e/auth.spec.ts
import { test, expect } from '../fixtures/test-users'

test.describe('Authentication', () => {
  test('shows login page', async ({ page }) => {
    await page.goto('/login')
    
    await expect(page).toHaveTitle(/DayChat/)
    await expect(page.getByPlaceholder('Email')).toBeVisible()
    await expect(page.getByPlaceholder('Password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
  })

  test('shows signup page', async ({ page }) => {
    await page.goto('/signup')
    
    await expect(page.getByPlaceholder('Username')).toBeVisible()
    await expect(page.getByPlaceholder('Email')).toBeVisible()
    await expect(page.getByPlaceholder('Password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible()
  })

  test('redirects to home after login', async ({ page, testUser }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', testUser.email)
    await page.fill('input[type="password"]', testUser.password)
    await page.click('button[type="submit"]')
    
    await page.waitForURL('/')
    await expect(page).toHaveURL('/')
  })

  test('redirects to home if already logged in', async ({ page, testUser }) => {
    // Login first
    await page.goto('/login')
    await page.fill('input[type="email"]', testUser.email)
    await page.fill('input[type="password"]', testUser.password)
    await page.click('button[type="submit"]')
    await page.waitForURL('/')

    // Try to access login page again
    await page.goto('/login')
    await expect(page).toHaveURL('/')
  })
})
