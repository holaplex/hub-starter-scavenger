"use client";

import Image from "next/image";
import Link from "next/link";
import { Collector } from "@/graphql.types";
import useMe from "@/hooks/useMe";
import { usePathname } from "next/navigation";

interface GetMeData {
  me: Collector | undefined;
}

export default function Session({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const meQuery = useMe();
  const me = meQuery.data?.me;

  return (
    <>
      <div className="flex w-full justify-between items-center py-4">
        <Link href="/">
          <Image src="/img/logo.png" alt="site logo" width={199} height={18} />
        </Link>
        {meQuery.loading ? (
          <div className="bg-contrast h-14 w-36 animate-pulse rounded-full" />
        ) : me ? (
          <button className="text-cta font-bold border-2 rounded-full border-cta py-3 px-6 flex gap-2">
            <img className="w-6 h-6 rounded-full" src={me?.image as string} />
            <span>{me?.name}</span>
          </button>
        ) : (
          <>
            <div className="flex gap-1 md:gap-4 items-center">
              <Link
                href={`/login?return_to=${pathname}`}
                className="text-cta font-medium md:font-bold md:border-2 md:rounded-full md:border-cta md:py-3 md:px-6"
              >
                Log in
              </Link>
              <span className="text-gray-300 font-medium md:hidden">or</span>
              <Link
                href={`/login?return_to=${pathname}`}
                className="text-cta font-medium md:text-backdrop md:bg-cta md:rounded-full md:font-bold md:py-3 md:px-6"
              >
                Sign up
              </Link>
            </div>
          </>
        )}
      </div>
      {children}
    </>
  );
}
