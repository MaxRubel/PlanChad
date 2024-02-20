/* eslint-disable react/prop-types */
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.scss';
import { AuthProvider } from '../utils/context/authContext';
import ViewDirectorBasedOnUserAuthStatus from '../utils/ViewDirector';
import { SaveContextProvider } from '../utils/context/saveManager';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider> {/* gives children components access to user and auth methods */}
      <SaveContextProvider>
        <ViewDirectorBasedOnUserAuthStatus
        // if status is pending === loading
        // if status is logged in === view app
        // if status is logged out === sign in page
          component={Component}
          pageProps={pageProps}
        />
      </SaveContextProvider>
    </AuthProvider>
  );
}

export default MyApp;
