"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import ParticipantModal from "../modals/ParticipantModal";

export default function FloatingParticipantButton() {
  const [showModal, setShowModal] = useState(false);
  const t = useTranslations("LuckyDraw");

  const handleClick = useCallback(() => {
    setShowModal(true);
  }, []);

  return (
    <>
      <button
        onClick={handleClick}
        className="bg-gradient-to-r from-green-600 to-cyan-700 text-white p-3 rounded-full shadow-lg hover:from-green-700 hover:to-cyan-800 transition-all z-50"
        title={t("participants")}
      >
        <FontAwesomeIcon icon={faUsers} />
      </button>

      <ParticipantModal showModal={showModal} setShowModal={setShowModal} />
    </>
  );
}
