// app/layout-client.tsx
'use client';
import "./globals.css";
import * as React from 'react';

/** Wrapper client du layout — ne rend que {children}. */
export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
