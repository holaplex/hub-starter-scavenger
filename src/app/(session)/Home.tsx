"use client";
import Image from "next/image";
import { Holder, Drop as DropType } from "@/graphql.types";
import { useQuery } from "@apollo/client";
import { GetDrops } from "@/queries/drop.graphql";
import Link from "next/link";
import useMe from "@/hooks/useMe";
import { Session } from "next-auth";
import { shorten } from "@/modules/wallet";
import { CheckIcon } from "@heroicons/react/24/solid";

interface HomeProps {
  session?: Session | null;
}

interface GetDropsData {
  drops: DropType[];
}

interface GetDropsVars {
  id: string;
}

function isOwner(drop: DropType, me: any) {
  return drop.collection.holders?.find(
    (holder: Holder) => holder.address === me?.wallet?.address
  );
}

export default function Home({ session }: HomeProps) {
  const me = useMe();
  const dropsQuery = useQuery<GetDropsData, GetDropsVars>(GetDrops);

  return (
    <>
      <div className="w-full grid grid-cols-4 md:gap-4 lg:gap-12 mt-4 md:mt-10 lg:mt-16">
        {dropsQuery.loading ? (
          <>
            <div className="bg-contrast animate-pulse w-full aspect-square rounded-md" />
            <div className="bg-contrast animate-pulse w-full aspect-square rounded-md" />
            <div className="bg-contrast animate-pulse w-full aspect-square rounded-md" />
            <div className="bg-contrast animate-pulse w-full aspect-square rounded-md" />
          </>
        ) : (
          dropsQuery?.data?.drops.map((drop) => {
            const metadataJson = drop.collection.metadataJson;
            const isHolder = isOwner(drop, me);

            return (
              <div
                key={drop.id}
                className="relative w-full aspect-square rounded-log overflow-hidden flex justify-center items-center"
              >
                {isHolder && (
                  <CheckIcon
                    width={20}
                    className="z-10 absolute top-4 right-4"
                  />
                )}
                <img
                  src={metadataJson?.image as string}
                  alt={metadataJson?.name as string}
                  className="absolute top-0 left-0 right-0 bottom-0 object-cover"
                />
              </div>
            );
          })
        )}
      </div>
      <div className="bg-contrast w-full max-w-md rounded-lg p-6 flex justify-between mt-8 items-center mb-6">
        {dropsQuery.loading ? (
          <>
            <div className="flex flex-row gap-2 items-center">
              <div className="bg-backdrop w-14 aspect-square rounded-full animate-pulse" />
              <div className="flex flex-col gap-1 justify-between">
                <div className="h-4 w-24 rounded-full bg-backdrop animate-pulse" />
                <div className="h-6 w-16 rounded-full bg-backdrop animate-pulse" />
              </div>
            </div>
            <div className="font-bold rounded-full bg-cta text-contrast w-32 h-12 transition animate-pulse" />
          </>
        ) : session ? (
          <>
            <div className="flex flex-row items-center gap-2">
              <img
                className="w-14 h-14 rounded-full"
                src={session?.user?.image as string}
              />

              <div className="flex flex-col gap-1 justify-between">
                <span className="text-gray-300 text-xs">Wallet connected</span>
                <span>{shorten(me?.wallet?.address as string)}</span>
              </div>
            </div>
            2
          </>
        ) : (
          <>
            <span className="text-xs md:text-base text-gray-300">
              Sign up to claim your NFT
            </span>
            <Link
              href="/login"
              className="font-bold rounded-full bg-cta text-contrast py-3 px-6 transition hover:opacity-80"
            >
              Claim now
            </Link>
          </>
        )}
      </div>
    </>
  );
}
