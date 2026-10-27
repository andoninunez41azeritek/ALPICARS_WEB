"use client";

import { useCallback, useEffect, useState } from "react";
import { useSite } from "./SiteProvider";
import { WhatsAppIcon } from "./Icons";
import OfferDialog from "./OfferDialog";
import { myRefCode, track } from "../lib/track";
import { db, hasSupabase } from "../lib/supabase";

// Barra para descargar el informe en PDF y compartirlo (WhatsApp, Telegram, enlace, otras apps).
// El PDF se crea en el navegador con lib/pdf.js (se descarga directamente, sin diálogo de impresión).
// En el móvil también se puede enviar el PDF como archivo. Después de descargarlo aparece la oferta para registrarse.
// makeDoc: función que devuelve { blocks, fileName, title } con el contenido del informe.

export default function ShareBar({ shareText, source, makeDoc, kind }) {
  const { t, session, profile, openLogin } = useSite();
  const s = t.share;
  const [copied, setCopied] = useState(false);
  const [offer, setOffer] = useState(false);
  const [busy, setBusy] = useState(false);
  const [canFiles, setCanFiles] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    try {
      const f = new File([new Uint8Array(1)], "a.pdf", { type: "application/pdf" });
      setCanFiles(Boolean(navigator.canShare && navigator.canShare({ files: [f] })));
    } catch {
      setCanFiles(false);
    }
  }, []);

  // Enlace para compartir con el código personal de quien comparte (programa de referidos):
  // si alguien pide presupuesto desde ese enlace, a AlpiCars le llega "Recomendado por el código ...".
  const url = () => {
    if (typeof window === "undefined") return "";
    const u = new URL(window.location.href);
    const code = profile?.ref_code || myRefCode();
    if (code) u.searchParams.set("ref", code);
    return u.toString();
  };
  const msg = () => `${shareText} ${url()}`;

  // Informe para guardar en la cuenta del cliente (enlace sin el código de recomendación)
  const report = () => {
    if (typeof window === "undefined" || !kind) return null;
    const u = new URL(window.location.href);
    u.searchParams.delete("ref");
    return { kind, title: (makeDoc ? makeDoc().title : document.title).slice(0, 160), url: (u.pathname + u.search).slice(0, 600) };
  };

  const onSave = async () => {
    const r = report();
    if (!r) return;
    if (!session) {
      try {
        localStorage.setItem("alpicars-pending-report", JSON.stringify(r));
      } catch {
        /* nada */
      }
      openLogin("signup");
      return;
    }
    try {
      await db("saved_reports", { method: "POST", body: r, prefer: "return=minimal" });
      setSavedMsg(s.saved);
      track("report_save", { kind });
    } catch {
      setSavedMsg(s.saveError);
    }
  };

  // Crea el PDF (la librería se carga solo en este momento)
  const makePdf = async () => {
    const { buildPdf, downloadPdf, sharePdf } = await import("../lib/pdf");
    const d = makeDoc();
    const bytes = await buildPdf(d.blocks, { title: d.title, url: url() });
    return { bytes, fileName: d.fileName, downloadPdf, sharePdf };
  };

  const closeOffer = useCallback(() => setOffer(false), []);

  const onPdf = async () => {
    if (!makeDoc) {
      window.print();
      return;
    }
    setBusy(true);
    try {
      const { bytes, fileName, downloadPdf } = await makePdf();
      downloadPdf(bytes, fileName);
      track("pdf_download", { source });
      setTimeout(() => setOffer(true), 600);
    } catch {
      window.print(); // si algo falla, al menos se puede guardar con la impresión del navegador
    } finally {
      setBusy(false);
    }
  };

  const onSendPdf = async () => {
    setBusy(true);
    try {
      const { bytes, fileName, sharePdf } = await makePdf();
      const shared = await sharePdf(bytes, fileName, `${shareText} ${url()}`);
      if (shared) track("pdf_share", { source });
      setTimeout(() => setOffer(true), 600);
    } catch {
      /* el usuario canceló */
    } finally {
      setBusy(false);
    }
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url());
      track("share_click", { channel: "copy", source });
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt(s.copy, url());
    }
  };

  const onNative = async () => {
    try {
      await navigator.share({ title: "AlpiCars", text: shareText, url: url() });
      track("share_click", { channel: "native", source });
    } catch {
      /* el usuario canceló */
    }
  };

  const canNative = typeof navigator !== "undefined" && typeof navigator.share === "function";

  return (
    <div className="sharebar no-print">
      <div className="share-main">
        <button type="button" className="btn btn-accent" onClick={onPdf} disabled={busy} aria-busy={busy}>
          {busy ? s.making : s.pdf}
        </button>
        {hasSupabase && kind && (
          <button type="button" className="btn btn-ghost" onClick={onSave} disabled={Boolean(savedMsg)}>
            {savedMsg || s.save}
          </button>
        )}
        {canFiles && makeDoc && (
          <button type="button" className="btn btn-ghost" onClick={onSendPdf} disabled={busy}>
            {s.sendPdf}
          </button>
        )}
      </div>
      <div className="share-group" role="group" aria-label={s.title}>
        <a className="share-btn share-wa" href={`https://wa.me/?text=${encodeURIComponent(msg())}`} target="_blank" rel="noopener noreferrer" onClick={(e) => {
          e.currentTarget.href = `https://wa.me/?text=${encodeURIComponent(msg())}`;
          track("share_click", { channel: "whatsapp", source });
        }}>
          <WhatsAppIcon width="18" height="18" />
          {s.whatsapp}
        </a>
        <a
          className="share-btn"
          href="https://t.me/share/url"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.currentTarget.href = `https://t.me/share/url?url=${encodeURIComponent(url())}&text=${encodeURIComponent(shareText)}`;
            track("share_click", { channel: "telegram", source });
          }}
        >
          {s.telegram}
        </a>
        <button type="button" className="share-btn" onClick={onCopy} aria-live="polite">
          {copied ? s.copied : s.copy}
        </button>
        {canNative && (
          <button type="button" className="share-btn" onClick={onNative}>
            {s.more}
          </button>
        )}
      </div>
      <OfferDialog open={offer} onClose={closeOffer} source={source} pendingReport={offer ? report() : null} />
    </div>
  );
}
