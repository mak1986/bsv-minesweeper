import '../styles/globals.css'


import { config as f_config, library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

f_config.autoAddCss = false;
library.add(fas, far);


import { AuthProvider } from 'context/Auth'

function MyApp({ Component, pageProps }) {
  return <AuthProvider><Component {...pageProps} /></AuthProvider>
}

export default MyApp
