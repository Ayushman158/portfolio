export const metadata = {
    title: 'Hoychoy Cafe Case Study | Ayushman Bharadwaj',
    description: 'Detailed UX case study and frontend breakdown for the Hoychoy Cafe web application.',
}

export default function CaseStudyLayout({ children }) {
    return (
        <div className="bg-[#f8fafc] min-h-screen text-slate-800 selection:bg-blue-200">
            {children}
        </div>
    )
}
