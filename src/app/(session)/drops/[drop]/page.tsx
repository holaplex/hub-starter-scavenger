import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import Drop from "./Drop";

export default async function DropPage({
  params: { drop },
}: {
  params: { drop: string };
}) {
  const session = await getServerSession(authOptions);

  return <Drop session={session} drop={drop} />;
}
