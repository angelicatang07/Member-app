import React, {useState, useCallback, useMemo, setState, useEffect} from 'react';
import { View, Text, Image, Button, StyleSheet, TouchableOpacity, useWindowDimensions, ScrollView, TouchableWithoutFeedback} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {Calendar, CalendarUtils, CalendarList, CalendarProvider, LocaleConfig} from 'react-native-calendars';
import Screen from '../components/Screen';
import { auth } from '../navigation/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { fetchProfilePicture } from '../components/profilePictureUtils';
import CalendarNode from '../components/CalendarEventNode';

const CalendarScreen = ({ navigation, props }) => {
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfilePic = async () => {
      const url = await fetchProfilePicture();
      if (url) {
        setProfilePicture(url);
      }
      setIsLoading(false);
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchProfilePic();
      } else {
        setProfilePicture(null); // Reset profile picture if not authenticated
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchProfilePic = async () => {
    const url = await fetchProfilePicture();
    setProfilePicture(url);
  };

  const handleFetchProfilePicture = () => {
    fetchProfilePic();
  };

  useFocusEffect(
    React.useCallback(() => {
      handleFetchProfilePicture();
    }, [])
  );

  const name = user ? user.displayName : "No name given"; 

  LocaleConfig.locales['en'] = {
    monthNames: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ],
    monthNamesShort: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'],
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayNamesShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    today: "Today"
  };
  LocaleConfig.defaultLocale = 'en';

  const {height, width} = useWindowDimensions();

  const today = new Date();

  const [weekHighlight, setWeekHighlight] = useState(today.getDay())
  
  const todayString = new Date(today.getTime() - (today.getTimezoneOffset() * 60000 ))
                    .toISOString()
                    .split("T")[0];

  const [selected, setSelected] = useState(todayString);

  const [isMonthCorrect, setIsMonthCorrect] = useState(true);

  const onDayPress = useCallback((day) => {
    setSelected(day.dateString);
  }, []);

  const marked = useMemo(() => {
      return {
        [selected]: {
          selected: true,
          disableTouchEvent: false,
        },
      };
  }, [selected]);

  return (
    <Screen style={styles.screen}>
      <View style={[{position: 'absolute'}, {marginTop: 21}, {marginRight: 23}, {right: 0}, {height: height*0.075}, {width: height*0.075}, {borderRadius: height * (0.095/2)}, styles.profilePictureBorder]}>
      {!isLoading && (
        <Image  source={
            profilePicture
              ? { uri: profilePicture } // Use fetched profile picture URL
              : require('../assets/tempProfilePhoto.png') // Fallback to default image
          }
           style ={[styles.profilePicture, {height: height * 0.062}, {width: height * 0.062}, {borderRadius: height*0.045}]}/>   
           )}
      </View>

      
      <View style={[styles.root, {height: height}, {position: 'absolute'}]}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.header}>{"Calendar"}</Text>
        <View>
          <CalendarProvider date="" style={{maxHeight: 340}}>
            <CalendarList
              style={{
                height: 350,
                width: width-10,
              }}

              theme={{
                'stylesheet.calendar.header': {
                  header: {
                    flexDirection: 'row',
                    paddingLeft: 2,
                    paddingRight: 10,
                    alignItems: 'center',
                  },
                  week: {
                    marginTop: 7,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    borderBottomWidth: 1,
                    borderColor: "rgba(47, 46, 46, 0.8)"
                  },
                },
                'stylesheet.day.basic': {
                  selected: {
                    backgroundColor: '#939CEB',
                    borderRadius: 16,
                    width: 30,
                    height: 30,
                    shadowColor: '#939CEB',
                    shadowOpacity: 1,
                    shadowRadius: 7,
                    shadowOffset: {width: 0, height: 0.17}
                  },
                },

                calendarBackground: 'rgba(255, 255, 255, 0)',
                textSectionTitleColor: 'rgba(239, 240, 243, 0.5)',
                textSectionTitleDisabledColor: 'rgba(239, 240, 243, 1)',
                selectedDayBackgroundColor: '#939CEB',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#ffffff',
                dayTextColor: '#EFF0F3',
                textDisabledColor: "rgba(239, 240, 243, 0.5)",
                dotColor: '#00adf5',
                selectedDotColor: '#ffffff',
                monthTextColor: 'rgba(255, 255, 255, 0.8)',
                indicatorColor: 'blue',
                textDayFontWeight: '400',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '500',
                textDayFontSize: 12,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 12
              }}

              horizontal={true}

              disabledDaysIndexes={[weekHighlight]}
              markedDates={marked}

              // Initially visible month. Default = now
              // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
              // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
              // Handler which gets executed on day press. Default = undefined
              onDayPress={onDayPress}
              // Handler which gets executed on day long press. Default = undefined
              onDayLongPress={day => {
                console.log('selected day', selectedDate);
              }}
              // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
              // Handler which gets executed when visible month changes in calendar. Default = undefined
              onMonthChange={month => {
                if (today.getMonth()+1 == month["month"] && today.getFullYear() == month["year"]){
                  setWeekHighlight(today.getDay());
                  setIsMonthCorrect(true);
                }
                else{
                  setWeekHighlight([]);
                  setIsMonthCorrect(false);
                }
              }}
              // Hide month navigation arrows. Default = false
              hideArrows={true}
              // Replace default arrows with custom ones (direction can be 'left' or 'right')
              // Do not show days of other months in month page. Default = false
              hideExtraDays={false}
              // If hideArrows = false and hideExtraDays = false do not switch month when tapping on greyed out
              // day from another month that is visible in calendar page. Default = false
              disableMonthChange={false}
              // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday
              firstDay={0}
              // Hide day names. Default = false
              hideDayNames={false}
              // Show week numbers to the left. Default = false
              showWeekNumbers={false}
              // Handler which gets executed when press arrow icon left. It receive a callback can go back month
              onPressArrowLeft={subtractMonth => subtractMonth()}
              // Handler which gets executed when press arrow icon right. It receive a callback can go next month
              onPressArrowRight={addMonth => addMonth()}
              // Disable left arrow. Default = false
              disableArrowLeft={false}
              // Disable right arrow. Default = false
              disableArrowRight={false}
              // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
              disableAllTouchEventsForDisabledDays={false}
              // Replace default month and year title with custom one. the function receive a date as parameter
              // Enable the option to swipe between months. Default = false
              enableSwipeMonths={true}
            />
          </CalendarProvider>
        </View>        
        <Text style={styles.header}>{"Upcoming Events"}</Text>
        <CalendarNode />
      </View>
      {/* <View style={styles.createEventContainer}>
        <TouchableOpacity style={styles.createEventButton} onPress={() => navigation.navigate('EventFormScreen')}>
          <Text style={styles.createEventText}>Create Event</Text>
        </TouchableOpacity>
      </View> */}
    </Screen>
  );
};
//<ImageBackground source={Background} resizeMode="cover" style={[styles.image, {height: height}, {width: width}]}>
const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 0,
  },
  screen: {
    paddingTop: 120,
  },
  profilePictureBorder: {
    borderWidth: 0, 
    borderColor: '#4881CB',
    justifyContent: 'center',
    alignItems: 'center'
  },
  profilePicture: {
    maxHeight: 100,
    maxWidth: 100,
  },
  name: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 10,
    marginRight: 'auto',
    marginLeft: 4
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 10,
    marginRight: 'auto',
    marginLeft: 30
  },
  header2: {
    fontSize: 20,
    fontWeight: "bold",
    color: 'rgba(255, 255, 255, 1)',
    marginBottom: 10,
    marginRight: 'auto',
    marginLeft: 3
  },
  eventScroll: {
    marginRight: "auto",
    marginTop: 5
  },
  eventContainer: {
    backgroundColor: '#6A76DE',
    height: 70,
    width: 200,
    borderRadius: 10,
    marginLeft: 25,
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
  },
  eventDateNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: 'rgba(255, 255, 255, 1)',
    marginBottom: -3,
    marginTop: -2
  },
  eventHeader: {
    fontSize: 10,
    fontWeight: "bold",
    color: 'rgba(255, 255, 255, 1)',
  },
  createEventContainer: {
    position: 'absolute',
    bottom: -490,
    left: 0,
    right: 0,
    alignItems: 'center', 
  },
  createEventButton: {
    padding: 8,
    borderRadius: 5,
    alignItems: 'center', 
    backgroundColor: "#8468BB",
    width: '30%', // Adjust width as needed
  },
  createEventText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "white",
  }
})
export default CalendarScreen;