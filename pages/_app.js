/* eslint-disable react/prop-types */
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.scss';
import '../styles/calendar.scss';
import '../styles/cards.scss';
import '../styles/calendarDay.scss';
import '../styles/chat.scss';
import { memo } from 'react';
import { AuthProvider } from '../utils/context/authContext';
import ViewDirectorBasedOnUserAuthStatus from '../utils/ViewDirector';
import { SaveContextProvider } from '../utils/context/saveManager';
import { CollabContextProvider } from '../utils/context/collabContext';

function MyApp({ Component, pageProps }) {
  const MemoizedSaveContextProvider = memo(SaveContextProvider);
  return (
    <AuthProvider>
      <CollabContextProvider>
        <SaveContextProvider>
          <ViewDirectorBasedOnUserAuthStatus
            // if status is pending === loading
            // if status is logged in === view app
            // if status is logged out === sign in page
            component={Component}
            pageProps={pageProps}
          />
        </SaveContextProvider>
      </CollabContextProvider>
    </AuthProvider>
  );
}

export default MyApp;
