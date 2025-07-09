import { Metadata } from "next";

const ballMetadata: Record<
  string,
  {
    title: string;
    description: string;
    keywords: string[];
  }
> = {
  en: {
    title: "3D Ball Lucky Draw | Professional Event Drawing Animation",
    description:
      "Experience stunning 3D sphere animation for lucky draws and event drawings. Professional lottery system with realistic ball physics, customizable participants, and exciting winner animations. Perfect for corporate events, galas, and celebrations.",
    keywords: [
      "3D ball lottery",
      "sphere animation",
      "lucky draw ball",
      "3D event drawing",
      "ball physics simulation",
      "animated lottery system",
      "3D prize drawing",
      "sphere raffle",
    ],
  },
  zh: {
    title: "3D球体幸运抽奖 | 专业活动抽奖动画",
    description:
      "体验惊艳的3D球体动画幸运抽奖和活动抽取。专业抽奖系统配备真实的球体物理效果、可自定义参与者和激动人心的中奖动画。完美适用于企业活动、庆典和庆祝活动。",
    keywords: [
      "3D球体抽奖",
      "球体动画",
      "幸运抽奖球",
      "3D活动抽取",
      "球体物理模拟",
      "动画抽奖系统",
      "3D奖品抽取",
      "球体抽奖",
    ],
  },
  fr: {
    title: "Tirage 3D Boule | Animation Professionnelle pour Événements",
    description:
      "Découvrez une animation de sphère 3D époustouflante pour les tirages au sort et les tirages d'événements. Système de loterie professionnel avec physique de boule réaliste, participants personnalisables et animations de gagnants passionnantes.",
    keywords: [
      "loterie boule 3D",
      "animation sphère",
      "tirage boule chance",
      "tirage événement 3D",
      "simulation physique boule",
      "système loterie animé",
      "tirage prix 3D",
      "tombola sphère",
    ],
  },
  de: {
    title: "3D Ball Glücksspiel | Professionelle Event-Drawing-Animation",
    description:
      "Erleben Sie atemberaubende 3D-Kugel-Animation für Glücksspiele und Event-Ziehungen. Professionelles Lotterie-System mit realistischer Kugelphysik, anpassbaren Teilnehmern und aufregenden Gewinner-Animationen.",
    keywords: [
      "3D Kugel Lotterie",
      "Kugel Animation",
      "Glücksspiel Kugel",
      "3D Event Ziehung",
      "Kugel Physik Simulation",
      "animiertes Lotterie System",
      "3D Preis Ziehung",
      "Kugel Verlosung",
    ],
  },
  es: {
    title: "Sorteo 3D Pelota | Animación Profesional para Eventos",
    description:
      "Experimenta una impresionante animación de esfera 3D para sorteos y sorteos de eventos. Sistema de lotería profesional con física de pelota realista, participantes personalizables y emocionantes animaciones de ganadores.",
    keywords: [
      "lotería pelota 3D",
      "animación esfera",
      "sorteo pelota suerte",
      "sorteo evento 3D",
      "simulación física pelota",
      "sistema lotería animado",
      "sorteo premio 3D",
      "rifa esfera",
    ],
  },
  ko: {
    title: "3D 볼 행운 추첨 | 전문 이벤트 추첨 애니메이션",
    description:
      "행운 추첨 및 이벤트 추첨을 위한 놀라운 3D 구체 애니메이션을 경험하십시오. 현실적인 볼 물리학, 사용자 정의 가능한 참가자 및 흥미진진한 당첨자 애니메이션을 갖춘 전문 복권 시스템입니다.",
    keywords: [
      "3D 볼 복권",
      "구체 애니메이션",
      "행운 추첨 볼",
      "3D 이벤트 추첨",
      "볼 물리 시뮬레이션",
      "애니메이션 복권 시스템",
      "3D 상품 추첨",
      "구체 추첨",
    ],
  },
  ja: {
    title: "3Dボール抽選 | プロフェッショナルイベント抽選アニメーション",
    description:
      "ラッキードローとイベント抽選のための見事な3D球体アニメーションを体験してください。リアルなボール物理学、カスタマイズ可能な参加者、エキサイティングな当選者アニメーションを備えたプロフェッショナル抽選システム。",
    keywords: [
      "3Dボール抽選",
      "球体アニメーション",
      "ラッキードローボール",
      "3Dイベント抽選",
      "ボール物理シミュレーション",
      "アニメーション抽選システム",
      "3D賞品抽選",
      "球体くじ",
    ],
  },
  pt: {
    title: "Sorteio 3D Bola | Animação Profissional para Eventos",
    description:
      "Experimente uma animação de esfera 3D deslumbrante para sorteios e sorteios de eventos. Sistema de loteria profissional com física de bola realista, participantes personalizáveis e animações de vencedores emocionantes.",
    keywords: [
      "loteria bola 3D",
      "animação esfera",
      "sorteio bola sorte",
      "sorteio evento 3D",
      "simulação física bola",
      "sistema loteria animado",
      "sorteio prêmio 3D",
      "rifa esfera",
    ],
  },
  ru: {
    title: "3D Мяч Розыгрыш | Профессиональная Анимация для Мероприятий",
    description:
      "Испытайте потрясающую 3D анимацию сферы для розыгрышей и розыгрышей мероприятий. Профессиональная лотерейная система с реалистичной физикой мяча, настраиваемыми участниками и захватывающими анимациями победителей.",
    keywords: [
      "3D мяч лотерея",
      "анимация сферы",
      "розыгрыш мяч удача",
      "розыгрыш мероприятие 3D",
      "симуляция физика мяча",
      "анимированная лотерея система",
      "розыгрыш приз 3D",
      "сфера лотерея",
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = ballMetadata[locale] || ballMetadata.en;

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
      url: `https://luckydraw.pub/${locale}/ball`,
      type: "website",
      images: [
        {
          url: "/images/og-ball-3d.webp",
          width: 1200,
          height: 630,
          alt: "3D Ball Lucky Draw Animation Screenshot",
          type: "image/webp",
        },
      ],
    },
    alternates: {
      canonical: `https://luckydraw.pub/${locale}/ball`,
      // 语言跳转链接已移除，因为URL结构已改变
    },
  };
}

export default function BallLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
