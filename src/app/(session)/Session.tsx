"use client";

import MeProvider from "@/providers/MeProvider";
import { User } from "@/graphql.types";
import Image from "next/image";
import Link from "next/link";
export default function Session({
  children,
  me,
}: {
  children: React.ReactNode;
  me: User | undefined;
}) {
  return (
    <MeProvider me={me}>
      <div className="flex w-full justify-between items-center py-4">
        <Link href="/">
          <Image src="/img/logo.png" alt="site logo" width={199} height={18} />
        </Link>
        {!me ? (
          <>
            <div className="flex gap-1 md:gap-4 items-center">
              <Link
                href="/login"
                className="text-cta font-medium md:font-bold md:border-2 md:rounded-full md:border-cta md:py-3 md:px-6"
              >
                Log in
              </Link>
              <span className="text-gray-300 font-medium md:hidden">or</span>
              <Link
                href="/login"
                className="text-cta font-medium md:text-backdrop md:bg-cta md:rounded-full md:font-bold md:py-3 md:px-6"
              >
                Sign up
              </Link>
            </div>
          </>
        ) : (
          <button className="text-cta font-bold border-2 rounded-full border-cta py-3 px-6 flex gap-2">
            <img className="w-6 h-6 rounded-full" src={me?.image as string} />
            <span>{me?.name}</span>
          </button>
        )}
      </div>
      {children}
    </MeProvider>
  );
}
