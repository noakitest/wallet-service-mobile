import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * DID生成（ダミー実装）
 */
export function generateDID() {
  const randomString = Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 36).toString(36)
  ).join('');
  return `did:example:${randomString}`;
}

/**
 * AsyncStorageからDIDを取得
 */
export async function getDIDFromStorage() {
  return await AsyncStorage.getItem('wallet_did');
}

/**
 * AsyncStorageにDIDを保存
 */
export async function saveDIDToStorage(did) {
  await AsyncStorage.setItem('wallet_did', did);
}

/**
 * DIDを初期化（存在しなければ生成、あれば取得）
 */
export async function initializeDID() {
  let did = await getDIDFromStorage();
  if (!did) {
    did = generateDID();
    await saveDIDToStorage(did);
  }
  return did;
}

/**
 * 身分証VCの取得・保存
 */
export async function getVCsFromStorage() {
  const raw = await AsyncStorage.getItem('wallet_vcs');
  return raw ? JSON.parse(raw) : [];
}

export async function saveVCsToStorage(vcs) {
  await AsyncStorage.setItem('wallet_vcs', JSON.stringify(vcs));
}

/**
 * 委任状VCの取得・保存
 */
export async function getDelegationVCsFromStorage() {
  const raw = await AsyncStorage.getItem('delegation_vcs');
  return raw ? JSON.parse(raw) : [];
}

export async function saveDelegationVCsToStorage(delegationVCs) {
  await AsyncStorage.setItem('delegation_vcs', JSON.stringify(delegationVCs));
}
