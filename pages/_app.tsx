import { AppProps } from 'next/dist/next-server/lib/router/router';
import '~/styles/global.scss';
import { Provider } from 'react-redux';
import store from '~/redux/store';
import { useCallback } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  const onOpencvLoaded = useCallback(() => {
    console.log('opencv is loaded');
  }, []);
  return (
    <>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1 max-scale=1 user-scalable=no"
      />
      <Provider store={store}>
        <script
          async
          onLoad={onOpencvLoaded}
          src="https://docs.opencv.org/4.2.0/opencv.js"
          type="text/javascript"
        />
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default MyApp;
