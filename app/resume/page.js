import { redirect } from 'next/navigation'

// /resume opens the résumé PDF. This public copy leaves out the phone number;
// the full version (with phone) lives in ~/Downloads/resume-v2 and is sent
// on request. Rebuild it from resume.html there if the résumé changes.
export default function Resume() {
  redirect('/Ayushman_Bharadwaj_Resume.pdf')
}
