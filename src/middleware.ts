import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

const middleware = createMiddleware({
    // 支持的语言列表
    locales: ['en', 'zh', 'fr', 'de', 'es', 'ko', 'ja', 'pt', 'ru'],

    // 默认语言
    defaultLocale: 'en',

    // 始终使用路径前缀
    localePrefix: 'as-needed',

    // 启用自动重定向
    alternateLinks: false,

    // 启用语言检测
    localeDetection: true
});

export default function intlMiddleware(request: NextRequest) {
    return middleware(request);
}

export const config = {
    // 匹配所有路径
    matcher: ['/((?!api|_next|.*\\..*).*)']
}; 