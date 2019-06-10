import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import perks from '../constants/perks';
import First from '../../assets/perks/Dog friendly.svg';
import Second from '../../assets/perks/Equity.svg';
import Third from '../../assets/perks/Extra time-off.svg';
import Fourth from '../../assets/perks/Game Room.svg';
import Fifth from '../../assets/perks/Happy hour.svg';
import colors from '../constants/colors';

const Perk = ({ property }) => {
  const getPerk = () => {
    const item = perks.find(x => x.key === property);
    const label = item ? item.label : null;
    let Icon = null;

    switch (property) {
      case 'retirementPlan':
      case 'dogFriendly':
        Icon = <First height="25" width="25" />;
        break;
      case 'performanceBonuses':
      case 'gameRoom':
        Icon = <Fourth height="25" width="25" />;
        break;
      case 'sportActivities':
      case 'happyHour':
        Icon = <Fifth height="25" width="25" />;
        break;
      case 'parentFriendly':
      case 'mealPlan':
      case 'extraTimeoff':
        Icon = <Third height="25" width="25" />;
        break;
      case 'equity':
      case 'medicalInsurance':
      case 'flexibleSchedule':
        Icon = <Second height="25" width="25" />;
        break;
      default:
        break;
    }

    return (
      <View
        style={[
          styles.row,
          {
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        <View style={styles.iconContainer}>{Icon}</View>
        <Text style={styles.text}>{label}</Text>
      </View>
    );
  };

  return <View style={styles.container}>{getPerk()}</View>;
};

export default Perk;

Perk.propTypes = {
  property: PropTypes.string.isRequired,
};
const styles = StyleSheet.create({
  container: {
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: colors.g3,
    marginRight: 10,
    marginBottom: 10,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
  },
  iconContainer: {},
  text: {
    fontFamily: 'AvertaStd-Regular',
    fontSize: 12,
    letterSpacing: 0,
    color: colors.black,
    marginLeft: 2,
  },
});
