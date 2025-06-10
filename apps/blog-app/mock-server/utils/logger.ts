import type { IncomingHttpHeaders } from 'node:http'

export function logRequest(
  method: string,
  url: string,
  headers: IncomingHttpHeaders,
): void {
  const GREEN_BACKGROUND = '\x1b[42m'
  const BOLD_TEXT = '\x1b[1m'
  const RESET_COLOR = '\x1b[0m'

  console.log(`${GREEN_BACKGROUND}${BOLD_TEXT}Mock Server${RESET_COLOR}:`)
  console.log(`method: ${method}`)
  console.log(`url: ${url}`)
  console.log(`headers: ${JSON.stringify(headers, null, 2)}`)
}
