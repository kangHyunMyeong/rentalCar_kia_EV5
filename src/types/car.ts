export interface CarColor {
  id: string;
  name: string;
  nameKo: string;
  hex: string;
  image: string;
  isPopular?: boolean;
  type: 'glossy' | 'matte';
  priceDelta?: number;
}

export interface CarTrim {
  id: string;
  name: string;
  badge: string;
  driveType: '2WD' | 'AWD';
  wheelSize: string;
  motorType: 'Standard' | 'Long Range' | 'GT-Line';
  basePrice: number; // 기본 차량가 (원)
  baseRentMonthly: number; // 기준 월 렌트료 (원)
  standardDiscount: number; // 프로모션 할인액
  spec: {
    batteryCapacity: string; // "88.1 kWh"
    maxRange: string; // "508 km"
    maxPower: string; // "160 kW (217 hp)"
    zeroToHundred: string; // "7.4 초"
    chargingTime: string; // "27분 (10-80%)"
  };
  features: string[];
}

export interface EV5Highlight {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  badge?: string;
  iconName: string;
}
