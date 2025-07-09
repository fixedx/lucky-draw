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
    title: "Lucky Draw System | Professional 3D & Grid Lottery Platform",
    description:
      "Professional multi-mode online lottery system featuring stunning 3D sphere animation and interactive grid layouts. Supports Excel import, customizable winner counts, prize management, and multi-language interface. Perfect for company events, annual meetings, team workshops, and marketing campaigns.",
    keywords: [
      "lucky draw system",
      "3D lottery animation",
      "grid lottery cards",
      "multi-mode lottery platform",
      "event drawing tool",
      "annual meeting draw",
      "random draw generator",
      "online drawing tool",
      "prize drawing",
      "raffle system",
      "Excel import lottery",
      "team workshop lottery",
      "interactive lottery cards",
      "professional drawing system",
      "lottery management platform",
    ],
  },
  zh: {
    title: "幸运抽奖系统 | 专业3D球体+网格卡片抽奖平台",
    description:
      "专业多模式在线抽奖系统，拥有惊艳的3D球体动画和交互式网格布局。支持Excel导入、自定义中奖人数、奖品管理和多语言界面。适用于公司活动、年会庆典、团队工作坊和营销活动。",
    keywords: [
      "幸运抽奖系统",
      "3D抽奖动画",
      "网格抽奖卡片",
      "多模式抽奖平台",
      "活动抽奖工具",
      "年会抽奖",
      "随机抽取生成器",
      "在线抽奖工具",
      "奖品抽取",
      "抽奖系统",
      "Excel导入抽奖",
      "团队工作坊抽奖",
      "交互式抽奖卡片",
      "专业抽奖系统",
      "抽奖管理平台",
    ],
  },
  fr: {
    title: "Système de Tirage au Sort | Plateforme 3D & Grille Professionnelle",
    description:
      "Système de tirage au sort multi-mode professionnel avec animation de sphère 3D époustouflante et mise en page de grille interactive. Prend en charge l'importation Excel, le nombre de gagnants personnalisable, la gestion des prix et l'interface multilingue. Parfait pour les événements d'entreprise, les réunions annuelles, les ateliers d'équipe et les campagnes marketing.",
    keywords: [
      "système de tirage au sort",
      "animation de loterie 3D",
      "cartes de loterie en grille",
      "plateforme de loterie multi-mode",
      "outil de tirage d'événement",
      "tirage de réunion annuelle",
      "générateur de tirage aléatoire",
      "outil de tirage en ligne",
      "tirage de prix",
      "système de tombola",
      "importation Excel loterie",
      "tirage atelier équipe",
      "cartes de loterie interactives",
      "système de tirage professionnel",
      "plateforme de gestion de loterie",
    ],
  },
  de: {
    title: "Glücksspiel-System | Professionelle 3D & Raster Lotterie-Plattform",
    description:
      "Professionelles Multi-Modus Online-Glücksspiel-System mit atemberaubender 3D-Kugel-Animation und interaktivem Raster-Layout. Unterstützt Excel-Import, anpassbare Gewinnerzahlen, Preisverwaltung und mehrsprachige Benutzeroberfläche. Perfekt für Firmenveranstaltungen, Jahresversammlungen, Team-Workshops und Marketing-Kampagnen.",
    keywords: [
      "Glücksspiel-System",
      "3D-Lotterie-Animation",
      "Raster-Lotterie-Karten",
      "Multi-Modus-Lotterie-Plattform",
      "Event-Ziehungstool",
      "Jahresversammlung-Ziehung",
      "Zufallsziehung-Generator",
      "Online-Ziehungstool",
      "Preisziehung",
      "Verlosungssystem",
      "Excel-Import-Lotterie",
      "Team-Workshop-Ziehung",
      "Interaktive Lotterie-Karten",
      "Professionelles Ziehungssystem",
      "Lotterie-Management-Plattform",
    ],
  },
  es: {
    title: "Sistema de Sorteo | Plataforma Profesional 3D & Cuadrícula",
    description:
      "Sistema de sorteo en línea multi-modo profesional con impresionante animación de esfera 3D y diseño de cuadrícula interactivo. Admite importación de Excel, número de ganadores personalizable, gestión de premios e interfaz multiidioma. Perfecto para eventos corporativos, reuniones anuales, talleres de equipo y campañas de marketing.",
    keywords: [
      "sistema de sorteo",
      "animación de lotería 3D",
      "tarjetas de lotería en cuadrícula",
      "plataforma de lotería multi-modo",
      "herramienta de sorteo de eventos",
      "sorteo de reunión anual",
      "generador de sorteo aleatorio",
      "herramienta de sorteo en línea",
      "sorteo de premios",
      "sistema de rifa",
      "importación Excel lotería",
      "sorteo taller equipo",
      "tarjetas de lotería interactivas",
      "sistema de sorteo profesional",
      "plataforma de gestión de lotería",
    ],
  },
  ko: {
    title: "행운 추첨 시스템 | 전문 3D & 그리드 추첨 플랫폼",
    description:
      "놀라운 3D 구 애니메이션과 인터랙티브 그리드 레이아웃을 갖춘 전문 멀티모드 온라인 추첨 시스템입니다. Excel 가져오기, 맞춤형 당첨자 수, 상품 관리 및 다국어 인터페이스를 지원합니다. 회사 이벤트, 연례 회의, 팀 워크숍 및 마케팅 캠페인에 완벽합니다.",
    keywords: [
      "행운 추첨 시스템",
      "3D 복권 애니메이션",
      "그리드 복권 카드",
      "멀티모드 복권 플랫폼",
      "이벤트 추첨 도구",
      "연례 회의 추첨",
      "무작위 추첨 생성기",
      "온라인 추첨 도구",
      "상품 추첨",
      "추첨 시스템",
      "Excel 가져오기 복권",
      "팀 워크숍 추첨",
      "인터랙티브 복권 카드",
      "전문 추첨 시스템",
      "복권 관리 플랫폼",
    ],
  },
  ja: {
    title:
      "ラッキードローシステム | プロフェッショナル3D&グリッド抽選プラットフォーム",
    description:
      "見事な3D球体アニメーションとインタラクティブなグリッドレイアウトを備えたプロフェッショナルマルチモードオンライン抽選システム。Excelインポート、カスタマイズ可能な当選者数、賞品管理、多言語インターフェースをサポート。企業イベント、年次会議、チームワークショップ、マーケティングキャンペーンに最適です。",
    keywords: [
      "ラッキードローシステム",
      "3D宝くじアニメーション",
      "グリッド宝くじカード",
      "マルチモード宝くじプラットフォーム",
      "イベント抽選ツール",
      "年次会議抽選",
      "ランダム抽選ジェネレーター",
      "オンライン抽選ツール",
      "賞品抽選",
      "抽選システム",
      "Excelインポート宝くじ",
      "チームワークショップ抽選",
      "インタラクティブ宝くじカード",
      "プロフェッショナル抽選システム",
      "宝くじ管理プラットフォーム",
    ],
  },
  pt: {
    title: "Sistema de Sorteio | Plataforma Profissional 3D & Grade",
    description:
      "Sistema de sorteio online multi-modo profissional com animação de esfera 3D deslumbrante e layout de grade interativo. Suporta importação do Excel, número de vencedores personalizável, gestão de prêmios e interface multilíngue. Perfeito para eventos corporativos, reuniões anuais, workshops de equipe e campanhas de marketing.",
    keywords: [
      "sistema de sorteio",
      "animação de loteria 3D",
      "cartões de loteria em grade",
      "plataforma de loteria multi-modo",
      "ferramenta de sorteio de eventos",
      "sorteio de reunião anual",
      "gerador de sorteio aleatório",
      "ferramenta de sorteio online",
      "sorteio de prêmios",
      "sistema de rifa",
      "importação Excel loteria",
      "sorteio workshop equipe",
      "cartões de loteria interativos",
      "sistema de sorteio profissional",
      "plataforma de gestão de loteria",
    ],
  },
  ru: {
    title: "Система Розыгрыша | Профессиональная 3D & Сеточная Платформа",
    description:
      "Профессиональная многорежимная онлайн-система розыгрыша с потрясающей 3D анимацией сферы и интерактивным сеточным макетом. Поддерживает импорт Excel, настраиваемое количество победителей, управление призами и многоязычный интерфейс. Идеально подходит для корпоративных мероприятий, ежегодных собраний, командных семинаров и маркетинговых кампаний.",
    keywords: [
      "система розыгрыша",
      "3D анимация лотереи",
      "сеточные карточки лотереи",
      "многорежимная лотерейная платформа",
      "инструмент розыгрыша мероприятий",
      "розыгрыш ежегодного собрания",
      "генератор случайного розыгрыша",
      "онлайн инструмент розыгрыша",
      "розыгрыш призов",
      "система лотереи",
      "импорт Excel лотерея",
      "розыгрыш командный семинар",
      "интерактивные карточки лотереи",
      "профессиональная система розыгрыша",
      "платформа управления лотереей",
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
      // 语言跳转链接已移除，因为URL结构已改变
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
