import { siteConfig } from '@/config/site'
import { describeEventTime, formatEventDate } from '@/lib/date/event'

function escapeHtml(text: string): string {
  return text.replace(
    /[&<>"']/g,
    (char) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] ?? char,
  )
}

/** Names typed in all caps or all lowercase, tidied for the printed list. */
export function tidyName(name: string): string {
  const lowerWords = new Set(['de', 'da', 'do', 'das', 'dos', 'e'])
  return name
    .trim()
    .split(/\s+/)
    .map((word, index) => {
      const lower = word.toLocaleLowerCase('pt-BR')
      if (index > 0 && lowerWords.has(lower)) return lower
      return lower.charAt(0).toLocaleUpperCase('pt-BR') + lower.slice(1)
    })
    .join(' ')
}

/** A printable page for the doorman: big letters and a box to tick for each guest. */
export function buildDoormanHtml(names: string[]): string {
  const { event, coupleNames } = siteConfig
  const when = event.date
    ? `${formatEventDate(event.date)}${event.time ? `, ${describeEventTime(event.time).toLowerCase()}` : ''}`
    : ''
  const rows = names
    .map(
      (name, index) =>
        `<li><span class="box"></span><span class="n">${index + 1}.</span><span class="name">${escapeHtml(tidyName(name))}</span></li>`,
    )
    .join('')

  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<title>Lista de convidados - ${escapeHtml(coupleNames.join(' e '))}</title>
<style>
  @page { size: A4; margin: 14mm 16mm; }
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color: #1f2b47; margin: 0; }
  h1 { font-size: 26pt; margin: 0 0 4pt; }
  .meta { color: #63656c; font-size: 13pt; margin: 0 0 12pt; }
  ol { list-style: none; padding: 0; margin: 0; }
  li { display: flex; align-items: center; gap: 10pt; padding: 6pt 0; border-bottom: 1px solid #d6d5d5; break-inside: avoid; }
  .box { width: 15pt; height: 15pt; border: 1.6pt solid #1f2b47; flex: none; }
  .n { width: 26pt; text-align: right; color: #7e8087; font-size: 13pt; flex: none; }
  .name { font-size: 18pt; font-weight: bold; }
</style></head>
<body>
  <h1>Lista de convidados</h1>
  <p class="meta">Chá de casa nova · ${escapeHtml(coupleNames.join(' e '))}${when ? ` · ${escapeHtml(when)}` : ''}<br>
  ${names.length} ${names.length === 1 ? 'convidado' : 'convidados'} · em ordem alfabética</p>
  <ol>${rows}</ol>
  <script>window.onload = () => { window.focus(); window.print(); }</script>
</body></html>`
}

/** Opens the list in a new tab and the print dialog, where "Salvar como PDF" is an option. */
export function printDoormanList(names: string[]): boolean {
  const tab = window.open('', '_blank')
  if (!tab) return false
  tab.document.open()
  tab.document.write(buildDoormanHtml(names))
  tab.document.close()
  return true
}
