import { useState, useEffect, useCallback } from 'react';
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

  // QRScannerScreenからのスキャン結果を受け取る
  useEffect(() => {
    if (route.params?.scannedDelegationVC) {
      const delegationVC = route.params.scannedDelegationVC;
      addDelegationVC(delegationVC);
      setScanSuccess(delegationVC);
      // パラメータをクリア
      navigation.setParams({ scannedDelegationVC: undefined });
    }
  }, [route.params?.scannedDelegationVC]);

  const handleCopyDID = async () => {
    await Clipboard.setStringAsync(did);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartScanner = () => {
    navigation.navigate('QRScanner', { did });
  };

  const handleAddIdentityVC = () => {
    navigation.navigate('VCRegistration');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <ScrollView>
        {/* ヘッダー */}
        <GradientHeader colors={GRADIENT_COLORS.blueIndigo}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <WalletIcon size={32} color="#fff" />
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>マイウォレット</Text>
          </View>
          <Text style={{ fontSize: 14, color: '#BFDBFE' }}>デジタルアイデンティティウォレット</Text>
        </GradientHeader>

        <View style={{ padding: 16 }}>
          {/* DIDセクション */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#6B7280', marginBottom: 8 }}>マイDID</Text>
            <View style={{ backgroundColor: '#F9FAFB', borderRadius: 8, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <Text style={{ flex: 1, fontSize: 14, color: '#374151', fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace' }}>
                  {did}
                </Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Pressable
                    onPress={() => setShowQR(!showQR)}
                    style={({ pressed }) => ({
                      padding: 8,
                      backgroundColor: pressed ? '#E5E7EB' : 'transparent',
                      borderRadius: 6,
                    })}
                  >
                    <QrCodeIcon size={20} color="#4B5563" />
                  </Pressable>
                  <Pressable
                    onPress={handleCopyDID}
                    style={({ pressed }) => ({
                      padding: 8,
                      backgroundColor: pressed ? '#E5E7EB' : 'transparent',
                      borderRadius: 6,
                    })}
                  >
                    {copied ? (
                      <CheckIcon size={20} color="#16A34A" />
                    ) : (
                      <CopyIcon size={20} color="#4B5563" />
                    )}
                  </Pressable>
                </View>
              </View>

              {/* QRコード表示 */}
              {showQR && (
                <View style={{ marginTop: 16, alignItems: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' }}>
                  <QRCode value={did} size={150} />
                  <Text style={{ marginTop: 8, fontSize: 12, color: '#6B7280' }}>
                    委任者にこのQRコードを見せてください
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* 委任状受け取りボタン */}
          <View style={{ marginBottom: 24 }}>
            <Pressable
              onPress={handleStartScanner}
              style={({ pressed }) => ({
                backgroundColor: pressed ? '#7C3AED' : '#9333EA',
                borderRadius: 8,
                paddingVertical: 14,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              })}
            >
              <CameraIcon size={20} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '600' }}>カメラでスキャン</Text>
            </Pressable>
            <Text style={{ marginTop: 8, fontSize: 12, color: '#6B7280', textAlign: 'center' }}>
              委任状QRコードを受け取って代理ログインに使用できます
            </Text>
          </View>

          {/* 保有証明書（身分証） */}
          <View style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#6B7280' }}>
                保有証明書 ({vcs.length}件)
              </Text>
              <Pressable
                onPress={handleAddIdentityVC}
                style={({ pressed }) => ({
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  backgroundColor: pressed ? '#D1FAE5' : '#ECFDF5',
                  borderWidth: 1,
                  borderColor: '#BBF7D0',
                  borderRadius: 8,
                })}
              >
                <Text style={{ fontSize: 12, color: '#047857', fontWeight: '600' }}>+ 身分証を追加</Text>
              </Pressable>
            </View>

            {vcs.length === 0 ? (
              <View style={{ alignItems: 'center', paddingVertical: 32 }}>
                <CreditCardIcon size={48} color="#D1D5DB" />
                <Text style={{ color: '#9CA3AF', marginTop: 8 }}>保有している証明書はありません</Text>
              </View>
            ) : (
              <View style={{ gap: 12 }}>
                {vcs.map((vc) => (
                  <View
                    key={vc.id}
                    style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 16, backgroundColor: '#fff' }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                      <CreditCardIcon size={24} color="#2563EB" style={{ marginTop: 2 }} />
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: '600', color: '#111827', marginBottom: 4 }}>{vc.type}</Text>
                        <Text style={{ fontSize: 14, color: '#4B5563' }}>発行者: {vc.issuer}</Text>
                        <Text style={{ fontSize: 14, color: '#4B5563' }}>氏名: {vc.holderName}</Text>
                        <Text style={{ fontSize: 14, color: '#6B7280' }}>
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
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#6B7280', marginBottom: 12 }}>
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
                        borderRadius: 8,
                        padding: 16,
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                        <FileTextIcon size={24} color={isExpired ? '#9CA3AF' : '#9333EA'} style={{ marginTop: 2 }} />
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <Text style={{ fontWeight: '600', color: isExpired ? '#6B7280' : '#111827' }}>
                              委任状
                            </Text>
                            <View style={{
                              paddingHorizontal: 8,
                              paddingVertical: 2,
                              borderRadius: 4,
                              backgroundColor: isExpired ? '#E5E7EB' : '#DCFCE7',
                            }}>
                              <Text style={{ fontSize: 12, color: isExpired ? '#4B5563' : '#15803D' }}>
                                {isExpired ? '期限切れ' : '有効'}
                              </Text>
                            </View>
                          </View>
                          <Text style={{ fontSize: 14, color: '#4B5563' }}>
                            委任者: {vc.issuer?.name || '不明'}
                          </Text>
                          <Text style={{ fontSize: 14, color: '#4B5563' }}>
                            権限: {vc.scope?.join(', ') || '閲覧'}
                          </Text>
                          {vc.purpose && (
                            <Text style={{ fontSize: 14, color: '#4B5563' }}>
                              目的: {vc.purpose}
                            </Text>
                          )}
                          <Text style={{ fontSize: 14, color: '#6B7280' }}>
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
              marginTop: 24,
              paddingVertical: 12,
              alignItems: 'center',
              backgroundColor: pressed ? '#FEE2E2' : 'transparent',
              borderRadius: 8,
            })}
          >
            <Text style={{ fontSize: 13, color: '#EF4444' }}>データをリセット</Text>
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
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 16 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 24, width: '100%', maxWidth: 400, alignItems: 'center' }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#DCFCE7', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <CheckIcon size={32} color="#16A34A" />
            </View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 8 }}>
              委任状を受け取りました
            </Text>
            {scanSuccess && (
              <View style={{ backgroundColor: '#F9FAFB', borderRadius: 8, padding: 16, width: '100%', marginBottom: 16 }}>
                <Text style={{ fontSize: 14, color: '#4B5563', marginBottom: 4 }}>
                  <Text style={{ fontWeight: '600' }}>委任者:</Text> {scanSuccess.issuer?.name}
                </Text>
                <Text style={{ fontSize: 14, color: '#4B5563', marginBottom: 4 }}>
                  <Text style={{ fontWeight: '600' }}>権限:</Text> {scanSuccess.scope?.join(', ')}
                </Text>
                <Text style={{ fontSize: 14, color: '#4B5563' }}>
                  <Text style={{ fontWeight: '600' }}>有効期限:</Text> {scanSuccess.expiryDate}
                </Text>
              </View>
            )}
            <Pressable
              onPress={() => setScanSuccess(null)}
              style={({ pressed }) => ({
                width: '100%',
                backgroundColor: pressed ? '#1D4ED8' : '#2563EB',
                borderRadius: 8,
                paddingVertical: 12,
                alignItems: 'center',
              })}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>閉じる</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
