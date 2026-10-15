import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Prevents unexpected render errors from breaking the entire application.
export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application render error:', error, errorInfo);
  }

  handleRetry = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className='flex min-h-screen items-center justify-center bg-background px-6 text-foreground'>
          <div className='w-full max-w-md text-center'>
            <h1 className='text-2xl font-bold'>Something went wrong</h1>
            <p className='mt-3 text-text-secondary'>
              We could not load this page. Please try again.
            </p>

            <button
              type='button'
              onClick={this.handleRetry}
              className='mt-6 rounded-pill bg-primary-100 px-6 py-3 font-bold text-primary-foreground transition-colors hover:bg-primary-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-100'
            >
              Try again
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
