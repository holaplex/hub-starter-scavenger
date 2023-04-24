import Session from "./Session";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import UserSource from "@/modules/user";
import holaplex from "@/modules/holaplex";
import db from "@/modules/db";

const userSource = new UserSource(holaplex, db);

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  const me = await userSource.get(session?.user?.email);

  return <Session me={me}>{children}</Session>;
}
