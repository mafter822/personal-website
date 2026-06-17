const GITHUB_OWNER = 'your-username'
const GITHUB_REPO = 'blog-content'
const BRANCH = 'main'

export async function fetchPosts(locale = 'en') {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${locale}?ref=${BRANCH}`

  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error('Failed to fetch')

    const files = await response.json()
    const mdFiles = files.filter(f => f.name.endsWith('.md'))

    const posts = await Promise.all(
      mdFiles.map(async (file) => {
        const content = await fetchFileContent(file.download_url)
        const { frontmatter, body } = parseFrontmatter(content)
        return {
          slug: file.name.replace('.md', ''),
          title: frontmatter.title || file.name.replace('.md', ''),
          date: frontmatter.date || '',
          excerpt: frontmatter.excerpt || body.substring(0, 150) + '...',
        }
      })
    )

    return posts.sort((a, b) => new Date(b.date) - new Date(a.date))
  } catch (e) {
    console.warn('GitHub API failed, using demo data:', e.message)
    return getDemoPosts(locale)
  }
}

export async function fetchPost(slug, locale = 'en') {
  const url = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${BRANCH}/${locale}/${slug}.md`

  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error('Failed to fetch')

    const content = await response.text()
    const { frontmatter, body } = parseFrontmatter(content)

    return {
      slug,
      title: frontmatter.title || slug,
      date: frontmatter.date || '',
      content: body,
    }
  } catch (e) {
    console.warn('GitHub API failed, using demo data:', e.message)
    return getDemoPost(slug, locale)
  }
}

async function fetchFileContent(url) {
  const response = await fetch(url)
  return await response.text()
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return { frontmatter: {}, body: content }

  const frontmatter = {}
  match[1].split('\n').forEach(line => {
    const [key, ...value] = line.split(':')
    if (key) frontmatter[key.trim()] = value.join(':').trim()
  })

  return { frontmatter, body: match[2].trim() }
}

function getDemoPosts(locale) {
  if (locale === 'zh') {
    return [
      { slug: 'hello-world', title: '你好世界', date: '2024-01-01', excerpt: '这是第一篇博客文章的摘要...' },
      { slug: 'getting-started', title: '快速入门', date: '2024-01-15', excerpt: '如何开始使用这个博客系统...' },
    ]
  }
  return [
    { slug: 'hello-world', title: 'Hello World', date: '2024-01-01', excerpt: 'This is the first blog post excerpt...' },
    { slug: 'getting-started', title: 'Getting Started', date: '2024-01-15', excerpt: 'How to get started with this blog...' },
  ]
}

function getDemoPost(slug, locale) {
  const posts = {
    zh: {
      'hello-world': { title: '你好世界', date: '2024-01-01', content: '# 你好世界\n\n这是第一篇博客文章。' },
      'getting-started': { title: '快速入门', date: '2024-01-15', content: '# 快速入门\n\n如何开始使用这个博客系统。' },
    },
    en: {
      'hello-world': { title: 'Hello World', date: '2024-01-01', content: '# Hello World\n\nThis is the first blog post.' },
      'getting-started': { title: 'Getting Started', date: '2024-01-15', content: '# Getting Started\n\nHow to get started with this blog.' },
    },
  }
  return posts[locale]?.[slug] || null
}
