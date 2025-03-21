/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import type {PropsWithChildren} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import InvoiceForm from './components/invoices';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { uiElements } from './constants/uiElements';
import DocumentScanner from './modules/DocumentScanner';
import VerifyForm from './components/invoices/VerifyForm';
import PaymentOptions from './modules/PaymentOptions';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  /*
   * To keep the template simple and small we're adding padding to prevent view
   * from rendering under the System UI.
   * For bigger apps the reccomendation is to use `react-native-safe-area-context`:
   * https://github.com/AppAndFlow/react-native-safe-area-context
   *
   * You can read more about it here:
   * https://github.com/react-native-community/discussions-and-proposals/discussions/827
   */

  
  return (
    <NavigationContainer>

      <View style={[backgroundStyle, {flex: 1}, styles.app]}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
          />
          <Stack.Navigator>
            <Stack.Screen name="QRED Invoice Scanner" component={DocumentScanner} />
            <Stack.Screen name="Verify" component={VerifyForm} />
            <Stack.Screen name="Confirm" component={PaymentOptions} />

          </Stack.Navigator>
      </View>
    
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
