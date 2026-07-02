export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Layout diubah ke full-screen agar split-screen bisa bekerja
  return <>{children}</>;
}