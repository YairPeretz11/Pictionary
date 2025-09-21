import React, { JSX, lazy, Suspense } from 'react';

const LazyCanvas = lazy(() => import('./Canvas'));

const Canvas = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyCanvas {...props} />
  </Suspense>
);

export default Canvas;
