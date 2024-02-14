import Link from 'next/link';
import { notFound } from 'next/navigation';

import { CustomMDX } from '@/components/mdx';
import { getPosts } from '@/lib/posts';
import { calculateReadingTime, reformatDate } from '@/lib/utils';
import { Redis } from '@upstash/redis';
import { ArrowLeft } from 'lucide-react';

import { ReportView } from './view';

const redis = Redis.fromEnv();

export default async function Blog({ params }: { params: any }) {
  const post = getPosts().find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  const views = redis.mget<number[]>(
    ['pageviews', 'posts', params.slug].join(':'),
  );

  return (
    <div className="mx-auto w-full max-w-3xl px-4 lg:px-20 pt-4 md:pt-10">
      <ReportView slug={post.slug} />
      <div className="flex flex-row space-x-4 mb-6 text-sm text-secondaryDarker">
        <Link
          href="/posts"
          className="group flex flex-row items-center space-x-1"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 duration-300 group-hover:text-secondaryDark"
          />
          <span className="group-hover:text-secondaryDark duration-300">
            Back
          </span>
        </Link>
      </div>
      <h1 className="title font-medium text-2xl tracking-tighter max-w-[650px]">
        {post.metadata.title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm max-w-[650px]">
        <div className="flex flex-row space-x-2 items-center text-secondaryDarker">
          <span>{reformatDate(post.metadata.publishedAt)}</span>
          <span className="h-1 w-1 rounded-full bg-secondaryDarker" />
          <span>{views} views</span>
          <span className="h-1 w-1 rounded-full bg-secondaryDarker" />
          <span>{calculateReadingTime(post.content)} min read</span>
        </div>
      </div>
      <article className="prose prose-invert pb-10">
        <CustomMDX source={post.content} />
      </article>
    </div>
  );
}
