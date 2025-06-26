import { MetadataRoute } from 'next'

const baseUrl = 'https://luckydraw.pub'

const supportedLocales = ['en', 'zh', 'fr', 'de', 'es', 'ko', 'ja', 'pt', 'ru']

export default function sitemap(): MetadataRoute.Sitemap {
    const currentDate = new Date().toISOString()

    // 生成所有语言版本的页面
    const pages = supportedLocales.flatMap(locale => [
        // 主页
        {
            url: `${baseUrl}/${locale}`,
            lastModified: currentDate,
            changeFrequency: 'weekly' as const,
            priority: locale === 'en' ? 1.0 : 0.9,
            alternates: {
                languages: Object.fromEntries(
                    supportedLocales.map(lang => [
                        lang === 'zh' ? 'zh-CN' : lang === 'pt' ? 'pt-BR' : `${lang}-${lang.toUpperCase()}`,
                        `${baseUrl}/${lang}`
                    ])
                )
            }
        },
        // 3D球体抽奖页面
        {
            url: `${baseUrl}/${locale}/ball`,
            lastModified: currentDate,
            changeFrequency: 'weekly' as const,
            priority: locale === 'en' ? 0.9 : 0.8,
            alternates: {
                languages: Object.fromEntries(
                    supportedLocales.map(lang => [
                        lang === 'zh' ? 'zh-CN' : lang === 'pt' ? 'pt-BR' : `${lang}-${lang.toUpperCase()}`,
                        `${baseUrl}/${lang}/ball`
                    ])
                )
            }
        }
    ])

    return [
        // 默认重定向页面
        {
            url: baseUrl,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.5,
        },
        ...pages
    ]
} 