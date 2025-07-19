import { MetadataRoute } from 'next'

const baseUrl = 'https://luckydraw.pub'

// 支持的语言列表
const supportedLocales = ['en', 'zh', 'fr', 'de', 'es', 'ko', 'ja', 'pt', 'ru']

// 页面路径配置
const pages = [
    { path: '', priority: 0.95, isHome: true },           // 首页
    { path: '/ball', priority: 0.9 },                     // 3D球体抽奖
    { path: '/grid', priority: 0.9 },                     // 网格抽奖
    { path: '/wheel', priority: 0.9 },                    // 大转盘抽奖
]

export default function sitemap(): MetadataRoute.Sitemap {
    const currentDate = new Date().toISOString()

    // 生成所有语言版本的页面
    const languagePages = supportedLocales.flatMap(locale =>
        pages.map(page => ({
            url: `${baseUrl}/${locale}${page.path}`,
            lastModified: currentDate,
            changeFrequency: 'weekly' as const,
            priority: page.priority,
        }))
    )

    // 简洁的功能页面入口 - 方便直接访问，优先级较低
    const simplePages = pages
        .filter(page => !page.isHome) // 排除首页，因为根路径会重定向
        .map(page => ({
            url: `${baseUrl}${page.path}`,
            lastModified: currentDate,
            changeFrequency: 'weekly' as const,
            priority: page.priority - 0.1, // 比语言版本优先级低
        }))

    return [
        // 主要入口页面 - 会自动重定向到用户首选语言
        {
            url: baseUrl,
            lastModified: currentDate,
            changeFrequency: 'weekly' as const,
            priority: 1.0,
        },
        ...languagePages,
        ...simplePages
    ]
} 