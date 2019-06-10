import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Feather from 'react-native-vector-icons/Feather';
import Layout from '../Layout';
import colors from '../../constants/colors';
import CompanyIcon from '../../components/CompanyIcon';
import SingleEventCard from '../../components/SingleEventCard';
import { setEventCompany, clearEventTmpFilter, applyPosition } from '../../store/actions/events';
import EventInfoPopup from '../../components/EventInfoPopup';
import PositionDescriptionPopup from '../../components/PositionDescriptionPopup';
import Artwork from '../../../assets/artwork_v_2.svg';
import seniorityLevel from '../../constants/seniorityLevel';
import employmentType from '../../constants/employmentType';
import { hideMax } from '../../utils/stringHelper';

class MainFeedScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEventInfoShow: false,
      isShowPositionDescription: false,
      position: null,
      company: null,
      startTime: new Date(),
      isLoading: false,
    };
  }

  goCompanyDescription = company => {
    const { navigation, setCompany } = this.props;
    setCompany(company);
    navigation.navigate('CompanyDescription');
  };

  toogleEventInfo = () => {
    this.setState({
      isEventInfoShow: !this.state.isEventInfoShow,
    });
  };

  showPositionDescription = (company, position) => {
    this.setState({
      isShowPositionDescription: true,
      position,
      company,
    });
  };

  hidePositionDescription = () => {
    this.setState({
      isShowPositionDescription: false,
    });
  };

  goEventFilter = () => {
    this.props.clearTmpFilter();
    this.props.navigation.navigate('EventFilter');
  };

  isEmpty = () => {
    const { companies } = this.props;

    let result = true;
    companies.forEach(company => {
      if (company.positions.length > 0) {
        result = false;
      }
    });

    return result;
  };

  applyPosition = async data => {
    this.setState({
      isLoading: true,
    });
    await this.props.apply(data);

    this.setState({
      isLoading: false,
    });
  };

  render() {
    const { feed, companies } = this.props;
    const {
      isEventInfoShow,
      isShowPositionDescription,
      position,
      company,
      startTime,
      isLoading,
    } = this.state;

    return (
      <Layout
        showSpinner={isLoading}
        headerStyle={{
          backgroundColor: colors.white,
          paddingTop: Platform.OS === 'ios' ? 43 : 32,
          marginTop: 0,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
        headerChildren={
          <TouchableOpacity
            hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
            onPress={this.goEventFilter}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'AvertaStd-Regular',
                fontSize: 12,
                letterSpacing: 0,
                textAlign: 'right',
                color: colors.purpleSecondary,
              }}>
              FILTER
            </Text>
            <Feather name="filter" size={24} color={colors.purpleSecondary} />
          </TouchableOpacity>
        }
        bodyStyle={{ backgroundColor: colors.g4 }}>
        <View style={styles.topBlock}>
          <View style={styles.topBlockRow}>
            <Text style={[styles.headerRegular, { color: colors.purpleSecondary }]}>
              HOSTED BY{' '}
            </Text>
            <Text style={styles.headerRegular}>{feed.hostName && feed.hostName.toUpperCase()}</Text>
          </View>
          <View style={[styles.row, { alignItems: 'center', marginTop: 9, marginBottom: 25 }]}>
            <Text style={[styles.headerBold, { flex: 9 }]}>{hideMax(feed.eventName, 45)}</Text>
            <TouchableOpacity
              style={{ flex: 1 }}
              hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
              onPress={this.toogleEventInfo}>
              <Feather style={styles.info} name="info" size={24} color={colors.g2} />
            </TouchableOpacity>
          </View>
          <View style={[styles.row, { marginBottom: 15 }]}>
            {feed.scheduled && (
              <TouchableOpacity
                hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
                style={styles.circle}
                onPress={() => this.props.navigation.navigate('Schedules')}>
                {feed.waitingSchedules > 0 && <View style={styles.badge} />}
                <Feather name="calendar" size={24} color={colors.aquaMarine} />
              </TouchableOpacity>
            )}
            {feed.companies && feed.companies.length > 0 && (
              <FlatList
                horizontal
                style={styles.companyRow}
                data={feed.companies}
                keyExtractor={company => company.id}
                renderItem={({ item: company }) => (
                  <CompanyIcon
                    style={{ marginBottom: 10 }}
                    {...company}
                    onPress={() => this.goCompanyDescription(company)}
                  />
                )}
              />
            )}
          </View>
        </View>
        <ScrollView style={styles.body}>
          {!this.isEmpty() ? (
            companies.map(company => {
              return company.positions.map(position => (
                <SingleEventCard
                  key={position.id}
                  company={company}
                  position={position}
                  showDescription={this.showPositionDescription}
                  apply={this.applyPosition}
                  event={feed}
                  startTime={startTime}
                />
              ));
            })
          ) : (
            <View style={styles.empty}>
              <Artwork width={165} heigth={165} />
              <Text style={[styles.headerBold, { marginTop: 35, textAlign: 'center' }]}>
                Seems like we couldn't find what you were looking for
              </Text>
              <Text style={styles.emptyText}>Please update your search and try again</Text>
            </View>
          )}
        </ScrollView>
        <EventInfoPopup isShow={isEventInfoShow} onClose={this.toogleEventInfo} event={feed} />
        {isShowPositionDescription ? (
          <PositionDescriptionPopup
            isShow={isShowPositionDescription}
            onClose={this.hidePositionDescription}
            position={position}
            company={company}
            apply={this.applyPosition}
            event={feed}
            startTime={startTime}
          />
        ) : null}
      </Layout>
    );
  }
}

const filterCompanyPositions = (companies, filter) => {
  let companiesResult = [...companies];

  if (filter.specificCompany.length > 0) {
    companiesResult = companies.filter(x => filter.specificCompany.includes(x.name.toUpperCase()));
  }

  const seniorityLevelValues = filter.seniorityLevelActive.map(
    label => seniorityLevel.find(item => item.label.toUpperCase() === label).value
  );
  const employmentTypeValues = filter.employmentTypeActive.map(
    label => employmentType.find(item => item.label.toUpperCase() === label).value
  );

  companiesResult = companiesResult.map(company => {
    let newCompany = { ...company };
    if (filter.applied) {
      newCompany.positions = company.positions.filter(x => x.applied === filter.applied);
    }
    if (seniorityLevelValues.length > 0) {
      newCompany.positions = newCompany.positions.filter(x =>
        seniorityLevelValues.includes(x.seniorityLevel)
      );
    }
    if (employmentTypeValues.length > 0) {
      newCompany.positions = newCompany.positions.filter(x =>
        employmentTypeValues.includes(x.employmentType)
      );
    }

    if (filter.positionFields.length > 0) {
      newCompany.positions = newCompany.positions.filter(x =>
        filter.positionFields.some(r => x.field.toUpperCase().indexOf(r.toUpperCase()) >= 0)
      );
    }
    return newCompany;
  });

  return companiesResult;
};

const mapStateToProps = ({ events }) => {
  const { feed, filter, filterApplied } = events;

  return {
    feed,
    filter,
    companies: filterApplied ? filterCompanyPositions(feed.companies, filter) : feed.companies,
  };
};

const mapDispatchToProps = dispatch => ({
  setCompany: company => dispatch(setEventCompany(company)),
  clearTmpFilter: () => dispatch(clearEventTmpFilter),
  apply: data => dispatch(applyPosition(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainFeedScreen);

MainFeedScreen.propTypes = {
  feed: PropTypes.object.isRequired,
  setCompany: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  clearTmpFilter: PropTypes.func.isRequired,
  filter: PropTypes.object.isRequired,
  companies: PropTypes.array.isRequired,
  apply: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  badge: {
    width: 11,
    height: 11,
    backgroundColor: colors.orangeyRed,
    borderRadius: 25,
    position: 'absolute',
    zIndex: 20,
    right: 0,
    top: 0,
  },
  companyRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  topBlock: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: colors.white,
    marginHorizontal: -15,
    paddingHorizontal: 15,
    marginBottom: 5,
  },
  topBlockRow: {
    flexDirection: 'row',
    marginTop: 25,
  },
  headerRegular: {
    fontFamily: 'AvertaStd-Regular',
    fontSize: 12,
    letterSpacing: 0,
    color: colors.g2,
  },
  headerBold: {
    fontFamily: 'AvertaStd-Bold',
    fontSize: 18,
    letterSpacing: 0,
    color: colors.black,
    ...Platform.select({ ios: { top: 2 } }),
  },
  body: {
    flex: 1,
    height: '100%',
  },
  row: {
    flexDirection: 'row',
  },
  info: {
    marginLeft: 5,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 75,
  },
  emptyText: {
    fontFamily: 'AvertaStd-Regular',
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.g1,
    marginTop: 3,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: colors.aquaMarine,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
