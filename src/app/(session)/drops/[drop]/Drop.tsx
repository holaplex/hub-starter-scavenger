'use client';

import { useMemo } from 'react';
import { Drop as DropType } from '@/graphql.types';
import { shorten } from '@/modules/wallet';
import { MintDrop } from '@/mutations/mint.graphql';
import { useMutation, useQuery } from '@apollo/client';
import { GetDrop, GetDrops } from '@/queries/drop.graphql';
import BounceLoader from 'react-spinners/BounceLoader';
import Link from 'next/link';
import clsx from 'clsx';
import { isNil, not, path, pipe } from 'ramda';
import useMe from '@/hooks/useMe';
import { Session } from 'next-auth';
import { GetMe } from '@/queries/me.graphql';
import { CheckIcon } from '@heroicons/react/24/solid';
import { usePathname, useRouter } from 'next/navigation';

interface MintData {
  mint: string;
}

interface DropProps {
  session?: Session | null;
  drop: string;
}

interface GetDropData {
  drop: DropType;
}

interface GetDropVars {
  id: string;
}

interface MintVars {
  drop: string;
}

export default function Drop({ session, drop }: DropProps) {
  const router = useRouter();
  const dropQuery = useQuery<GetDropData, GetDropVars>(GetDrop, {
    variables: {
      id: drop
    }
  });
  const collection = dropQuery.data?.drop.collection;
  const metadataJson = collection?.metadataJson;
  const pathname = usePathname();
  const me = useMe();
  const holder = useMemo(() => {
    return me?.wallet?.mints?.find((mint) => {
      return mint.collectionId === collection?.id;
    });
  }, [collection?.id, me?.wallet?.mints]);
  const owns = pipe(isNil, not)(holder);
  const [mint, { loading }] = useMutation<MintData, MintVars>(MintDrop, {
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: GetDrops
      },
      {
        query: GetMe
      }
    ]
  });

  const onMint = () => {
    mint({
      variables: { drop },
      onCompleted: () => {
        router.push(`/`);
      }
    });
  };

  const loadingQueries = dropQuery.loading;

  return (
    <>
      <div className='w-full grid grid-cols-12  md:gap-4 lg:gap-12 mt-4 md:mt-10 lg:mt-16'>
        <div className='col-span-12 md:col-span-6'>
          {loadingQueries ? (
            <div className='w-full aspect-square rounded-lg bg-contrast animate-pulse' />
          ) : (
            <div className='relative w-full aspect-square rounded-lg overflow-hidden flex justify-center items-center'>
              <BounceLoader
                className={clsx(
                  'z-10 transition',
                  loading ? 'opacity-100' : 'opacity-0'
                )}
                color='#fff'
                size={80}
              />
              <img
                src={metadataJson?.image as string}
                alt={metadataJson?.name as string}
                className='absolute top-0 left-0 right-0 bottom-0 object-cover'
              />
            </div>
          )}
        </div>
        <div className='col-span-12 md:col-span-6'>
          <div className='flex flex-col items-center md:items-start md:justify-center'>
            <span className='text-2xl font-extrabold md:text-xl lg:text-3xl md:font-semibold'>
              {loadingQueries ? (
                <div className='rounded-full bg-contrast w-60 h-6 animate-pulse' />
              ) : (
                metadataJson?.name
              )}
            </span>
            {loadingQueries ? (
              <div className='flex flex-col gap-2 w-full mt-6 md:mt-3'>
                <div className='rounded-full bg-contrast w-full h-4 animate-pulse' />
                <div className='rounded-full bg-contrast w-full h-4 animate-pulse' />
                <div className='rounded-full bg-contrast w-28 h-4 animate-pulse' />
              </div>
            ) : (
              <span className='text-base font-medium text-gray-300 mt-6 md:mt-3 text-center md:text-left'>
                {metadataJson?.description}
              </span>
            )}
          </div>
          <div className='bg-contrast rounded-lg p-6 flex justify-between mt-8 items-center mb-6'>
            {loadingQueries ? (
              <>
                <div className='flex flex-row gap-2 items-center'>
                  <div className='bg-backdrop w-14 aspect-square rounded-full animate-pulse' />
                  <div className='flex flex-col gap-1 justify-between'>
                    <div className='h-4 w-24 rounded-full bg-backdrop animate-pulse' />
                    <div className='h-6 w-16 rounded-full bg-backdrop animate-pulse' />
                  </div>
                </div>
                <div className='font-bold rounded-full bg-cta text-contrast w-32 h-12 transition animate-pulse' />
              </>
            ) : session ? (
              <>
                <div className='flex flex-row items-center gap-2'>
                  <img
                    className='w-14 h-14 rounded-full'
                    src={me?.image as string}
                  />

                  <div className='flex flex-col gap-1 justify-between'>
                    <span className='text-gray-300 text-xs'>
                      Wallet connected
                    </span>
                    <span>{shorten(me?.wallet?.address as string)}</span>
                  </div>
                </div>
                {owns ? (
                  <CheckIcon width={40} />
                ) : (
                  <button
                    className='font-bold rounded-full bg-cta text-contrast py-3 px-6 transition hover:opacity-80'
                    onClick={onMint}
                    disabled={loading}
                  >
                    Claim now
                  </button>
                )}
              </>
            ) : (
              <>
                <span className='text-xs md:text-base text-gray-300'>
                  Sign up to claim your NFT
                </span>
                <Link
                  href={`/login?return_to=${pathname}`}
                  className='font-bold rounded-full bg-cta text-contrast py-3 px-6 transition hover:opacity-80'
                >
                  Claim now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
