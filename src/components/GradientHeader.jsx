import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * グラデーションヘッダーコンポーネント
 * Web版のbg-gradient-to-r from-*-600 to-*-600の代替
 */
export default function GradientHeader({ colors, children, style }) {
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[{ padding: 24 }, style]}
    >
      {children}
    </LinearGradient>
  );
}

// Web版で使用されているグラデーション色マッピング
export const GRADIENT_COLORS = {
  blueIndigo: ['#2563EB', '#4F46E5'],       // from-blue-600 to-indigo-600
  emeraldTeal: ['#059669', '#0D9488'],       // from-emerald-600 to-teal-600
  purpleIndigo: ['#9333EA', '#4F46E5'],      // from-purple-600 to-indigo-600
  purplePink: ['#9333EA', '#DB2777'],        // from-purple-600 to-pink-600
  cyanBlue: ['#0891B2', '#2563EB'],          // from-cyan-600 to-blue-600
};
