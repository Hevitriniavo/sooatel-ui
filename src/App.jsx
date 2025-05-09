import React from 'react';
import AppRouter from './router/AppRouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


class ErrorBoundary extends React.Component {
    static _error;
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        ErrorBoundary._error = error;
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Une erreur a été capturée : ", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <h1>Quelque chose s&apos;est mal passé.</h1>;
        }

        return this.props.children; 
    }
}

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
            <AppRouter />
        </ErrorBoundary>
    </QueryClientProvider>
);

export default App;
