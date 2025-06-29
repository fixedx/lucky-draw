"use client";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCube,
  faThLarge,
  faCircle,
  faUsers,
  faTrophy,
  faLanguage,
  faFileExport,
  faDesktop,
  faCog,
  faCheck,
  faRocket,
  faLightbulb,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Home() {
  const t = useTranslations("Home");
  const params = useParams();
  const locale = params.locale as string;

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const scaleOnHover = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
  };

  const FeatureCard = ({
    icon,
    title,
    description,
    features,
    bestFor,
    buttonText,
    href,
    gradient,
  }: {
    icon: IconDefinition;
    title: string;
    description: string;
    features: string[];
    bestFor: string;
    buttonText: string;
    href: string;
    gradient: string;
  }) => (
    <motion.div
      className={`relative overflow-hidden rounded-2xl p-8 text-white shadow-2xl ${gradient}`}
      variants={fadeInUp}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative z-10">
        <div className="mb-6 flex items-center">
          <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <FontAwesomeIcon icon={icon} className="text-2xl" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{title}</h3>
            <p className="text-lg opacity-90">
              {t(`${href.replace("/", "")}Mode.subtitle`)}
            </p>
          </div>
        </div>

        <p className="mb-6 text-lg leading-relaxed opacity-90">{description}</p>

        <div className="mb-6">
          <h4 className="mb-3 text-lg font-semibold">{t("mainFeatures")}</h4>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <FontAwesomeIcon icon={faCheck} className="mr-2 text-sm" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h4 className="mb-2 text-lg font-semibold">
            {t("applicableScenarios")}
          </h4>
          <p className="text-sm opacity-90">{bestFor}</p>
        </div>

        <Link href={`/${locale}${href}`}>
          <motion.button
            className="w-full rounded-xl bg-white/20 px-6 py-3 font-semibold backdrop-blur-sm transition-all hover:bg-white/30"
            {...scaleOnHover}
          >
            {buttonText}
          </motion.button>
        </Link>
      </div>

      {/* Background decoration */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10"></div>
      <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10"></div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Language Switcher - positioned at top right */}
      <div className="absolute top-4 right-4 z-50">
        <LanguageSwitcher variant="light" />
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <motion.div
          className="mb-16 text-center"
          variants={staggerChildren}
          initial="initial"
          animate="animate"
        >
          <motion.div
            variants={fadeInUp}
            className="mb-4 inline-flex items-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-2 text-white"
          >
            <FontAwesomeIcon icon={faRocket} className="mr-2" />
            <span className="text-sm font-medium">
              {t("platformDescription")}
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="mb-6 text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
          >
            {t("title")}
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            {t("description")}
          </motion.p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          className="mb-16 grid gap-8 lg:grid-cols-3"
          variants={staggerChildren}
          initial="initial"
          animate="animate"
        >
          <FeatureCard
            icon={faCube}
            title={t("ballMode.title")}
            description={t("ballMode.description")}
            features={t.raw("ballMode.features") as string[]}
            bestFor={t("ballMode.bestFor")}
            buttonText={t("ballMode.startButton")}
            href="/ball"
            gradient="bg-gradient-to-br from-purple-600 to-indigo-700"
          />

          <FeatureCard
            icon={faThLarge}
            title={t("gridMode.title")}
            description={t("gridMode.description")}
            features={t.raw("gridMode.features") as string[]}
            bestFor={t("gridMode.bestFor")}
            buttonText={t("gridMode.startButton")}
            href="/grid"
            gradient="bg-gradient-to-br from-blue-600 to-cyan-700"
          />

          <FeatureCard
            icon={faCircle}
            title={t("wheelMode.title")}
            description={t("wheelMode.description")}
            features={t.raw("wheelMode.features") as string[]}
            bestFor={t("wheelMode.bestFor")}
            buttonText={t("wheelMode.startButton")}
            href="/wheel"
            gradient="bg-gradient-to-br from-red-600 to-orange-700"
          />
        </motion.div>

        {/* Common Features Section */}
        <motion.div
          className="mb-16 rounded-2xl bg-white p-8 shadow-xl"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-2 text-white">
              <FontAwesomeIcon icon={faLightbulb} className="mr-2" />
              <span className="text-sm font-medium">{t("coreAdvantages")}</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">
              {t("commonFeatures.title")}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {(t.raw("commonFeatures.features") as string[]).map(
              (feature, index) => {
                const icons = [
                  faLanguage,
                  faTrophy,
                  faUsers,
                  faFileExport,
                  faDesktop,
                  faCog,
                  faCheck,
                  faCheck,
                ];
                return (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3 rounded-lg bg-gray-50 p-4"
                    whileHover={{ scale: 1.02, backgroundColor: "#f0f9ff" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                      <FontAwesomeIcon
                        icon={icons[index]}
                        className="text-sm"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {feature}
                    </span>
                  </motion.div>
                );
              }
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
