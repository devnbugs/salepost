import '../css/app.css';
import './bootstrap';

import FlashToast from '@/components/flash-toast';
import { ThemeProvider } from '@/components/theme-provider';
import { PageProps } from '@/types';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';

const appName = import.meta.env.VITE_APP_NAME || 'Salepost';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        const pageProps = props.initialPage.props as PageProps;

        root.render(
            <ThemeProvider
                attribute="class"
                defaultTheme={String(pageProps.settings?.theme?.default_theme ?? 'system')}
                enableSystem
                storageKey="salepost-theme"
            >
                <FlashToast />
                <App {...props} />
                <Toaster richColors position="top-right" />
            </ThemeProvider>,
        );
    },
    progress: {
        color: '#0f766e',
    },
});
