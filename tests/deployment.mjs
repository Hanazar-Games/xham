import { execFileSync } from 'node:child_process'
import { createServer } from 'node:http'
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, extname, resolve, sep } from 'node:path'
import assert from 'node:assert/strict'
import { chromium } from '@playwright/test'

const directory = await mkdtemp(join(tmpdir(), 'quizpop-deploy-'))
let browser
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp' }
const server = createServer(async (request, response) => {
  const path = new URL(request.url, 'http://localhost').pathname
  const file = resolve(directory, path.slice('/xham/'.length) || 'index.html')
  if (!path.startsWith('/xham/') || !file.startsWith(directory + sep)) {
    response.writeHead(404).end()
    return
  }
  try {
    const body = await readFile(file)
    response.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' }).end(body)
  } catch {
    response.writeHead(404).end()
  }
})
try {
  execFileSync(process.execPath, ['node_modules/vite/bin/vite.js', 'build', '--base', '/xham/', '--outDir', directory], { stdio: 'inherit' })
  await new Promise((ready) => server.listen(0, '127.0.0.1', ready))
  const origin = `http://127.0.0.1:${server.address().port}`
  const html = await (await fetch(`${origin}/xham/`)).text()
  assert(!html.includes('/src/main.tsx'))
  assert.equal((await fetch(`${origin}/src/main.tsx`)).status, 404)
  for (const file of await readdir(join(directory, 'images'), { recursive: true })) {
    if (!['.svg', '.webp'].includes(extname(file))) continue
    assert.equal((await fetch(`${origin}/xham/images/${file}`)).status, 200, file)
  }
  browser = await chromium.launch()
  const page = await browser.newPage()
  const failures = []
  page.on('pageerror', (error) => failures.push(error.message))
  page.on('response', (response) => { if (response.status() >= 400) failures.push(response.url()) })
  await page.goto(`${origin}/xham/`)
  await page.locator('.quiz-card').first().waitFor()
  assert.equal(await page.locator('.quiz-card').count(), 264)
  const localImages = await page.locator('img').evaluateAll((images) => images.map((image) => image.src))
  for (const url of localImages) {
    assert(url.startsWith(`${origin}/xham/`))
    assert.equal((await fetch(url)).status, 200)
  }
  const favicon = await page.locator('link[rel="icon"]').getAttribute('href')
  assert.equal((await fetch(new URL(favicon, page.url()))).status, 200)
  await page.getByRole('button', { name: '开始：跨番联考，身份双线索', exact: true }).click()
  await page.getByRole('button', { name: '准备好了，开始！' }).click()
  await page.locator('.question-image').waitFor()
  await page.waitForFunction(() => document.querySelector('.question-image')?.naturalWidth > 0)
  await page.locator('.answer-option').first().click()
  await page.locator('.answer-feedback').waitFor()
  const credits = await page.locator('.question-picture a').getAttribute('href')
  assert.equal(credits, '/xham/images/original/credits.html')
  await page.goto(`${origin}${credits}`)
  await page.getByRole('link', { name: '返回动漫中心' }).click()
  await page.locator('.quiz-card').first().waitFor()
  assert.equal(new URL(page.url()).pathname, '/xham/')
  await page.getByRole('button', { name: '进入专区：Re:0', exact: true }).click()
  await page.getByRole('button', { name: '生成试卷', exact: true }).click()
  await page.getByRole('button', { name: '准备好了，开始！' }).click()
  await page.waitForFunction(() => document.querySelector('.question-image')?.naturalWidth > 0)
  assert((await page.locator('.question-image').getAttribute('src')).startsWith('/xham/images/'))
  await page.locator('.answer-option').first().click()
  assert.equal(await page.locator('.correct-answer').count(), 0)
  assert((await page.locator('.answer-feedback').innerText()).includes('答案已记录'))
  assert.deepEqual(failures, [])
  console.log('Static /xham/ deployment: entry, covers, favicon, question, attribution and return passed.')
} finally {
  await browser?.close()
  await new Promise((done) => server.close(done))
  await rm(directory, { recursive: true, force: true })
}
