import { useState } from 'react';
import { View, Text, Pressable, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWallet } from '../context/WalletContext';
import { generateDID, saveDIDToStorage } from '../utils/storage';
import { WalletIcon, CheckIcon } from '../components/Icons';
import GradientHeader, { GRADIENT_COLORS } from '../components/GradientHeader';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ActivationScreen({ navigation }) {
  const { setDid } = useWallet();
  const [step, setStep] = useState('intro'); // intro | generating | done
  const [generatedDID, setGeneratedDID] = useState('');

  const handleActivate = () => {
    setStep('generating');

    setTimeout(async () => {
      const did = generateDID();
      await saveDIDToStorage(did);
      setGeneratedDID(did);
      setStep('done');
    }, 2000);
  };

  const handleComplete = () => {
    setDid(generatedDID);
    navigation.replace('VCRegistration');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
        <View style={{
          backgroundColor: '#fff',
          borderRadius: 16,
          overflow: 'hidden',
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        }}>
          {/* ヘッダー */}
          <GradientHeader colors={GRADIENT_COLORS.blueIndigo} style={{ paddingVertical: 36 }}>
            <View style={{ alignItems: 'center' }}>
              <View style={{
                width: 88,
                height: 88,
                borderRadius: 44,
                backgroundColor: 'rgba(255,255,255,0.2)',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}>
                <WalletIcon size={44} color="#fff" />
              </View>
              <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#fff', marginBottom: 10 }}>
                デジタルウォレット
              </Text>
              <Text style={{ fontSize: 15, color: '#BFDBFE', lineHeight: 22 }}>
                {step === 'intro' && 'ウォレットをアクティベートして利用を開始します'}
                {step === 'generating' && 'DIDを生成しています...'}
                {step === 'done' && 'アクティベートが完了しました'}
              </Text>
            </View>
          </GradientHeader>

          <View style={{ padding: 24 }}>
            {/* Step: intro */}
            {step === 'intro' && (
              <View>
                <View style={{ gap: 20, marginBottom: 28 }}>
                  {[
                    { num: '1', title: 'DID（分散型識別子）の生成', desc: 'あなた固有のデジタルIDが発行されます' },
                    { num: '2', title: '身分証の登録', desc: '本人確認書類をVCとして登録します' },
                    { num: '3', title: '利用開始', desc: 'ウォレットを使った認証が可能になります' },
                  ].map((item) => (
                    <View key={item.num} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14 }}>
                      <View style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: '#DBEAFE',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Text style={{ color: '#2563EB', fontWeight: 'bold', fontSize: 16 }}>{item.num}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: '600', color: '#111827', fontSize: 16, marginBottom: 2 }}>{item.title}</Text>
                        <Text style={{ fontSize: 14, color: '#6B7280', lineHeight: 20 }}>{item.desc}</Text>
                      </View>
                    </View>
                  ))}
                </View>
                <Pressable
                  onPress={handleActivate}
                  style={({ pressed }) => ({
                    backgroundColor: pressed ? '#1D4ED8' : '#2563EB',
                    borderRadius: 12,
                    paddingVertical: 16,
                    alignItems: 'center',
                  })}
                >
                  <Text style={{ color: '#fff', fontWeight: '600', fontSize: 17 }}>
                    ウォレットをアクティベート
                  </Text>
                </Pressable>
              </View>
            )}

            {/* Step: generating */}
            {step === 'generating' && (
              <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                <View style={{ marginBottom: 28 }}>
                  <LoadingSpinner size={72} color="#2563EB" trackColor="#BFDBFE" />
                </View>
                <Text style={{ color: '#374151', fontWeight: '600', fontSize: 17, marginBottom: 10 }}>DIDを生成中...</Text>
                <Text style={{ fontSize: 15, color: '#6B7280', lineHeight: 22 }}>鍵ペアの生成と識別子の登録を行っています</Text>
              </View>
            )}

            {/* Step: done */}
            {step === 'done' && (
              <View>
                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                  <View style={{
                    width: 72,
                    height: 72,
                    borderRadius: 36,
                    backgroundColor: '#DCFCE7',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <CheckIcon size={36} color="#16A34A" />
                  </View>
                </View>
                <Text style={{ textAlign: 'center', fontWeight: '600', color: '#111827', fontSize: 18, marginBottom: 10 }}>
                  DIDが生成されました
                </Text>
                <View style={{
                  backgroundColor: '#F9FAFB',
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 28,
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                }}>
                  <Text style={{ fontSize: 13, color: '#6B7280', marginBottom: 6 }}>あなたのDID</Text>
                  <Text style={{ fontSize: 13, color: '#374151', fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', lineHeight: 20 }}>
                    {generatedDID}
                  </Text>
                </View>
                <Pressable
                  onPress={handleComplete}
                  style={({ pressed }) => ({
                    backgroundColor: pressed ? '#1D4ED8' : '#2563EB',
                    borderRadius: 12,
                    paddingVertical: 16,
                    alignItems: 'center',
                  })}
                >
                  <Text style={{ color: '#fff', fontWeight: '600', fontSize: 17 }}>
                    次へ：身分証を登録する
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
