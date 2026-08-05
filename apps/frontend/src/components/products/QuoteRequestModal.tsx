"use client";

import { useState } from "react";
import { X, CheckCircle, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
}

export function QuoteRequestModal({ isOpen, onClose, productName = "" }: Props) {
  const { language, t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://formsubmit.co/ajax/sasuhalill@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          "_subject": `HALIL Distribution - Nouvelle demande de devis de ${name}`,
          "_template": "box", // Format premium encadré et propre
          "_captcha": "false", // Pas de captcha redirect embêtant pour l'utilisateur
          "Client": name,
          "Entreprise": company || "Non spécifiée",
          "Adresse E-mail": email,
          "Téléphone": phone,
          "Produit Demandé": productName || "Demande de catalogue général",
          "Message du Client": message || "Aucun message particulier"
        })
      });

      if (response.ok) {
        setSuccess(true);
        setName("");
        setEmail("");
        setPhone("");
        setCompany("");
        setMessage("");
      } else {
        alert(language === "fr" ? "Erreur lors de l'envoi de la demande. Veuillez réessayer." : "İstek gönderilirken hata oluştu. Lütfen tekrar deneyin.");
      }
    } catch {
      alert(language === "fr" ? "Erreur réseau. Vérifiez votre connexion." : "Ağ hatası. Bağlantınızı kontrol edin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full border border-gray-150 dark:border-slate-800 overflow-hidden text-left relative transition-all duration-200 animate-in fade-in zoom-in-95 transition-colors duration-300">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#ebc834] dark:bg-slate-950 text-slate-900 dark:text-white flex justify-between items-center border-b border-gray-200 dark:border-slate-800">
          <h3 className="font-bold text-sm tracking-wider uppercase">
            {t("modal.quote_title")}
          </h3>
          <button 
            type="button"
            onClick={onClose} 
            className="text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 p-1 cursor-pointer hover:bg-black/10 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form or Success State */}
        {success ? (
          <div className="p-8 text-center space-y-4 flex flex-col items-center">
            <CheckCircle className="text-green-500 w-16 h-16 animate-bounce" />
            <h4 className="text-xl font-bold text-gray-800 dark:text-white">
              {t("modal.success_title")}
            </h4>
            <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed max-w-sm">
              {t("modal.success_desc")}
            </p>
            <button
              type="button"
              onClick={() => {
                setSuccess(false);
                onClose();
              }}
              className="mt-6 bg-[#ebc834] hover:bg-[#dfca70] dark:bg-amber-400 dark:hover:bg-amber-500 dark:text-slate-950 text-slate-900 font-bold px-6 py-2.5 rounded-lg shadow transition-colors cursor-pointer"
            >
              {language === "fr" ? "Fermer" : "Kapat"}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-slate-850 dark:text-slate-200">
            
            {productName && (
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 rounded-lg p-3 text-xs font-semibold text-amber-800 dark:text-amber-300">
                {language === "fr" ? "Produit sélectionné : " : "Seçilen ürün: "} <span className="font-bold text-amber-950 uppercase">{productName}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-600 dark:text-slate-400">{t("modal.full_name")} *</label>
                <input
                  type="text"
                  required
                  placeholder={t("modal.placeholder_name")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ebc834] text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-600 dark:text-slate-400">{language === "fr" ? "Nom de l'Entreprise" : "Şirket Adı"}</label>
                <input
                  type="text"
                  placeholder={language === "fr" ? "Ex: Resto de la Place" : "Ör: Merkez Restoranı"}
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full border border-gray-300 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ebc834] text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-600 dark:text-slate-400">{t("modal.email")} *</label>
                <input
                  type="email"
                  required
                  placeholder={t("modal.placeholder_email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ebc834] text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-600 dark:text-slate-400">{t("modal.phone")} *</label>
                <input
                  type="text"
                  required
                  placeholder={t("modal.placeholder_phone")}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-gray-300 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ebc834] text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-600 dark:text-slate-400">{t("modal.message")}</label>
              <textarea
                placeholder={t("modal.placeholder_message")}
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border border-gray-300 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ebc834] text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800"
              />
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-gray-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold cursor-pointer"
              >
                {language === "fr" ? "Annuler" : "İptal"}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-[#006680] hover:bg-[#008099] disabled:bg-slate-400 text-white rounded-lg text-sm font-bold shadow flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                <span>{loading ? t("modal.btn_sending") : t("modal.btn_submit")}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
