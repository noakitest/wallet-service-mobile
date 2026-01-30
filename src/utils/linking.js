import * as Linking from 'expo-linking';
import { encode as btoa } from 'base-64';

/**
 * ディープリンクURLをパースしてパラメータを取得
 */
export function parseWalletURL(url) {
  const parsed = Linking.parse(url);
  return {
    callback: parsed.queryParams?.callback || null,
    requestId: parsed.queryParams?.requestId || null,
  };
}

/**
 * コールバックURLを構築
 */
export function buildCallbackURL(callbackUrl, params) {
  const url = new URL(callbackUrl);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  });
  return url.toString();
}

/**
 * VCデータをBase64エンコード
 */
export function encodeVCData(vcData) {
  return btoa(encodeURIComponent(JSON.stringify(vcData)));
}
