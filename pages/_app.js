import '../styles/globals.css'
import Layout from '../layouts/Default'

const MyApp = ({ Component, pageProps }) => {
  return ( 
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
 
export default MyApp;