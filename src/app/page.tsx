'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the desired URL
    router.replace('http://nextjs14-blog-nine.vercel.app/posts');
  }, [router]);

  // Return null since we are redirecting
  return null;
} 