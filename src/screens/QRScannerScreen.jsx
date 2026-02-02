import { useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { XIcon } from '../components/Icons';

export default function QRScannerScreen({ navigation, route }) {
  const did = route.params?.did || '';
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanError, setScanError] = useState('');

  const handleBarcodeScanned = ({ data }) => {
    if (scanned) return;
    setScanned(true);
    setScanError('');

    try {
      const delegationVC = JSON.parse(data);

      // 委任状VCかどうかを検証
      if (delegationVC.type !== '委任状') {
        setScanError('これは委任状VCではありません');
        setScanned(false);
        return;
      }

      // 被委任者DIDが自分のDIDと一致するかチェック
      if (delegationVC.delegate?.did !== did) {
        setScanError('この委任状は別のウォレット宛てです');
        setScanned(false);
        return;
      }

      // 有効期限チェック
      const today = new Date().toISOString().split('T')[0];
      if (delegationVC.expiryDate < today) {
        setScanError('この委任状は有効期限が切れています');
        setScanned(false);
        return;
      }

      // 成功 - HomeScreenに結果を渡して戻る
      navigation.navigate('Home', { scannedDelegationVC: delegationVC });
    } catch (e) {
      setScanError('QRコードの形式が正しくありません');
      setScanned(false);
    }
  };

  const handleClose = () => {
    navigation.goBack();
  };

  // カメラ権限がまだ確認されていない
  if (!permission) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 16 }}>カメラ権限を確認中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // カメラ権限がない
  if (!permission.granted) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 14, textAlign: 'center' }}>
            カメラへのアクセスが必要です
          </Text>
          <Text style={{ color: '#9CA3AF', fontSize: 15, textAlign: 'center', marginBottom: 32, lineHeight: 22 }}>
            委任状QRコードをスキャンするためにカメラを使用します
          </Text>
          <Pressable
            onPress={requestPermission}
            style={({ pressed }) => ({
              backgroundColor: pressed ? '#1D4ED8' : '#2563EB',
              borderRadius: 12,
              paddingVertical: 16,
              paddingHorizontal: 32,
              marginBottom: 16,
            })}
          >
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 17 }}>カメラを許可する</Text>
          </Pressable>
          <Pressable onPress={handleClose} style={{ paddingVertical: 12, paddingHorizontal: 24 }}>
            <Text style={{ color: '#9CA3AF', fontSize: 16 }}>戻る</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      />

      {/* オーバーレイUI */}
      <SafeAreaView style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        {/* 上部バー */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 }}>
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
            委任状QRコードをスキャン
          </Text>
          <Pressable
            onPress={handleClose}
            style={({ pressed }) => ({
              width: 44,
              height: 44,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: pressed ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)',
              borderRadius: 22,
            })}
          >
            <XIcon size={24} color="#fff" />
          </Pressable>
        </View>

        {/* 中央ガイド枠 */}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{
            width: 260,
            height: 260,
            borderWidth: 2,
            borderColor: 'rgba(255,255,255,0.5)',
            borderRadius: 16,
          }} />
        </View>

        {/* 下部メッセージ */}
        <View style={{ padding: 20, alignItems: 'center' }}>
          {scanError ? (
            <View style={{
              backgroundColor: 'rgba(220,38,38,0.9)',
              borderRadius: 12,
              padding: 16,
              marginBottom: 20,
              width: '100%',
            }}>
              <Text style={{ color: '#fff', fontSize: 15, textAlign: 'center', lineHeight: 22 }}>{scanError}</Text>
            </View>
          ) : (
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, textAlign: 'center', marginBottom: 20, lineHeight: 22 }}>
              委任者が表示したQRコードをカメラにかざしてください
            </Text>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
