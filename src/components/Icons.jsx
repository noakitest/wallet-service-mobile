import { Feather } from '@expo/vector-icons';

// Featherアイコンラッパー - Web版と同じexport名を維持
const createIcon = (name) => {
  const IconComponent = ({ size = 24, color = '#6B7280', style }) => (
    <Feather name={name} size={size} color={color} style={style} />
  );
  IconComponent.displayName = name;
  return IconComponent;
};

export const Wallet = createIcon('briefcase');
export const CreditCard = createIcon('credit-card');
export const CheckCircle = createIcon('check-circle');
export const ArrowLeft = createIcon('arrow-left');
export const Send = createIcon('send');
export const Copy = createIcon('copy');
export const Check = createIcon('check');
export const QrCode = createIcon('grid');
export const Camera = createIcon('camera');
export const X = createIcon('x');
export const FileText = createIcon('file-text');

// エイリアス（Web版互換）
export const WalletIcon = Wallet;
export const CreditCardIcon = CreditCard;
export const CopyIcon = Copy;
export const CheckIcon = Check;
export const QrCodeIcon = QrCode;
export const CameraIcon = Camera;
export const XIcon = X;
export const FileTextIcon = FileText;
