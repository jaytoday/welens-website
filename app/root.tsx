import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';

import tailwindStylesheetUrl from './styles/tailwind.css';
import { getUser } from './session.server';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: tailwindStylesheetUrl },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous', // This is often required for CORS
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@300;500;700&family=Noto+Serif&display=swap',
    },
    {
      rel: 'stylesheet',
      href: 'https://cdnjs.cloudflare.com/ajax/libs/tippy.js/6.3.7/tippy.min.css',
      crossOrigin: 'anonymous', // if needed for CORS
      referrerPolicy: 'no-referrer',
    },
  ];
};

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'WeLens',
  viewport: 'width=device-width,initial-scale=1',
});

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>,
};

export const loader: LoaderFunction = async ({ request }) => {
  // prettier-ignore
  return (json<LoaderData>({
    user: await getUser(request),
  }));
};




export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full font-light bg-gray-900">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload port={process.env.REMIX_DEV_SERVER_WS_PORT} />
        {/* Alpine.js */}
        <script src="https://unpkg.com/alpinejs" defer></script>
        {/* tippyjs */}
        <script
          src="https://unpkg.com/@ryangjchandler/alpine-tooltip@1.2.0/dist/cdn.min.js"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
          defer
        ></script>
      </body>
    </html>
  );
}
