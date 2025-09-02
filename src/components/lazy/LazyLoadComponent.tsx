import { Suspense, lazy } from 'react';
import { Skeleton } from '../ui/skeleton';

// Lazy load components with Suspense fallback
export const LazyChatInterface = lazy(() => import('../../features/chat/components/ChatInterface'));

export const LazyLoadComponent = ({ component: Component, ...props }: { component: React.ComponentType<any>; [key: string]: any }) => (
  <Suspense fallback={<Skeleton className="w-full h-screen" />}>
    <Component {...props} />
  </Suspense>
);
