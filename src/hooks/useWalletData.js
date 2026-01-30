import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getDIDFromStorage,
  getVCsFromStorage,
  getDelegationVCsFromStorage,
  saveVCsToStorage,
  saveDelegationVCsToStorage,
} from '../utils/storage';

export function useWalletData() {
  const [did, setDid] = useState('');
  const [vcs, setVcs] = useState([]);
  const [delegationVCs, setDelegationVCs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Activation');

  useEffect(() => {
    (async () => {
      const existingDID = await getDIDFromStorage();
      const savedDelegationVCs = await getDelegationVCsFromStorage();

      if (existingDID) {
        setDid(existingDID);
        const savedVCs = await getVCsFromStorage();
        setVcs(savedVCs);
        setInitialRoute('Home');
      }

      setDelegationVCs(savedDelegationVCs);
      setLoading(false);
    })();
  }, []);

  // VCの更新 + 永続化
  const updateVCs = async (newVCs) => {
    setVcs(newVCs);
    await saveVCsToStorage(newVCs);
  };

  // 委任状VCの追加 + 永続化
  const addDelegationVC = async (delegationVC) => {
    const updated = [...delegationVCs, delegationVC];
    setDelegationVCs(updated);
    await saveDelegationVCsToStorage(updated);
  };

  // 全データリセット（AsyncStorage + インメモリ状態）
  const resetAll = async () => {
    await AsyncStorage.clear();
    setDid('');
    setVcs([]);
    setDelegationVCs([]);
  };

  return {
    did,
    setDid,
    vcs,
    updateVCs,
    delegationVCs,
    addDelegationVC,
    resetAll,
    loading,
    initialRoute,
  };
}
