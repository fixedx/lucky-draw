import { getRequestConfig } from 'next-intl/server';
import enMessages from '../../messages/en.json';
import zhMessages from '../../messages/zh.json';

const messages = {
    en: enMessages,
    zh: zhMessages
};

export default getRequestConfig(async ({ requestLocale }) => {
    const locale = await requestLocale;
    // 确保 locale 在支持的语言列表中
    if (!locale || !(locale in messages)) {
        return {
            messages: messages.en,
            locale: 'en'
        };
    }

    return {
        messages: messages[locale as keyof typeof messages],
        locale
    };
});
