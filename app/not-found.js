import Link from 'next/link'

export const metadata = { title: 'off the map. | Ayushman Bharadwaj' }

export default function NotFound() {
  return (
    <main className="measure min-h-screen pb-28 pt-20 sm:pt-28 lg:pt-36">
      <h1 className="display">off the map.</h1>
      <p className="mt-8">
        <Link href="/" className="btn-primary">back to the water</Link>
      </p>
    </main>
  )
}
