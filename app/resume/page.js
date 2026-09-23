import { redirect } from 'next/navigation'

// The résumé became the About page. It returns later as a download; until
// then, anyone holding an old /resume link lands on the same content.
export default function Resume() {
  redirect('/about')
}
