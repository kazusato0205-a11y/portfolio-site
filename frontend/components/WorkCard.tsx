"use client";

import { useState } from "react";
import Image from "next/image";

export type Work = {
  id: number;
  title: string;
  description: string;
  image: {
    id: number;
    url: string;
    filename: string;
  } | null;
  link: string | null;
};

type Section = { label: string; body: string };

// 説明文（"概要文\n■見出し\n本文..." 形式）を概要とセクションに分解する
function parseDescription(raw: string): { overview: string; sections: Section[] } {
  const text = (raw ?? "").replace(/\r\n/g, "\n").trim();
  const chunks = text.split(/\n(?=■)/);
  let overview = "";
  const sections: Section[] = [];

  for (const chunk of chunks) {
    if (chunk.startsWith("■")) {
      const nl = chunk.indexOf("\n");
      const label = (nl === -1 ? chunk : chunk.slice(0, nl)).replace(/^■/, "").trim();
      const body = (nl === -1 ? "" : chunk.slice(nl + 1)).trim();
      sections.push({ label, body });
    } else if (chunk.trim()) {
      overview = chunk.trim();
    }
  }
  return { overview, sections };
}

function TeamBadge({ value }: { value: string }) {
  const solo = value.includes("個人");
  return (
    <span
      className={`w-fit rounded-full px-2 py-0.5 text-xs font-semibold ${
        solo
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
          : "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
      }`}
    >
      {value}
    </span>
  );
}

function SectionBlock({ section }: { section: Section }) {
  const lines = section.body.split("\n").filter(Boolean);
  const isList = lines.length > 0 && lines.every((l) => l.startsWith("・"));

  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-2.5">
      <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-blue-600">
        {section.label}
      </p>
      {isList ? (
        <ul className="flex flex-col gap-1 text-[13px] leading-relaxed text-slate-600">
          {lines.map((l, i) => (
            <li key={i} className="flex gap-1.5">
              <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-blue-400" />
              <span>{l.replace(/^・/, "")}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="whitespace-pre-line text-[13px] leading-relaxed text-slate-600">
          {section.body}
        </p>
      )}
    </div>
  );
}

export default function WorkCard({ work }: { work: Work }) {
  const [open, setOpen] = useState(false);
  const { overview, sections } = parseDescription(work.description);
  const teamValue = sections.find((s) => s.label === "開発体制")?.body;
  const detailSections = sections.filter((s) => s.label !== "開発体制");

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      {work.image ? (
        <div className="relative h-44 w-full overflow-hidden">
          <Image
            src={work.image.url}
            alt={work.title}
            fill
            className="object-cover object-top"
          />
        </div>
      ) : (
        <div className="flex h-44 w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50 text-sm text-slate-300">
          No Image
        </div>
      )}

      {/* タイトル行（クリックで開閉） */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-slate-50"
      >
        <span className="flex flex-col gap-1.5">
          <span className="text-base font-bold text-slate-900">{work.title}</span>
          {teamValue && <TeamBadge value={teamValue} />}
        </span>
        <svg
          className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4">
          {overview && (
            <p className="text-sm leading-relaxed text-slate-600">{overview}</p>
          )}

          {detailSections.map((s) => (
            <SectionBlock key={s.label} section={s} />
          ))}

          {work.link && (
            <a
              href={work.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 pt-1 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-500"
            >
              リンクを見る
              <span aria-hidden>→</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
