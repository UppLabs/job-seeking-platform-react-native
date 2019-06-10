import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addLanguage, updateLanguage, removeLanguage } from '../store/actions/user';
import colors from '../constants/colors';
import Checkbox from '../components/Checkbox';

class Language extends Component {
  state = {
    levelShow: 1,
  };

  render() {
    const { language } = this.props;
    const isChosen = this.props.languages.hasOwnProperty(language.name);

    const fillLevel = isChosen ? this.props.languages[language.name].proficiencyLevel : 0;
    return (
      <View style={styles.container}>
        <TouchableOpacity
          hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
          style={{}}
          onPress={() => {
            if (isChosen) {
              this.props.remove(language);
            } else {
              this.props.onAddedLang(language.name);
              this.props.add(language);
            }
          }}>
          <Checkbox
            additionaStyles={{
              width: 30,
              height: 30,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            checked={isChosen}
          />
        </TouchableOpacity>
        <View style={styles.wrapperLanguage}>
          <Text
            style={{
              fontFamily: 'AvertaStd-Regular',
              fontSize: 17,
              alignSelf: 'center',
              color: !isChosen ? colors.g1 : 'black',
            }}>
            {language.name}
          </Text>

          {isChosen ? (
            <TouchableOpacity
              hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
              onPress={() => {
                this.props.update(language, fillLevel);
              }}>
              <View style={styles.fillContainer}>
                <View style={styles.fill} />
                <View
                  style={[
                    styles.fill,
                    {
                      height: 18,
                      backgroundColor: fillLevel >= 2 ? colors.deepSkyBlue : colors.g2,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.fill,
                    { height: 25, backgroundColor: fillLevel > 2 ? colors.deepSkyBlue : colors.g2 },
                  ]}
                />
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  fillContainer: {
    width: 50,
    height: 50,
    flexDirection: 'row',
    alignItems: 'flex-end',
    alignSelf: 'center',
    marginBottom: 10,
  },
  fill: {
    width: 7,
    height: 10,
    backgroundColor: colors.deepSkyBlue,
    marginBottom: 10,
    marginHorizontal: 1,
    borderRadius: 5,
  },
  wrapperLanguage: {
    width: '90%',
    height: '100%',
    marginLeft: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

const mapStateToProps = state => ({
  languages: state.user.userProfile.languageSkills.reduce((map, obj) => {
    map[obj.language] = obj;
    return map;
  }, {}),
});

const mapDispatchToProps = dispatch => ({
  add: lang => dispatch(addLanguage(lang)),
  update: (lang, level) => dispatch(updateLanguage(lang, level)),
  remove: lang => dispatch(removeLanguage(lang)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Language);

Language.propTypes = {
  remove: PropTypes.func.isRequired,
  onAddedLang: PropTypes.func.isRequired,
  add: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
};
