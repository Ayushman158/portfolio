import { redirect } from 'next/navigation'

// FieldNote was the only thing here and has been taken down. Old links to
// /experiments land on the index, where the playground now lives.
export default function Experiments() {
  redirect('/')
}
