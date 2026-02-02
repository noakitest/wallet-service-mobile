import { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, Modal, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';
import { useWallet } from '../context/WalletContext';
import {
  WalletIcon, CreditCardIcon, CopyIcon, CheckIcon,
  QrCodeIcon, CameraIcon, FileTextIcon,
} from '../components/Icons';
import GradientHeader, { GRADIENT_COLORS } from '../components/GradientHeader';

export default function HomeScreen({ navigation, route }) {
  const { did, vcs, delegationVCs, addDelegationVC, resetAll } = useWallet();
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(null);

  useEffect(() => {
    if (route.params?.scannedDelegationVC) {
      const delegationVC = route.params.scannedDelegationVC;
      addDelegationVC(delegationVC);
      setScanSuccess(delegationVC);
      navigation.setParams({ scannedDelegationVC: undefined });
    }
  }, [route.params?.scannedDelegationVC]);

  const handleCopyDID = async () => {
    await Clipboard.setStringAsync(did);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <ScrollView>
        {/* ヘッダー */}
        <GradientHeader colors={GRADIENT_COLORS.blueIndigo} style={{ paddingVertical: 28 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <WalletIcon size={28} color="#fff" />
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#fff' }}>マイウォレット</Text>
          </View>
          <Text style={{ fontSize: 15, color: '#BFDBFE' }}>デジタルアイデンティティウォレット</Text>
        </GradientHeader>

        <View style={{ padding: 20 }}>
          {/* DIDセクション */}
          <View style={{ marginBottom: 28 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#6B7280', marginBottom: 10, letterSpacing: 0.5 }}>マイDID</Text>
            <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <Text style={{ flex: 1, fontSize: 13, color: '#374151', fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', lineHeight: 20 }}>
                  {did}
                </Text>
                <View style={{ flexDirection: 'row', gap: 4 }}>
                  <Pressable
                    onPress={() => setShowQR(!showQR)}
                    style={({ pressed }) => ({
                      padding: 10,
                      backgroundColor: pressed ? '#E5E7EB' : '#F3F4F6',
                      borderRadius: 8,
                    })}
                  >
                    <QrCodeIcon size={22} color="#4B5563" />
                  </Pressable>
                  <Pressable
                    onPress={handleCopyDID}
                    style={({ pressed }) => ({
                      padding: 10,
                      backgroundColor: pressed ? '#E5E7EB' : '#F3F4F6',
                      borderRadius: 8,
                    })}
                  >
                    {copied ? (
                      <CheckIcon size={22} color="#16A34A" />
                    ) : (
                      <CopyIcon size={22} color="#4B5563" />
                    )}
                  </Pressable>
                </View>
              </View>

              {showQR && (
                <View style={{ marginTop: 16, alignItems: 'center', paddingVertical: 20, backgroundColor: '#F9FAFB', borderRadius: 12 }}>
                  <QRCode value={did} size={180} />
                  <Text style={{ marginTop: 12, fontSize: 14, color: '#6B7280' }}>
                    委任者にこのQRコードを見せてください
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* 委任状受け取りボタン */}
          <View style={{ marginBottom: 32 }}>
            <Pressable
              onPress={() => navigation.navigate('QRScanner', { did })}
              style={({ pressed }) => ({
                backgroundColor: pressed ? '#7C3AED' : '#9333EA',
                borderRadius: 12,
                paddingVertical: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
              })}
            >
              <CameraIcon size={22} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>カメラでスキャン</Text>
            </Pressable>
            <Text style={{ marginTop: 10, fontSize: 14, color: '#9CA3AF', textAlign: 'center' }}>
              委任状QRコードを受け取って代理ログインに使用できます
            </Text>
          </View>

          {/* 保有証明書（身分証） */}
          <View style={{ marginBottom: 28 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#6B7280', letterSpacing: 0.5 }}>
                保有証明書 ({vcs.length}件)
              </Text>
              <Pressable
                onPress={() => navigation.navigate('VCRegistration')}
                style={({ pressed }) => ({
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  backgroundColor: pressed ? '#D1FAE5' : '#ECFDF5',
                  borderWidth: 1,
                  borderColor: '#BBF7D0',
                  borderRadius: 8,
                })}
              >
                <Text style={{ fontSize: 14, color: '#047857', fontWeight: '600' }}>+ 身分証を追加</Text>
              </Pressable>
            </View>

            {vcs.length === 0 ? (
              <View style={{ alignItems: 'center', paddingVertical: 40, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' }}>
                <CreditCardIcon size={48} color="#D1D5DB" />
                <Text style={{ color: '#9CA3AF', marginTop: 12, fontSize: 16 }}>保有している証明書はありません</Text>
              </View>
            ) : (
              <View style={{ gap: 12 }}>
                {vcs.map((vc) => (
                  <View
                    key={vc.id}
                    style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 16, backgroundColor: '#fff' }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14 }}>
                      <View style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: '#DBEAFE', alignItems: 'center', justifyContent: 'center' }}>
                        <CreditCardIcon size={24} color="#2563EB" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: '700', color: '#111827', fontSize: 17, marginBottom: 6 }}>{vc.type}</Text>
                        <Text style={{ fontSize: 15, color: '#4B5563', marginBottom: 2 }}>発行者: {vc.issuer}</Text>
                        <Text style={{ fontSize: 15, color: '#4B5563', marginBottom: 2 }}>氏名: {vc.holderName}</Text>
                        <Text style={{ fontSize: 14, color: '#9CA3AF', marginTop: 4 }}>
                          発行日: {vc.issuedDate} / 有効期限: {vc.expiryDate}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* 委任状VC */}
          {delegationVCs && delegationVCs.length > 0 && (
            <View style={{ marginBottom: 28 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#6B7280', marginBottom: 14, letterSpacing: 0.5 }}>
                受領した委任状 ({delegationVCs.length}件)
              </Text>
              <View style={{ gap: 12 }}>
                {delegationVCs.map((vc, index) => {
                  const isExpired = vc.expiryDate < new Date().toISOString().split('T')[0];
                  return (
                    <View
                      key={vc.id || index}
                      style={{
                        borderWidth: 1,
                        borderColor: isExpired ? '#D1D5DB' : '#D8B4FE',
                        backgroundColor: isExpired ? '#F9FAFB' : '#FAF5FF',
                        borderRadius: 12,
                        padding: 16,
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14 }}>
                        <View style={{
                          width: 44, height: 44, borderRadius: 10,
                          backgroundColor: isExpired ? '#F3F4F6' : '#F3E8FF',
                          alignItems: 'center', justifyContent: 'center',
                        }}>
                          <FileTextIcon size={24} color={isExpired ? '#9CA3AF' : '#9333EA'} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <Text style={{ fontWeight: '700', fontSize: 17, color: isExpired ? '#6B7280' : '#111827' }}>
                              委任状
                            </Text>
                            <View style={{
                              paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
                              backgroundColor: isExpired ? '#E5E7EB' : '#DCFCE7',
                            }}>
                              <Text style={{ fontSize: 13, fontWeight: '600', color: isExpired ? '#4B5563' : '#15803D' }}>
                                {isExpired ? '期限切れ' : '有効'}
                              </Text>
                            </View>
                          </View>
                          <Text style={{ fontSize: 15, color: '#4B5563', marginBottom: 2 }}>
                            委任者: {vc.issuer?.name || '不明'}
                          </Text>
                          <Text style={{ fontSize: 15, color: '#4B5563', marginBottom: 2 }}>
                            権限: {vc.scope?.join(', ') || '閲覧'}
                          </Text>
                          {vc.purpose && (
                            <Text style={{ fontSize: 15, color: '#4B5563', marginBottom: 2 }}>
                              目的: {vc.purpose}
                            </Text>
                          )}
                          <Text style={{ fontSize: 14, color: '#9CA3AF', marginTop: 4 }}>
                            有効期限: {vc.expiryDate}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* データリセット（開発用） */}
          <Pressable
            onPress={() => {
              Alert.alert(
                'データリセット',
                'ウォレットの全データを削除してアクティベーション画面に戻ります。よろしいですか？',
                [
                  { text: 'キャンセル', style: 'cancel' },
                  {
                    text: 'リセット',
                    style: 'destructive',
                    onPress: async () => {
                      await resetAll();
                      navigation.reset({ index: 0, routes: [{ name: 'Activation' }] });
                    },
                  },
                ]
              );
            }}
            style={({ pressed }) => ({
              marginTop: 16,
              marginBottom: 24,
              paddingVertical: 14,
              alignItems: 'center',
              backgroundColor: pressed ? '#FEE2E2' : 'transparent',
              borderRadius: 8,
            })}
          >
            <Text style={{ fontSize: 14, color: '#EF4444' }}>データをリセット</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* スキャン成功モーダル */}
      <Modal
        visible={!!scanSuccess}
        transparent
        animationType="fade"
        onRequestClose={() => setScanSuccess(null)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 400, alignItems: 'center' }}>
            <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: '#DCFCE7', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <CheckIcon size={36} color="#16A34A" />
            </View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 12 }}>
              委任状を受け取りました
            </Text>
            {scanSuccess && (
              <View style={{ backgroundColor: '#F9FAFB', borderRadius: 12, padding: 16, width: '100%', marginBottom: 20 }}>
                <Text style={{ fontSize: 16, color: '#4B5563', marginBottom: 6 }}>
                  <Text style={{ fontWeight: '600' }}>委任者:</Text> {scanSuccess.issuer?.name}
                </Text>
                <Text style={{ fontSize: 16, color: '#4B5563', marginBottom: 6 }}>
                  <Text style={{ fontWeight: '600' }}>権限:</Text> {scanSuccess.scope?.join(', ')}
                </Text>
                <Text style={{ fontSize: 16, color: '#4B5563' }}>
                  <Text style={{ fontWeight: '600' }}>有効期限:</Text> {scanSuccess.expiryDate}
                </Text>
              </View>
            )}
            <Pressable
              onPress={() => setScanSuccess(null)}
              style={({ pressed }) => ({
                width: '100%',
                backgroundColor: pressed ? '#1D4ED8' : '#2563EB',
                borderRadius: 12,
                paddingVertical: 16,
                alignItems: 'center',
              })}
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>閉じる</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
