import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ActivationScreen from '../screens/ActivationScreen';
import VCRegistrationScreen from '../screens/VCRegistrationScreen';
import HomeScreen from '../screens/HomeScreen';
import QRScannerScreen from '../screens/QRScannerScreen';
import VCSelectionScreen from '../screens/VCSelectionScreen';
import DIDAuthScreen from '../screens/DIDAuthScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator({ initialRoute }) {
  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Activation" component={ActivationScreen} />
      <Stack.Screen name="VCRegistration" component={VCRegistrationScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="QRScanner"
        component={QRScannerScreen}
        options={{ presentation: 'fullScreenModal' }}
      />
      <Stack.Screen
        name="VCSelection"
        component={VCSelectionScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="DIDAuth"
        component={DIDAuthScreen}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}
