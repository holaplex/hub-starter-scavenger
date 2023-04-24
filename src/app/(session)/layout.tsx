import Session from "./Session";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Session>{children}</Session>;
}
