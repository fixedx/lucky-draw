import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { Metadata } from "next";

const localeMetadata: Record<
  string,
  {
    title: string;
    description: string;
    keywords: string[];
  }
> = {
  en: {
    title: "Lucky Draw System | Professional 3D Event Drawing Tool",
    description:
      "Professional online lucky draw system with stunning 3D sphere animation. Supports customized participant lists, winner counts and prize settings. Perfect for company events, marketing campaigns, annual meetings and celebrations. Free, multilingual and easy to use.",
    keywords: [
      "lucky draw system",
      "3D lottery animation",
      "event drawing tool",
      "annual meeting draw",
      "random draw generator",
      "online drawing tool",
      "prize drawing",
      "raffle system",
    ],
  },
  zh: {
    title: "幸运抽奖系统 | 专业3D活动抽奖工具",
    description:
      "专业的在线幸运抽奖系统，具有惊艳的3D球体动画效果。支持自定义参与者列表、中奖人数和奖项设置。适用于公司活动、营销活动、年会庆典等场合。免费、多语言、易于使用。",
    keywords: [
      "幸运抽奖系统",
      "3D抽奖动画",
      "活动抽奖工具",
      "年会抽奖",
      "随机抽取生成器",
      "在线抽奖工具",
      "奖品抽取",
      "抽奖系统",
    ],
  },
  fr: {
    title: "Système de Tirage au Sort | Outil Professionnel 3D pour Événements",
    description:
      "Système professionnel de tirage au sort en ligne avec une animation de sphère 3D époustouflante. Prend en charge les listes de participants personnalisées, le nombre de gagnants et les paramètres de prix. Parfait pour les événements d'entreprise, les campagnes marketing, les réunions annuelles et les célébrations.",
    keywords: [
      "système de tirage au sort",
      "animation de loterie 3D",
      "outil de tirage d'événement",
      "tirage de réunion annuelle",
      "générateur de tirage aléatoire",
      "outil de tirage en ligne",
      "tirage de prix",
      "système de tombola",
    ],
  },
  de: {
    title: "Glücksspiel-System | Professionelles 3D Event-Ziehungstool",
    description:
      "Professionelles Online-Glücksspiel-System mit atemberaubender 3D-Kugel-Animation. Unterstützt angepasste Teilnehmerlisten, Gewinnerzahlen und Preiseinstellungen. Perfekt für Firmenveranstaltungen, Marketing-Kampagnen, Jahresversammlungen und Feiern.",
    keywords: [
      "Glücksspiel-System",
      "3D-Lotterie-Animation",
      "Event-Ziehungstool",
      "Jahresversammlung-Ziehung",
      "Zufallsziehung-Generator",
      "Online-Ziehungstool",
      "Preisziehung",
      "Verlosungssystem",
    ],
  },
  es: {
    title: "Sistema de Sorteo | Herramienta Profesional 3D para Eventos",
    description:
      "Sistema profesional de sorteo en línea con una impresionante animación de esfera 3D. Admite listas de participantes personalizadas, recuentos de ganadores y configuraciones de premios. Perfecto para eventos corporativos, campañas de marketing, reuniones anuales y celebraciones.",
    keywords: [
      "sistema de sorteo",
      "animación de lotería 3D",
      "herramienta de sorteo de eventos",
      "sorteo de reunión anual",
      "generador de sorteo aleatorio",
      "herramienta de sorteo en línea",
      "sorteo de premios",
      "sistema de rifa",
    ],
  },
  ko: {
    title: "행운 추첨 시스템 | 전문 3D 이벤트 추첨 도구",
    description:
      "놀라운 3D 구 애니메이션이 있는 전문 온라인 행운 추첨 시스템입니다. 맞춤형 참가자 목록, 당첨자 수 및 상품 설정을 지원합니다. 회사 이벤트, 마케팅 캠페인, 연례 회의 및 축하 행사에 완벽합니다.",
    keywords: [
      "행운 추첨 시스템",
      "3D 복권 애니메이션",
      "이벤트 추첨 도구",
      "연례 회의 추첨",
      "무작위 추첨 생성기",
      "온라인 추첨 도구",
      "상품 추첨",
      "추첨 시스템",
    ],
  },
  ja: {
    title: "ラッキードローシステム | プロフェッショナル3Dイベント抽選ツール",
    description:
      "見事な3D球体アニメーションを備えたプロフェッショナルなオンラインラッキードローシステム。カスタマイズされた参加者リスト、当選者数、賞品設定をサポート。企業イベント、マーケティングキャンペーン、年次会議、お祝いに最適です。",
    keywords: [
      "ラッキードローシステム",
      "3D宝くじアニメーション",
      "イベント抽選ツール",
      "年次会議抽選",
      "ランダム抽選ジェネレーター",
      "オンライン抽選ツール",
      "賞品抽選",
      "抽選システム",
    ],
  },
  pt: {
    title: "Sistema de Sorteio | Ferramenta Profissional 3D para Eventos",
    description:
      "Sistema profissional de sorteio online com animação de esfera 3D deslumbrante. Suporta listas de participantes personalizadas, contagens de vencedores e configurações de prêmios. Perfeito para eventos corporativos, campanhas de marketing, reuniões anuais e celebrações.",
    keywords: [
      "sistema de sorteio",
      "animação de loteria 3D",
      "ferramenta de sorteio de eventos",
      "sorteio de reunião anual",
      "gerador de sorteio aleatório",
      "ferramenta de sorteio online",
      "sorteio de prêmios",
      "sistema de rifa",
    ],
  },
  ru: {
    title: "Система Розыгрыша | Профессиональный 3D Инструмент для Мероприятий",
    description:
      "Профессиональная онлайн-система розыгрыша с потрясающей 3D анимацией сферы. Поддерживает настраиваемые списки участников, количество победителей и настройки призов. Идеально подходит для корпоративных мероприятий, маркетинговых кампаний, ежегодных собраний и празднований.",
    keywords: [
      "система розыгрыша",
      "3D анимация лотереи",
      "инструмент розыгрыша мероприятий",
      "розыгрыш ежегодного собрания",
      "генератор случайного розыгрыша",
      "онлайн инструмент розыгрыша",
      "розыгрыш призов",
      "система лотереи",
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = localeMetadata[locale] || localeMetadata.en;

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: meta.title,
      description: meta.description,
      locale:
        locale === "zh"
          ? "zh_CN"
          : locale === "pt"
          ? "pt_BR"
          : `${locale}_${locale.toUpperCase()}`,
      url: `https://luckydraw.pub/${locale}`,
    },
    alternates: {
      canonical: `https://luckydraw.pub/${locale}`,
      languages: {
        en: "https://luckydraw.pub/en",
        "zh-CN": "https://luckydraw.pub/zh",
        fr: "https://luckydraw.pub/fr",
        de: "https://luckydraw.pub/de",
        es: "https://luckydraw.pub/es",
        ko: "https://luckydraw.pub/ko",
        ja: "https://luckydraw.pub/ja",
        "pt-BR": "https://luckydraw.pub/pt",
        ru: "https://luckydraw.pub/ru",
      },
    },
  };
}

export function generateStaticParams() {
  return [
    { locale: "en" },
    { locale: "zh" },
    { locale: "fr" },
    { locale: "de" },
    { locale: "es" },
    { locale: "ko" },
    { locale: "ja" },
    { locale: "pt" },
    { locale: "ru" },
  ];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  console.log("Layout locale:", locale);

  if (!locale) {
    console.log("Locale not found in params");
    notFound();
  }

  let messages;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch {
    console.log("Failed to load messages for locale:", locale);
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="min-h-screen flex flex-col">{children}</div>
    </NextIntlClientProvider>
  );
}
