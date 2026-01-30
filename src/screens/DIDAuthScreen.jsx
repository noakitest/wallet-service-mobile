import { useState } from 'react';
import { View, Text, Pressable, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import { useWallet } from '../context/WalletContext';
import { encodeVCData, buildCallbackURL } from '../utils/linking';
import { WalletIcon, CheckIcon, ArrowLeft, Send } from '../components/Icons';
import GradientHeader, { GRADIENT_COLORS } from '../components/GradientHeader';
import LoadingSpinner from '../components/LoadingSpinner';

export default function DIDAuthScreen({ navigation, route }) {
  const { did } = useWallet();
  const [confirmed, setConfirmed] = useState(false);

  const callback = route.params?.callback || '';
  const requestId = route.params?.requestId || '';

  const handleConfirm = () => {
    setConfirmed(true);

    setTimeout(async () => {
      const authData = { type: 'did-auth', did };
      const vcData = encodeVCData(authData);
      const params = { vcData };
      if (requestId) params.requestId = requestId;

      if (callback) {
        const redirectUrl = buildCallbackURL(callback, params);
        await Linking.openURL(redirectUrl);
      } else {
        navigation.goBack();
      }
    }, 1000);
  };

  const handleCancel = async () => {
    if (!callback) {
      navigation.goBack();
      return;
    }

    const params = { cancelled: 'true' };
    if (requestId) params.requestId = requestId;

    const redirectUrl = buildCallbackURL(callback, params);
    await Linking.openURL(redirectUrl);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 16 }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 }}>
          {/* ヘッダー */}
          <GradientHeader colors={GRADIENT_COLORS.cyanBlue}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <WalletIcon size={32} color="#fff" />
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>DID認証</Text>
            </View>
            <Text style={{ fontSize: 14, color: '#A5F3FC' }}>
              あなたのDIDでログインを要求しています
            </Text>
          </GradientHeader>

          <View style={{ padding: 24 }}>
            {!confirmed ? (
              <>
                <View style={{ marginBottom: 24 }}>
                  <Text style={{ fontSize: 14, color: '#4B5563', marginBottom: 16 }}>
                    以下のDIDを使って認証します。よろしいですか？
                  </Text>
                  <View style={{ backgroundColor: '#F9FAFB', borderRadius: 8, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' }}>
                    <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>あなたのDID</Text>
                    <Text style={{ fontSize: 14, color: '#374151', fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace' }}>
                      {did}
                    </Text>
                  </View>
                </View>

                <View style={{ backgroundColor: '#EFF6FF', borderRadius: 8, padding: 16, borderWidth: 1, borderColor: '#BFDBFE', marginBottom: 24 }}>
                  <Text style={{ fontSize: 12, color: '#1D4ED8' }}>
                    DID認証ではDIDの所有証明のみを送信します。身分証の個人情報は送信されません。
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <Pressable
                    onPress={handleCancel}
                    style={({ pressed }) => ({
                      flex: 1,
                      borderWidth: 2,
                      borderColor: '#D1D5DB',
                      backgroundColor: pressed ? '#F9FAFB' : '#fff',
                      borderRadius: 8,
                      paddingVertical: 14,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    })}
                  >
                    <ArrowLeft size={20} color="#374151" />
                    <Text style={{ color: '#374151', fontWeight: '600' }}>キャンセル</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleConfirm}
                    style={({ pressed }) => ({
                      flex: 1,
                      backgroundColor: pressed ? '#0E7490' : '#0891B2',
                      borderRadius: 8,
                      paddingVertical: 14,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    })}
                  >
                    <Send size={20} color="#fff" />
                    <Text style={{ color: '#fff', fontWeight: '600' }}>認証する</Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <View style={{ paddingVertical: 32, alignItems: 'center' }}>
                <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#DCFCE7', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <CheckIcon size={32} color="#16A34A" />
                </View>
                <Text style={{ color: '#374151', fontWeight: '600', marginBottom: 8 }}>認証情報を送信中...</Text>
                <Text style={{ fontSize: 14, color: '#6B7280' }}>リダイレクトしています</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
