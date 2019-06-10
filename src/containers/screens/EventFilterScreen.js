import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Feather from 'react-native-vector-icons/Feather';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import Image from 'react-native-scalable-image';
import colors from '../../constants/colors';
import Layout from '../Layout';
import Button from '../../components/Button';
import Checkbox from '../../components/Checkbox';
import { setEventFilter, toogleEventTmpPositionField } from '../../store/actions/events';
import BigTag from '../../components/BigTag';
import seniorityLevel from '../../constants/seniorityLevel';
import employmentType from '../../constants/employmentType';

class EventFilterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      applied: props.applied,
      seniorityLevelActive: props.seniorityLevelActive,
      employmentTypeActive: props.employmentTypeActive,
    };
  }

  close = () => {
    this.props.navigation.navigate('MainFeed');
  };

  onChange = (name, checked) => {
    this.setState({
      applied: checked,
    });
  };

  save = () => {
    const { applied, seniorityLevelActive, employmentTypeActive } = this.state;
    const { positionFields, specificCompany } = this.props;

    this.props.setFilter({
      applied,
      seniorityLevelActive,
      employmentTypeActive,
      positionFields,
      specificCompany,
    });
    this.props.navigation.navigate('MainFeed');
  };

  setSeniorityLevelActive = value => {
    let { seniorityLevelActive } = this.state;
    if (seniorityLevelActive.includes(value)) {
      let actives = [...seniorityLevelActive];
      actives.splice(actives.indexOf(value), 1);

      this.setState({
        seniorityLevelActive: actives,
      });
    } else {
      this.setState({
        seniorityLevelActive: [...seniorityLevelActive, value],
      });
    }
  };

  setEmploymentTypeActive = value => {
    let { employmentTypeActive } = this.state;
    if (employmentTypeActive.includes(value)) {
      let actives = [...employmentTypeActive];
      actives.splice(actives.indexOf(value), 1);

      this.setState({
        employmentTypeActive: actives,
      });
    } else {
      this.setState({
        employmentTypeActive: [...employmentTypeActive, value],
      });
    }
  };

  checkIsActive = (array, value) => {
    return array.includes(value);
  };

  goPositionFields = () => {
    this.props.navigation.navigate('PositionFields');
  };

  goSpecificCompany = () => {
    this.props.navigation.navigate('SpecificCompany');
  };

  getCompanyImage = title => {
    const { companies } = this.props;
    const company = companies.find(x => x.name.toUpperCase() === title);

    if (company) {
      const url = company.logoUrl;
      return url && <Image height={20} style={styles.companyImage} source={{ uri: url }} />;
    }

    return null;
  };

  render() {
    const { applied, employmentTypeActive, seniorityLevelActive } = this.state;
    const { positionFields, toogleTmpPositionField, specificCompany } = this.props;

    return (
      <Layout
        style={styles.container}
        backButton={false}
        headerComponent={
          <View style={styles.header}>
            <TouchableOpacity
              hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
              style={styles.close}
              onPress={this.close}>
              <Feather style={styles.closeIcon} name="x" size={24} color={colors.black} />
            </TouchableOpacity>
          </View>
        }>
        <ScrollView style={styles.body}>
          <View style={[styles.row, { justifyContent: 'space-between', alignItems: 'center' }]}>
            <Text style={styles.black}>SHOW ONLY POSITIONS I APPLIED TO</Text>
            <Checkbox checked={applied} onChange={this.onChange} />
          </View>
          <View style={[styles.row, { justifyContent: 'space-between', alignItems: 'center' }]}>
            <Text style={styles.black}>FIELD</Text>
            <TouchableOpacity
              hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
              onPress={this.goPositionFields}>
              <Feather name="plus" size={24} color={colors.g2} />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {positionFields.map(title => (
              <BigTag
                textStyle={styles.black}
                style={styles.tag}
                onPress={toogleTmpPositionField}
                key={title}
                title={title.toUpperCase()}
                active
              />
            ))}
          </View>
          <View style={[styles.row, { justifyContent: 'space-between', alignItems: 'center' }]}>
            <Text style={styles.black}>SPECIFIC COMPANY</Text>
            <TouchableOpacity
              hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
              onPress={this.goSpecificCompany}>
              <Feather name="plus" size={24} color={colors.g2} />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {specificCompany
              .map(item => item.toUpperCase())
              .map(title => (
                <BigTag
                  textStyle={styles.black}
                  style={styles.tag}
                  leftIcon={this.getCompanyImage(title)}
                  icon={false}
                  key={title}
                  title={title.toUpperCase()}
                  activeStyle={styles.activeTag}
                />
              ))}
          </View>
          <View style={[styles.row, { justifyContent: 'space-between', alignItems: 'center' }]}>
            <Text style={styles.black}>SENIORITY LEVEL</Text>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {seniorityLevel
              .map(item => item.label.toUpperCase())
              .map(title => (
                <BigTag
                  textStyle={styles.black}
                  style={styles.tag}
                  icon={false}
                  onPress={this.setSeniorityLevelActive}
                  key={title}
                  title={title.toUpperCase()}
                  active={this.checkIsActive(seniorityLevelActive, title)}
                  activeStyle={styles.activeTag}
                />
              ))}
          </View>
          <View style={[styles.row, { justifyContent: 'space-between', alignItems: 'center' }]}>
            <Text style={styles.black}>EMPLOYMENT TYPE</Text>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 80 }}>
            {employmentType
              .map(item => item.label.toUpperCase())
              .map(title => (
                <BigTag
                  textStyle={styles.black}
                  style={styles.tag}
                  icon={false}
                  onPress={this.setEmploymentTypeActive}
                  key={title}
                  title={title}
                  active={this.checkIsActive(employmentTypeActive, title)}
                  activeStyle={styles.activeTag}
                />
              ))}
          </View>
        </ScrollView>
        <Button style={styles.button} onPress={this.save} title="Save filter" />
      </Layout>
    );
  }
}

const mapStateToProps = ({ events }) => {
  const { applied, seniorityLevelActive, employmentTypeActive } = events.filter;
  const { positionFields, specificCompany } = events.tmpFilter;
  const { companies } = events.feed;

  return {
    applied,
    seniorityLevelActive,
    employmentTypeActive,
    positionFields,
    specificCompany,
    companies,
  };
};

const mapDispatchToProps = dispatch => ({
  setFilter: data => dispatch(setEventFilter(data)),
  toogleTmpPositionField: item => dispatch(toogleEventTmpPositionField(item)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventFilterScreen);

EventFilterScreen.defaultProps = {
  companies: [],
};

EventFilterScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  setFilter: PropTypes.func.isRequired,
  applied: PropTypes.bool.isRequired,
  positionFields: PropTypes.array.isRequired,
  specificCompany: PropTypes.array.isRequired,
  toogleTmpPositionField: PropTypes.func.isRequired,
  companies: PropTypes.array,
  seniorityLevelActive: PropTypes.array.isRequired,
  employmentTypeActive: PropTypes.array.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.g4,
  },
  header: {
    paddingTop: 24,
    paddingBottom: 52,
  },
  body: {},
  close: {
    width: 68,
    height: 60,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginLeft: 10,
    shadowColor: '#09000000',
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  closeIcon: {
    marginLeft: 20,
  },
  row: {
    flexDirection: 'row',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.g3,
    marginBottom: 15,
  },
  checkboxText: {
    fontFamily: 'AvertaStd-Regular',
    fontSize: 12,
    letterSpacing: 0,
    color: colors.black,
  },
  activeTag: {
    backgroundColor: colors.aquaMarine,
  },
  button: {
    bottom: 10,
    position: 'absolute',
    marginHorizontal: 15,
    alignItems: 'center',
  },
  companyImage: {
    marginRight: 10,
    alignSelf: 'center',
  },
  black: {
    color: colors.black,
  },
  tag: {
    backgroundColor: colors.white,
  },
});
