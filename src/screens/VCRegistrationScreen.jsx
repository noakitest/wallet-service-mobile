import { useState } from 'react';
import { View, Text, Pressable, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWallet } from '../context/WalletContext';
import { CreditCardIcon, CheckIcon, WalletIcon } from '../components/Icons';
import GradientHeader, { GRADIENT_COLORS } from '../components/GradientHeader';
import LoadingSpinner from '../components/LoadingSpinner';

const ID_TYPES = [
  {
    key: 'drivers-license',
    label: '運転免許証',
    issuer: '東京都公安委員会',
    color: 'green',
  },
  {
    key: 'mynumber',
    label: 'マイナンバーカード',
    issuer: 'デジタル庁',
    color: 'blue',
  },
];

export default function VCRegistrationScreen({ navigation }) {
  const { did, vcs, updateVCs } = useWallet();
  const [step, setStep] = useState('select'); // select | confirm | verifying | done
  const [selectedType, setSelectedType] = useState(null);
  const [newVCs, setNewVCs] = useState([]);

  const existingVCs = vcs;
  const allVCs = [...existingVCs, ...newVCs];

  const handleSelect = (idType) => {
    setSelectedType(idType);
    setStep('confirm');
  };

  const handleRegister = () => {
    setStep('verifying');

    setTimeout(() => {
      const today = new Date().toISOString().split('T')[0];
      const expiryYear = new Date().getFullYear() + 5;
      const expiryDate = `${expiryYear}-${today.slice(5)}`;

      const newVC = {
        id: `vc-${Date.now()}`,
        type: selectedType.label,
        issuer: selectedType.issuer,
        issuedDate: today,
        expiryDate: expiryDate,
        holderName: '山田 太郎',
        birthDate: '1990-05-15',
        address: selectedType.key === 'drivers-license'
          ? '東京都渋谷区神宮前1-2-3'
          : '東京都新宿区西新宿2-8-1',
        did: did,
      };

      setNewVCs(prev => [...prev, newVC]);
      setStep('done');
    }, 2500);
  };

  const handleAddAnother = () => {
    setSelectedType(null);
    setStep('select');
  };

  const handleFinish = async () => {
    await updateVCs([...existingVCs, ...newVCs]);
    navigation.replace('Home');
  };

  const handleSkip = () => {
    navigation.replace('Home');
  };

  const availableTypes = ID_TYPES.filter(
    t => !allVCs.some(vc => vc.type === t.label)
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 16 }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 }}>
          {/* ヘッダー */}
          <GradientHeader colors={GRADIENT_COLORS.emeraldTeal}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <CreditCardIcon size={32} color="#fff" />
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>身分証VCの登録</Text>
            </View>
            <Text style={{ fontSize: 14, color: '#A7F3D0' }}>
              本人確認書類をVerifiable Credentialとして登録します
            </Text>
          </GradientHeader>

          <View style={{ padding: 24 }}>
            {/* Step: select */}
            {step === 'select' && (
              <View>
                {allVCs.length > 0 && (
                  <View style={{ marginBottom: 16, padding: 12, backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#BBF7D0', borderRadius: 8 }}>
                    <Text style={{ fontSize: 14, color: '#15803D', fontWeight: '600' }}>
                      {allVCs.length}件の身分証を登録済み
                    </Text>
                  </View>
                )}

                {availableTypes.length > 0 ? (
                  <>
                    <Text style={{ fontSize: 14, color: '#4B5563', marginBottom: 16 }}>
                      登録する身分証を選択してください
                    </Text>
                    <View style={{ gap: 12 }}>
                      {availableTypes.map((idType) => (
                        <Pressable
                          key={idType.key}
                          onPress={() => handleSelect(idType)}
                          style={({ pressed }) => ({
                            borderWidth: 2,
                            borderColor: pressed ? '#34D399' : '#E5E7EB',
                            backgroundColor: pressed ? '#ECFDF5' : '#fff',
                            borderRadius: 8,
                            padding: 16,
                          })}
                        >
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                            <View style={{
                              width: 48, height: 48, borderRadius: 8,
                              backgroundColor: idType.color === 'green' ? '#DCFCE7' : '#DBEAFE',
                              alignItems: 'center', justifyContent: 'center',
                            }}>
                              <CreditCardIcon
                                size={24}
                                color={idType.color === 'green' ? '#16A34A' : '#2563EB'}
                              />
                            </View>
                            <View>
                              <Text style={{ fontWeight: '600', color: '#111827' }}>{idType.label}</Text>
                              <Text style={{ fontSize: 14, color: '#6B7280' }}>発行: {idType.issuer}</Text>
                            </View>
                          </View>
                        </Pressable>
                      ))}
                    </View>
                  </>
                ) : (
                  <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', paddingVertical: 8 }}>
                    登録可能な身分証がすべて登録されています
                  </Text>
                )}

                <View style={{ marginTop: 16, gap: 8 }}>
                  {newVCs.length > 0 && (
                    <Pressable
                      onPress={handleFinish}
                      style={({ pressed }) => ({
                        backgroundColor: pressed ? '#1D4ED8' : '#2563EB',
                        borderRadius: 8,
                        paddingVertical: 14,
                        alignItems: 'center',
                      })}
                    >
                      <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>
                        {existingVCs.length > 0 ? 'ウォレットに戻る' : 'ウォレットを利用開始'}
                      </Text>
                    </Pressable>
                  )}
                  {newVCs.length === 0 && (
                    <Pressable
                      onPress={handleSkip}
                      style={({ pressed }) => ({
                        borderWidth: 2,
                        borderColor: '#D1D5DB',
                        backgroundColor: pressed ? '#F9FAFB' : '#fff',
                        borderRadius: 8,
                        paddingVertical: 14,
                        alignItems: 'center',
                      })}
                    >
                      <Text style={{ color: '#4B5563', fontWeight: '600', fontSize: 16 }}>
                        {existingVCs.length > 0 ? 'ウォレットに戻る' : 'スキップして利用開始'}
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>
            )}

            {/* Step: confirm */}
            {step === 'confirm' && selectedType && (
              <View>
                <Text style={{ fontSize: 14, color: '#4B5563', marginBottom: 16 }}>
                  以下の内容で身分証VCを登録します
                </Text>

                <View style={{ backgroundColor: '#F9FAFB', borderRadius: 8, padding: 16, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 16 }}>
                  {[
                    { label: '証明書タイプ', value: selectedType.label },
                    { label: '発行機関', value: selectedType.issuer },
                    { label: '氏名', value: '山田 太郎' },
                    { label: '生年月日', value: '1990年5月15日' },
                    { label: '住所', value: selectedType.key === 'drivers-license' ? '東京都渋谷区神宮前1-2-3' : '東京都新宿区西新宿2-8-1' },
                  ].map((item) => (
                    <View key={item.label} style={{ marginBottom: 12 }}>
                      <Text style={{ fontSize: 12, color: '#6B7280' }}>{item.label}</Text>
                      <Text style={{ fontWeight: '600', color: '#111827' }}>{item.value}</Text>
                    </View>
                  ))}
                  <View>
                    <Text style={{ fontSize: 12, color: '#6B7280' }}>紐付けDID</Text>
                    <Text style={{ fontSize: 12, color: '#374151', fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace' }}>
                      {did}
                    </Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <Pressable
                    onPress={() => { setSelectedType(null); setStep('select'); }}
                    style={({ pressed }) => ({
                      flex: 1,
                      borderWidth: 2,
                      borderColor: '#D1D5DB',
                      backgroundColor: pressed ? '#F9FAFB' : '#fff',
                      borderRadius: 8,
                      paddingVertical: 14,
                      alignItems: 'center',
                    })}
                  >
                    <Text style={{ color: '#374151', fontWeight: '600' }}>戻る</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleRegister}
                    style={({ pressed }) => ({
                      flex: 1,
                      backgroundColor: pressed ? '#047857' : '#059669',
                      borderRadius: 8,
                      paddingVertical: 14,
                      alignItems: 'center',
                    })}
                  >
                    <Text style={{ color: '#fff', fontWeight: '600' }}>登録する</Text>
                  </Pressable>
                </View>
              </View>
            )}

            {/* Step: verifying */}
            {step === 'verifying' && (
              <View style={{ paddingVertical: 32, alignItems: 'center' }}>
                <View style={{ marginBottom: 24 }}>
                  <LoadingSpinner size={64} color="#059669" trackColor="#A7F3D0" />
                </View>
                <Text style={{ color: '#374151', fontWeight: '600', marginBottom: 8 }}>身分証を検証中...</Text>
                <Text style={{ fontSize: 14, color: '#6B7280' }}>発行機関への照会とVC発行を行っています</Text>
              </View>
            )}

            {/* Step: done */}
            {step === 'done' && (
              <View>
                <View style={{ alignItems: 'center', marginBottom: 16 }}>
                  <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#DCFCE7', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckIcon size={32} color="#16A34A" />
                  </View>
                </View>
                <Text style={{ textAlign: 'center', fontWeight: '600', color: '#111827', marginBottom: 4 }}>
                  身分証VCの登録完了
                </Text>
                <Text style={{ textAlign: 'center', fontSize: 14, color: '#6B7280', marginBottom: 16 }}>
                  {selectedType?.label}がウォレットに追加されました
                </Text>

                {/* 登録済みVC一覧 */}
                <View style={{ backgroundColor: '#F9FAFB', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 16 }}>
                  <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>登録済みの身分証</Text>
                  {allVCs.map((vc) => (
                    <View key={vc.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 }}>
                      <CheckIcon size={16} color="#16A34A" />
                      <Text style={{ fontSize: 14, color: '#374151' }}>{vc.type}</Text>
                      <Text style={{ fontSize: 12, color: '#9CA3AF' }}>({vc.issuer})</Text>
                    </View>
                  ))}
                </View>

                <View style={{ gap: 8 }}>
                  {availableTypes.length > 0 && (
                    <Pressable
                      onPress={handleAddAnother}
                      style={({ pressed }) => ({
                        borderWidth: 2,
                        borderColor: '#6EE7B7',
                        backgroundColor: pressed ? '#ECFDF5' : '#fff',
                        borderRadius: 8,
                        paddingVertical: 14,
                        alignItems: 'center',
                      })}
                    >
                      <Text style={{ color: '#047857', fontWeight: '600' }}>別の身分証も登録する</Text>
                    </Pressable>
                  )}
                  <Pressable
                    onPress={handleFinish}
                    style={({ pressed }) => ({
                      backgroundColor: pressed ? '#1D4ED8' : '#2563EB',
                      borderRadius: 8,
                      paddingVertical: 14,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    })}
                  >
                    <WalletIcon size={20} color="#fff" />
                    <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>
                      {existingVCs.length > 0 ? 'ウォレットに戻る' : 'ウォレットを利用開始'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
