import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Switch } from 'react-native';
import PropTypes from 'prop-types';
import Feather from 'react-native-vector-icons/Feather';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ModalSelector from 'react-native-modal-selector';
import Slider from 'react-native-slider';
import Autocomplete from 'react-native-autocomplete-input';
import { connect } from 'react-redux';
import moment from 'moment';
import Picker from 'react-native-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Layout from '../Layout';
import colors from '../../constants/colors';
import Button from '../../components/Button';
import educationTypeList from '../../constants/educationType';
import { addEducation } from '../../store/actions/user';
import Graduate from '../../../assets/icons/graduate.svg';
import faculties from '../../constants/faculties';
import institutes from '../../constants/institutes';
import { getMonthIdByAbbrev, educationYearsFrom, educationYearsTo } from '../../utils/dateHelper';
import month from '../../constants/month';
import { notEmpty } from '../../utils/validators';
import PickerModal from '../../components/PickerModal';

const formattedMonth = month.map(x => x.abbreviation);
const validators = {
  instituteName: [notEmpty],
  facultyName: [notEmpty],
  from: [notEmpty],
  to: [notEmpty],
  educationType: [notEmpty],
};
class AddEducationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fromTo: {
        from: null,
        to: null,
      },
      educationType: {},
      grade: 65,
      isSwitch: true,
      facultyName: null,
      instituteName: null,
      isLoading: false,
      isFacultyHide: false,
      isInstituteHide: false,
      errors: {},
      isPickerShowing: false,
      picker: 'from',
    };
  }

  showPicker = picker => {
    this.setState({ isPickerShowing: true, picker });
  };

  hidePicker = () => {
    Picker.hide();
    this.setState({ isPickerShowing: false });
  };

  getGrade = () => {
    const { grade, isSwitch } = this.state;

    if (!isSwitch) return 'Confident';
    if (grade === 65) return '< 70';

    return `${grade} - ${grade + 5}`;
  };

  filterData = (data, query) => {
    const res =
      query && query.length > 0
        ? data.filter(item => item.toLowerCase().includes(query.toLowerCase()))
        : [];
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    return res.length === 1 && comp(query, res[0]) ? [] : res;
  };

  save = async () => {
    if (!this.isValid()) return;
    this.setState({
      ...this.state,
      isLoading: true,
    });
    const { instituteName, facultyName, fromTo, educationType, grade, isSwitch } = this.state;

    let gpa = 0;

    switch (grade) {
      case 65:
        gpa = 6;
        break;
      case 70:
        gpa = 5;
        break;
      case 75:
        gpa = 4;
        break;
      case 80:
        gpa = 3;
        break;
      case 85:
        gpa = 2;
        break;
      case 90:
        gpa = 1;
        break;
      case 95:
        gpa = 0;
        break;
    }

    if (!isSwitch) gpa = 7;

    /* 
      0 = Alumin
      1 = Student
    */
    let studingStatus = 0;

    const currenDate = new Date();
    currenDate.setHours(0, 0, 0, 0);
    const currentYear = currenDate.getFullYear();

    if (currentYear > fromTo.to) studingStatus = 0;
    if (currentYear < fromTo.to) studingStatus = 1;

    if (currentYear === fromTo.to.getFullYear()) {
      const month = currenDate.getMonth() + 1;
      // const day = currenDate.getDate();

      if (month >= 7) {
        studingStatus = 0;
      } else {
        studingStatus = 1;
      }
    }

    const data = {
      instituteName,
      facultyName,
      startDate: fromTo.from,
      graduatedDate: fromTo.to,
      bachelorType: educationType.key,
      gpa,
      studingStatus,
    };

    const res = await this.props.add(data);

    if (res) {
      this.props.navigation.goBack();
    }
    this.setState({
      ...this.state,
      isLoading: false,
    });
  };

  showFrom = () => {
    Picker.init({
      pickerData: [formattedMonth, educationYearsFrom()],
      pickerTitleText: 'Select date',
      pickerFontFamily: 'AvertaStd-Bold',
      pickerFontSize: 20,
      onPickerConfirm: data => {
        this.setState(
          {
            ...this.state,
            fromTo: {
              ...this.state.fromTo,
              from: new Date(Date.UTC(data[1], getMonthIdByAbbrev(data[0]), 1)),
            },
          },
          () => this.validationField('from', this.state.fromTo.from)
        );
        this.hidePicker();
      },
      onPickerCancel: this.hidePicker,
    });
    Picker.show();
  };

  showTo = () => {
    Picker.init({
      pickerData: [formattedMonth, educationYearsTo(this.state.fromTo.from.getFullYear())],
      pickerTitleText: 'Select date',
      pickerFontFamily: 'AvertaStd-Bold',
      pickerFontSize: 20,
      selectedValue: [0, new Date().getFullYear()],
      onPickerConfirm: data => {
        this.setState(
          {
            ...this.state,
            fromTo: {
              ...this.state.fromTo,
              to: new Date(Date.UTC(data[1], getMonthIdByAbbrev(data[0]), 1)),
            },
          },
          () => this.validationField('to', this.state.fromTo.to)
        );
        this.hidePicker();
      },
      onPickerCancel: this.hidePicker,
    });
    Picker.show();
  };

  verifyDate = () => {
    const { fromTo } = this.state;
    if (fromTo.from.getTime() > fromTo.to.getTime()) {
      return false;
    }

    return true;
  };

  isValid = () => {
    const { instituteName, facultyName, fromTo, educationType } = this.state;
    const fields = {
      instituteName,
      facultyName,
      from: fromTo.from,
      to: fromTo.to,
      educationType: educationType.key,
    };

    let errors = {};
    for (let key in fields) {
      const validatorsList = validators[key];
      for (let index in validatorsList) {
        const result = validatorsList[index](fields[key]);
        if (result) {
          errors = {
            ...errors,
            [key]: result,
          };
        }
      }
    }

    if (fields.from && fields.to) {
      if (!this.verifyDate()) {
        errors = {
          ...errors,
          early: `"To" can't be before "From"`,
        };
      }
    }

    this.setState({
      ...this.state,
      errors,
    });

    if (Object.keys(errors).length > 0) return false;

    return true;
  };

  validationField = (field, value) => {
    let errors = this.state.errors;
    for (let validator of validators[field]) {
      const result = validator(value);
      errors = {
        ...errors,
        [field]: result,
      };
    }

    this.setState({
      ...this.state,
      errors,
    });
  };

  render() {
    const { errors, isPickerShowing, picker } = this.state;

    return (
      <KeyboardAwareScrollView>
        <PickerModal
          isPickerShowing={isPickerShowing}
          hidePicker={this.hidePicker}
          showPicker={picker === 'to' ? this.showTo : this.showFrom}
        />
        <Layout
          showSpinner={this.state.isLoading}
          headerStyle={{ flexDirection: 'row', justifyContent: 'space-between' }}
          headerChildren={<Graduate width={60} height={60} />}>
          <Text style={styles.topHeader}>Adding Education </Text>
          <View
            style={[
              styles.block,
              {
                flexDirection: 'row',
                paddingVertical: 0,
              },
            ]}>
            <View
              style={{
                flex: 1,
                borderRightWidth: 0.5,
                borderRightColor: colors.g3,
                paddingTop: 20,
                paddingRight: 15,
              }}>
              <TouchableOpacity
                hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
                onPress={() => this.showPicker('from')}>
                <View style={styles.dropDown}>
                  <Text style={styles.blockHeader}>FROM</Text>
                  <Feather style={[styles.chevron]} name="chevron-down" size={24} />
                </View>
                <Text style={styles.fromTo}>
                  {this.state.fromTo.from ? (
                    <Text style={styles.fromTo}>
                      {moment(this.state.fromTo.from).format('MMM YYYY')}
                    </Text>
                  ) : (
                    <Text style={styles.fromToEmpty}>MMM YYYY</Text>
                  )}
                </Text>
                <Text style={styles.error}>{errors.from}</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 1,
                borderLeftWidth: 0.5,
                borderLeftColor: colors.g3,
                paddingLeft: 15,
                paddingTop: 20,
              }}>
              <TouchableOpacity
                hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
                disabled={!this.state.fromTo.from}
                onPress={() => this.showPicker('to')}>
                <View style={styles.dropDown}>
                  <Text style={styles.blockHeader}>TO</Text>
                  <Feather style={styles.chevron} name="chevron-down" size={24} />
                </View>
                <Text style={styles.fromTo}>
                  {this.state.fromTo.to ? (
                    <Text style={styles.fromTo}>
                      {moment(this.state.fromTo.to).format('MMM YYYY')}
                    </Text>
                  ) : (
                    <Text style={styles.fromToEmpty}>MMM YYYY</Text>
                  )}
                </Text>
                <Text style={styles.error}>{errors.to}</Text>
              </TouchableOpacity>
            </View>
          </View>
          {errors.early && (
            <Text style={[styles.error, { textAlign: 'center' }]}>{errors.early}</Text>
          )}
          <TouchableOpacity
            hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
            onPress={() => this.selectorEducationType.open()}>
            <View
              style={[
                styles.block,
                styles.line,
                errors.educationType ? styles.lineError : styles.lineDefault,
              ]}>
              <ModalSelector
                onModalClose={() =>
                  this.validationField(
                    'educationType',
                    this.state.educationType && this.state.educationType.key
                  )
                }
                optionContainerStyle={{
                  backgroundColor: colors.white,
                }}
                optionTextStyle={{
                  fontFamily: 'AvertaStd-Regular',
                  color: colors.black,
                }}
                cancelStyle={{
                  backgroundColor: colors.white,
                }}
                cancelTextStyle={{
                  fontFamily: 'AvertaStd-Regular',
                }}
                sectionTextStyle={{
                  fontFamily: 'AvertaStd-Bold',
                }}
                data={educationTypeList}
                onChange={option => {
                  this.setState({ educationType: option }, () => {
                    this.validationField(
                      'educationType',
                      this.state.educationType && this.state.educationType.key
                    );
                  });
                }}
                ref={selector => {
                  this.selectorEducationType = selector;
                }}
                customSelector={
                  <View style={{ ...styles.dropDown, justifyContent: 'flex-start' }}>
                    <Text style={[styles.blockHeader]}>TYPE</Text>
                    <Feather
                      style={[styles.chevron, { paddingLeft: 34 }]}
                      name="chevron-down"
                      size={24}
                    />
                  </View>
                }
              />
              <Text style={styles.educationType}>{this.state.educationType.label}</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.error}>{errors.educationType}</Text>
          <View style={[styles.line, errors.facultyName ? styles.lineError : styles.lineDefault]}>
            <Text style={styles.blockHeader}>SCHOOL</Text>
            <Autocomplete
              data={this.filterData(faculties, this.state.facultyName)}
              defaultValue={this.state.facultyName}
              onChangeText={text => this.setState({ facultyName: text, isFacultyHide: false })}
              placeholder="Add faculty"
              inputContainerStyle={styles.autocompleteInputContainer}
              listStyle={styles.listStyle}
              hideResults={this.state.isFacultyHide}
              keyExtractor={item => item}
              renderItem={({ item, i }) => (
                <TouchableOpacity
                  hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
                  style={styles.itemStyle}
                  onPress={() => this.setState({ facultyName: item, isFacultyHide: true })}>
                  <Text key={i}>{item}</Text>
                </TouchableOpacity>
              )}
              renderTextInput={props => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Feather style={styles.inputIcon} name="edit-2" size={24} />
                  <TextInput
                    {...props}
                    style={{ paddingLeft: 10, flex: 1 }}
                    onBlur={() => this.validationField('facultyName', this.state.facultyName)}
                  />
                </View>
              )}
            />
          </View>
          <Text style={styles.error}>{errors.facultyName}</Text>
          <View style={[styles.line, errors.instituteName ? styles.lineError : styles.lineDefault]}>
            <Text style={styles.blockHeader}>INSTITUTION</Text>
            <Autocomplete
              data={this.filterData(institutes, this.state.instituteName)}
              defaultValue={this.state.instituteName}
              onChangeText={text => this.setState({ instituteName: text, isInstituteHide: false })}
              placeholder="Add Institution"
              inputContainerStyle={styles.autocompleteInputContainer}
              listStyle={styles.listStyle}
              hideResults={this.state.isInstituteHide}
              keyExtractor={item => item}
              renderItem={({ item, i }) => (
                <TouchableOpacity
                  hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
                  style={styles.itemStyle}
                  key={i}
                  onPress={() => this.setState({ instituteName: item, isInstituteHide: true })}>
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
              renderTextInput={props => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Feather style={styles.inputIcon} name="search" size={24} />
                  <TextInput
                    {...props}
                    style={{ paddingLeft: 10, flex: 1 }}
                    onBlur={() => this.validationField('instituteName', this.state.instituteName)}
                  />
                </View>
              )}
            />
          </View>
          <Text style={styles.error}>{errors.instituteName}</Text>
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.blockHeader}>GRADE AVERAGE</Text>
              <Switch
                value={this.state.isSwitch}
                onValueChange={() => this.setState({ isSwitch: !this.state.isSwitch })}
              />
            </View>
            <Text style={[styles.educationType, { marginTop: 18 }]}>{this.getGrade()}</Text>
            <Slider
              disabled={!this.state.isSwitch}
              trackStyle={sliderStyles.track}
              thumbStyle={sliderStyles.thumb}
              minimumTrackTintColor={colors.g3}
              onValueChange={value => this.setState({ grade: value })}
              value={this.state.grade}
              step={5}
              minimumValue={65}
              maximumValue={95}
            />
          </View>
          <Button style={styles.button} title="Add" onPress={this.save} />
        </Layout>
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = ({ user }) => {
  return {};
};

const mapDispatchToProps = dispatch => ({
  add: data => dispatch(addEducation(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddEducationScreen);

AddEducationScreen.propTypes = {
  add: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  itemStyle: {
    paddingVertical: 5,
  },
  listStyle: {
    position: 'relative',
    borderWidth: 0,
    marginTop: 10,
  },
  inputIcon: {
    color: colors.g2,
  },
  autocompleteInputContainer: {
    borderWidth: 0,
    justifyContent: 'center',
    marginTop: 24,
  },
  button: {
    width: '100%',
    marginBottom: 20,
  },
  fromToEmpty: {
    fontFamily: 'AvertaStd-Bold',
    fontSize: 28,
    letterSpacing: 0,
    color: colors.g3,
  },
  fromTo: {
    fontFamily: 'AvertaStd-Bold',
    fontSize: 30,
    letterSpacing: 0,
    color: colors.black,
  },
  educationType: {
    fontFamily: 'AvertaStd-Bold',
    fontSize: 30,
    letterSpacing: 0,
    color: colors.black,
  },
  dropDown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chevron: {
    top: -6,
    color: colors.g2,
  },
  topHeader: {
    fontFamily: 'AvertaStd-Bold',
    fontSize: 30,
    letterSpacing: 0,
    color: colors.black,
    marginBottom: 20,
  },
  blockHeader: {
    fontFamily: 'AvertaStd-Regular',
    fontSize: 12,
    letterSpacing: 0,
    color: colors.g2,
  },
  block: {
    borderTopWidth: 1,
    borderTopColor: colors.g3,
    paddingVertical: 20,
  },
  error: {
    fontFamily: 'AvertaStd-Regular',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
    color: colors.orangeyRed,
    marginTop: 5,
  },
  line: {
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  lineDefault: {
    borderBottomColor: colors.g3,
  },
  lineError: {
    borderBottomColor: colors.orangeyRed,
  },
});

const sliderStyles = StyleSheet.create({
  track: {
    height: 1,
    borderRadius: 4,
    backgroundColor: colors.g3,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
    shadowOpacity: 0.15,
  },
  thumb: {
    width: 20,
    height: 20,
    backgroundColor: colors.white,
    borderColor: colors.g3,
    borderWidth: 5,
    borderRadius: 10,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    shadowOpacity: 0.35,
  },
  modalSelector: {},
});
