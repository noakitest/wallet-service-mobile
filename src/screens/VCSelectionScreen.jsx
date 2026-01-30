import { useState } from 'react';
import { View, Text, Pressable, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import { useWallet } from '../context/WalletContext';
import { encodeVCData, buildCallbackURL } from '../utils/linking';
import {
  WalletIcon, CreditCardIcon, CheckCircle,
  ArrowLeft, Send, FileTextIcon,
} from '../components/Icons';
import GradientHeader, { GRADIENT_COLORS } from '../components/GradientHeader';

export default function VCSelectionScreen({ navigation, route }) {
  const { vcs, delegationVCs } = useWallet();
  const [selectedVC, setSelectedVC] = useState(null);

  const callback = route.params?.callback || '';
  const requestId = route.params?.requestId || '';

  // 代理ログインモードかどうか
  const isDelegationLogin = requestId === 'delegation-login';

  // 有効な委任状VCのみフィルタ（代理ログイン時）
  const validDelegationVCs = isDelegationLogin
    ? delegationVCs.filter(vc => vc.expiryDate >= new Date().toISOString().split('T')[0])
    : [];

  const handleSubmit = async () => {
    if (!selectedVC || !callback) return;

    const vcData = encodeVCData(selectedVC);
    const params = { vcData };
    if (requestId) params.requestId = requestId;

    const redirectUrl = buildCallbackURL(callback, params);
    await Linking.openURL(redirectUrl);
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
      <ScrollView>
        {/* ヘッダー */}
        <GradientHeader colors={isDelegationLogin ? GRADIENT_COLORS.purpleIndigo : GRADIENT_COLORS.purpleIndigo}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <WalletIcon size={32} color="#fff" />
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>デジタルウォレット</Text>
          </View>
          <Text style={{ fontSize: 14, color: '#E9D5FF' }}>
            {isDelegationLogin
              ? '代理ログインに使用する委任状を選択してください'
              : '本人確認のため、身分証VCを選択してください'}
          </Text>
        </GradientHeader>

        <View style={{ padding: 16 }}>
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 8 }}>
              {isDelegationLogin ? '保有している委任状' : '保有している身分証VC'}
            </Text>
            <Text style={{ fontSize: 14, color: '#4B5563' }}>
              {isDelegationLogin ? '提出する委任状を選択してください' : '提出する身分証を選択してください'}
            </Text>
          </View>

          {/* 代理ログインモードで委任状がない場合 */}
          {isDelegationLogin && validDelegationVCs.length === 0 && (
            <View style={{ alignItems: 'center', paddingVertical: 32 }}>
              <FileTextIcon size={48} color="#D1D5DB" />
              <Text style={{ fontWeight: '600', color: '#6B7280', marginTop: 12 }}>有効な委任状がありません</Text>
              <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 8 }}>委任者から委任状を受け取ってください</Text>
            </View>
          )}

          {/* 身分証VC一覧 */}
          {!isDelegationLogin && (
            <View style={{ gap: 16 }}>
              {vcs.map((vc) => (
                <Pressable
                  key={vc.id}
                  onPress={() => setSelectedVC(vc)}
                  style={{
                    borderWidth: 2,
                    borderColor: selectedVC?.id === vc.id ? '#3B82F6' : '#E5E7EB',
                    backgroundColor: selectedVC?.id === vc.id ? '#EFF6FF' : '#fff',
                    borderRadius: 8,
                    padding: 16,
                  }}
                >
                  <View style={{ flexDirection: 'row', gap: 16 }}>
                    <View style={{
                      width: 64, height: 64, borderRadius: 8,
                      backgroundColor: vc.type === '運転免許証' ? '#DCFCE7' : '#DBEAFE',
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <CreditCardIcon
                        size={28}
                        color={vc.type === '運転免許証' ? '#16A34A' : '#2563EB'}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827' }}>{vc.type}</Text>
                        {selectedVC?.id === vc.id && (
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <CheckCircle size={20} color="#2563EB" />
                            <Text style={{ fontSize: 14, color: '#2563EB', fontWeight: '600' }}>選択中</Text>
                          </View>
                        )}
                      </View>
                      <View style={{ gap: 4 }}>
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={{ fontSize: 14, color: '#6B7280', width: 60 }}>発行者</Text>
                          <Text style={{ fontSize: 14, color: '#111827', fontWeight: '600' }}>{vc.issuer}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={{ fontSize: 14, color: '#6B7280', width: 60 }}>発行日</Text>
                          <Text style={{ fontSize: 14, color: '#111827' }}>{vc.issuedDate}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={{ fontSize: 14, color: '#6B7280', width: 60 }}>氏名</Text>
                          <Text style={{ fontSize: 14, color: '#111827' }}>{vc.holderName}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={{ fontSize: 14, color: '#6B7280', width: 60 }}>有効期限</Text>
                          <Text style={{ fontSize: 14, color: '#111827' }}>{vc.expiryDate}</Text>
                        </View>
                        <View>
                          <Text style={{ fontSize: 14, color: '#6B7280' }}>DID</Text>
                          <Text style={{ fontSize: 12, color: '#111827', fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace' }}>
                            {vc.did}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          )}

          {/* 委任状VC一覧（代理ログイン時） */}
          {isDelegationLogin && validDelegationVCs.length > 0 && (
            <View style={{ gap: 16 }}>
              {validDelegationVCs.map((vc, index) => {
                const isSelected = selectedVC?.id === vc.id || (selectedVC && !selectedVC.id && selectedVC === vc);
                return (
                  <Pressable
                    key={vc.id || index}
                    onPress={() => setSelectedVC(vc)}
                    style={{
                      borderWidth: 2,
                      borderColor: isSelected ? '#A855F7' : '#E5E7EB',
                      backgroundColor: isSelected ? '#FAF5FF' : '#fff',
                      borderRadius: 8,
                      padding: 16,
                    }}
                  >
                    <View style={{ flexDirection: 'row', gap: 16 }}>
                      <View style={{
                        width: 64, height: 64, borderRadius: 8,
                        backgroundColor: '#F3E8FF',
                        alignItems: 'center', justifyContent: 'center',
                      }}>
                        <FileTextIcon size={32} color="#9333EA" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827' }}>委任状</Text>
                            <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, backgroundColor: '#DCFCE7' }}>
                              <Text style={{ fontSize: 12, color: '#15803D' }}>有効</Text>
                            </View>
                          </View>
                          {isSelected && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                              <CheckCircle size={20} color="#9333EA" />
                              <Text style={{ fontSize: 14, color: '#9333EA', fontWeight: '600' }}>選択中</Text>
                            </View>
                          )}
                        </View>
                        <View style={{ gap: 4 }}>
                          <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 14, color: '#6B7280', width: 60 }}>委任者</Text>
                            <Text style={{ fontSize: 14, color: '#111827', fontWeight: '600' }}>{vc.issuer?.name || '不明'}</Text>
                          </View>
                          <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 14, color: '#6B7280', width: 60 }}>有効期限</Text>
                            <Text style={{ fontSize: 14, color: '#111827' }}>{vc.expiryDate}</Text>
                          </View>
                          <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 14, color: '#6B7280', width: 60 }}>権限</Text>
                            <Text style={{ fontSize: 14, color: '#111827' }}>{vc.scope?.join(', ') || '閲覧'}</Text>
                          </View>
                          {vc.purpose && (
                            <View style={{ flexDirection: 'row' }}>
                              <Text style={{ fontSize: 14, color: '#6B7280', width: 60 }}>目的</Text>
                              <Text style={{ fontSize: 14, color: '#111827' }}>{vc.purpose}</Text>
                            </View>
                          )}
                          <View>
                            <Text style={{ fontSize: 14, color: '#6B7280' }}>委任者DID</Text>
                            <Text style={{ fontSize: 12, color: '#111827', fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace' }}>
                              {vc.issuer?.did}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}

          {/* アクションボタン */}
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
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
              onPress={handleSubmit}
              disabled={!selectedVC}
              style={{
                flex: 1,
                backgroundColor: !selectedVC ? '#D1D5DB' : (isDelegationLogin ? '#9333EA' : '#2563EB'),
                borderRadius: 8,
                paddingVertical: 14,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                opacity: !selectedVC ? 0.7 : 1,
              }}
            >
              <Send size={20} color={!selectedVC ? '#6B7280' : '#fff'} />
              <Text style={{ color: !selectedVC ? '#6B7280' : '#fff', fontWeight: '600' }}>
                {isDelegationLogin ? '委任状を提出' : 'VCを提出'}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
