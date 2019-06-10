import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import Image from 'react-native-scalable-image';
import PropTypes from 'prop-types';

const ImageSlider = ({ data }) => (
  <FlatList
    horizontal
    data={data}
    renderItem={({ item }) => <Image height={140} style={styles.image} source={item.source} />}
  />
);

export default ImageSlider;

ImageSlider.propTypes = {
  data: PropTypes.array.isRequired,
};

const styles = StyleSheet.create({
  image: {
    marginRight: 10,
    borderRadius: 10,
  },
});
