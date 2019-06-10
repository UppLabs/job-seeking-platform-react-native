import { Dimensions } from 'react-native';
const { height, width } = Dimensions.get('window');

const SCALE_HEIGHT = 667;
const SCALE_WIDTH = 375;

export const scaleFontSize = fontSize => {
  const ratio = fontSize / SCALE_HEIGHT;
  const newSize = Math.round(ratio * height);
  return newSize;
};

export const scaleHeight = value => {
  const ratio = value / SCALE_HEIGHT;
  const newSize = Math.round(ratio * height);
  return newSize;
};

export const scaleWidth = value => {
  const ratio = value / SCALE_WIDTH;
  const newSize = Math.round(ratio * width);
  return newSize;
};
