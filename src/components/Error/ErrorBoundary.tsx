'use client';

import React from 'react';
import { Container } from '@/src/components/layout/Container';

interface Props { children: React.ReactNode; }
interface State { hasError: boolean; }

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container className="py-40 text-center">
          <h2 className="text-2xl font-bold mb-4">Something went wrong.</h2>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-black text-white rounded-full uppercase text-xs tracking-widest"
          >
            Refresh Page
          </button>
        </Container>
      );
    }
    return this.props.children;
  }
}