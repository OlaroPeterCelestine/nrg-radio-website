export default function SportsLiveLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="sports-live-page-layout" style={{ paddingBottom: 0 }}>
      {children}
    </div>
  )
}
