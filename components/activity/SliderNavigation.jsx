import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Icon, Slider } from '@rneui/themed';

const SliderNavigation = ({
  elapsedTime,
  onSlidingStartHandler,
  onSlidingCompleteHandler,
  seekTo,
  totalTime,
}) => {
  return (
    <View style={styles.sliderContainer}>
      <Slider
        value={elapsedTime}
        onSlidingStart={onSlidingStartHandler}
        onSlidingComplete={onSlidingCompleteHandler}
        onValueChange={seekTo}
        maximumValue={totalTime}
        minimumValue={0}
        step={1}
        allowTouchTrack
        trackStyle={{ height: 5, backgroundColor: 'transparent' }}
        thumbStyle={{
          height: 20,
          width: 20,
          backgroundColor: 'transparent',
        }}
        thumbProps={{
          children: (
            <Icon
              name='code'
              type='feather'
              size={10}
              color='#ef4444'
              reverse
              containerStyle={{ bottom: 10, right: 10 }}
            />
          ),
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    paddingHorizontal: 4,
    paddingVertical: 10,
  },
});

export default SliderNavigation;
