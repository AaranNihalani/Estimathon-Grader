'use client'

export default function RulesPage() {
  const pdfUrl = '/api/rules-pdf'
  return (
    <div className="mt-6">
      <div className="glass p-6">
        <h1 className="text-2xl font-semibold">How to Play</h1>
        <p className="text-white/60 text-sm mt-1">
          Official rules are displayed below. If your browser can’t embed PDFs, use the download link.
        </p>
        <div className="mt-4 h-[75vh]">
          <object data={pdfUrl} type="application/pdf" className="w-full h-full rounded-lg border border-white/10">
            <iframe src={pdfUrl} className="w-full h-full" />
          </object>
        </div>
        <div className="mt-3 text-sm">
          <a className="text-brand-400 hover:text-brand-300 underline" href={pdfUrl} target="_blank" rel="noreferrer">
            Open rules PDF in a new tab
          </a>
        </div>
      </div>
    </div>
  )
}
