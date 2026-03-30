import '../css/app.css';
import './bootstrap';

import FlashToast from '@/components/flash-toast';
import { ThemeProvider } from '@/components/theme-provider';
import { PageProps } from '@/types';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { createElement } from 'react';
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
                <App {...props}>
                    {({ Component, props: currentPageProps, key }) => {
                        const page = <Component key={key} {...currentPageProps} />;
                        const layout = Component.layout as any;

                        const renderedPage = (() => {
                            if (typeof layout === 'function') {
                                return layout(page);
                            }

                            if (Array.isArray(layout)) {
                                return [...layout, page]
                                    .reverse()
                                    .reduce(
                                        (children: any, Layout: any) =>
                                            createElement(Layout, { children, ...currentPageProps }),
                                    );
                            }

                            return page;
                        })();

                        return (
                            <>
                                <FlashToast />
                                {renderedPage}
                            </>
                        );
                    }}
                </App>
                <Toaster richColors position="top-right" />
            </ThemeProvider>,
        );
    },
    progress: {
        color: '#0f766e',
    },
});
