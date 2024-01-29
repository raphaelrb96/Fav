/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { useEffect } from 'react';
import { firebase } from '@react-native-firebase/firestore';

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#1A237E',
        secondary: '#060D51',
        background: '#EAEAEA',
        outline: '#6e6e6e'
    },
};

export default function Main() {

    useEffect(() => {
        firebase.initializeApp();
        firebase.app();
    }, []);

    return (
        <PaperProvider theme={theme}>
            <App />
        </PaperProvider>
    );
}

AppRegistry.registerComponent(appName, () => Main);
