import { getRequestConfig } from 'next-intl/server';
import enMessages from '../../messages/en.json';
import zhMessages from '../../messages/zh.json';
import frMessages from '../../messages/fr.json';
import deMessages from '../../messages/de.json';
import esMessages from '../../messages/es.json';
import koMessages from '../../messages/ko.json';
import jaMessages from '../../messages/ja.json';
import ptMessages from '../../messages/pt.json';
import ruMessages from '../../messages/ru.json';

const messages = {
    en: enMessages,
    zh: zhMessages,
    fr: frMessages,
    de: deMessages,
    es: esMessages,
    ko: koMessages,
    ja: jaMessages,
    pt: ptMessages,
    ru: ruMessages
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
