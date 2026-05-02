export const metadata = {
  title: 'Kizuku — Creative Process | Ayushman Bharadwaj',
  description: 'A design process journal for Kizuku, a wellness app for future anxiety. From spirit animal to interface — 4 stages, every decision documented.',
};

export default function KizukuLayout({ children }) {
  return (
    <div className="bg-[#FAFAFA] min-h-screen font-satoshi text-[#2C5228]">
      <style dangerouslySetInnerHTML={{ __html: `
        @font-face {
          font-family: 'Satoshi';
          src: url('/fonts/Satoshi-Variable.woff2') format('woff2');
          font-weight: 300 900;
          font-display: swap;
          font-style: normal;
        }
        .font-satoshi {
          font-family: 'Satoshi', sans-serif;
        }
      ` }} />
      {children}
    </div>
  );
}
