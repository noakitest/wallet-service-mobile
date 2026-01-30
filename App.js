import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { WalletProvider } from './src/context/WalletContext';
import AppNavigator from './src/navigation/AppNavigator';
import { useWalletData } from './src/hooks/useWalletData';

const linking = {
  prefixes: [Linking.createURL('/'), 'wallet-service://'],
  config: {
    screens: {
      VCSelection: {
        path: 'select',
      },
      DIDAuth: {
        path: 'auth',
      },
      Home: '',
    },
  },
};

export default function App() {
  const walletData = useWalletData();

  if (walletData.loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <WalletProvider value={walletData}>
      <NavigationContainer linking={linking}>
        <AppNavigator initialRoute={walletData.initialRoute} />
      </NavigationContainer>
    </WalletProvider>
  );
}
