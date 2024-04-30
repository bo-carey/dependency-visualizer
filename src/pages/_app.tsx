import type { AppProps } from 'next/app';
import Image from 'next/image';
import backgroundSvg from '@/assets/animated-low-poly-grid.svg';
import '@mantine/core/styles.css';
import '@/styles/globals.css';
import { MantineProvider } from '@mantine/core';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider>
      <Image
        src={backgroundSvg}
        alt="background image"
        priority={true}
        fill={true}
        quality={100}
        sizes="100vw"
        style={{ objectFit: 'cover', backgroundColor: 'black', zIndex: -1 }}
      />
      <div className="w-screen h-screen overflow-hidden flex items-center">
        <Component {...pageProps} />
      </div>
    </MantineProvider>
  );
}
