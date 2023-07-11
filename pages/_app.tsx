// import "../styles/globals.css";
import type { AppProps } from "next/app";
import "@silevis/reactgrid/styles.css";
import { SessionProvider } from "next-auth/react";
import React, { useState, useEffect } from "react";
import "../styles/global.css";
import "antd/dist/antd.css";
import { trpc } from '../utils/trpc'
import "@ant-design/pro-layout/dist/layout.css";
import "@ant-design/pro-card/dist/card.css";

import "react-phone-input-2/lib/style.css";
import { useSession } from "next-auth/react";
import 'react-calendar-timeline/lib/Timeline.css'
import { ConfigProvider } from "antd";
import en from "antd/lib/locale/en_US";
import 'react-data-grid/lib/styles.css';
import "../styles/styles.scss";
import 'react-datasheet/lib/react-datasheet.css';

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const [width, setwidth] = useState(null);


  return (
    <SessionProvider
      refetchInterval={5 * 60}
      refetchOnWindowFocus={true}
      session={session}
    >
      <ConfigProvider locale={en}
        >
        <Component {...pageProps} session={session} />
      </ConfigProvider>
    </SessionProvider>
  );
}

export default trpc.withTRPC(MyApp)
