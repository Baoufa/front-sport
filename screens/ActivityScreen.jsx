import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useState, useCallback, useRef, useEffect } from 'react';
import YoutubePlayer from 'react-native-youtube-iframe';
import { Icon } from '@rneui/themed';
import { Slider } from '@rneui/themed';
import Timer from '../components/Timer';
0;
function ActivityScreen(props) {
  const FORWARD_AND_BACKWARD = 10; // in seconds
  const { video_url, title } = props.route.params.item;
  const playerRef = useRef();
  const interval = useRef();
  const forward_backward = useRef();
  const [playing, setPlaying] = useState(false);
  const [wasPlaying, setWasPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [remainingTime, setRemainingTime] = useState(
    props.route.params.item.duration_indicator
  );
  const [totalTime, setTotalTime] = useState(remainingTime);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerStarted, setIsTimerStarted] = useState(false);

  const onReadyHandler = () => {
    setIsLoading(false);
    playerRef.current.getDuration().then(duration => setTotalTime(duration));
  };

  const onSlidingCompletetHandler = event => {
    if (wasPlaying) {
      setPlaying(true);
      setWasPlaying(false);
    }
    playerRef.current.seekTo(elapsedTime, true);
  };

  const onSlidingStartHandler = () => {
    if (playing) {
      setWasPlaying(true);
      setPlaying(false);
    }
  };

  const muteHandler = () => {
    playerRef.current.isMuted().then(bool => setIsMuted(!bool));
  };

  const seekTo = useCallback(time => {
    setIsTimerStarted(true);
    setRemainingTime(totalTime - time);
    setElapsedTime(time);

    playerRef.current.seekTo(time, true);
    // playerRef.current.getCurrentTime().then(currentTime => {
    //   // setElapsedTime(time);
    //   //
    // };
  });

  const onStateChange = useCallback(state => {
    console.log(state);
    if (state === 'ended') {
      setPlaying(false);
    }
    if (state === 'paused') {
      setPlaying(false);
    }
    if (state === 'playing') {
      setPlaying(true);
    }
  }, []);

  const goForwardBackward = backfor => {
    setPlaying(false);
    forward_backward.current = setInterval(() => {
      playerRef.current.getCurrentTime().then(time => {
        seekTo(time + FORWARD_AND_BACKWARD * backfor);
      });
    }, 400);
  };

  const pressOutHandler = () => {
    clearInterval(forward_backward.current);
    setPlaying(true);
  };

  const togglePlaying = useCallback(() => {
    setPlaying(prev => !prev);
  }, []);

  useEffect(() => {
    props.navigation.setOptions({
      headerTitle: title,
    });
  }, []);

  useEffect(() => {
    clearInterval(interval.current);
    if (playing) {
      interval.current = setInterval(() => {
        playerRef.current.getCurrentTime().then(time => {
          setIsTimerStarted(true);
          //   setElapsedTime(time);
          setRemainingTime(totalTime - time);
        });
      }, 200);
    }
    // else {
    //   if (isTimerStarted) {
    //     playerRef.current.getCurrentTime().then(time => {
    //       setElapsedTime(time);
    //       setRemainingTime(totalTime - time);
    //     });
    //   }
    // }
    return () => clearInterval(interval.current);
  }, [playing, totalTime]);

  return (
    <View style={styles.container}>
      <YoutubePlayer
        ref={playerRef}
        play={playing}
        height={220}
        videoId={video_url}
        onChangeState={onStateChange}
        onReady={onReadyHandler}
        initialPlayerParams={{ controls: false }}
        mute={isMuted}
      />

      {!isLoading && (
        <View style={styles.sliderContainer}>
          <Slider
            value={elapsedTime}
            onSlidingStart={onSlidingStartHandler}
            onSlidingComplete={onSlidingCompletetHandler}
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
                  name='heartbeat'
                  type='font-awesome'
                  size={10}
                  reverse
                  containerStyle={{ bottom: 10, right: 10 }}
                />
              ),
            }}
          />
        </View>
      )}

      {/* <Text style={styles.title}>{title}</Text> */}

      {isLoading && (
        <ActivityIndicator
          size='large'
          color='#8000ff'
          style={{ marginTop: 100 }}
        />
      )}

      {!isLoading && (
        <View style={styles.bottom}>
          <Timer
            remainingTime={remainingTime}
            isTimerStarted={isTimerStarted}
          />

          <View style={styles.navContainer}>
            <Icon
              color='black'
              size={80}
              name='play-skip-back-circle'
              type='ionicon'
              onLongPress={() => goForwardBackward(-1)}
              onPressOut={pressOutHandler}
            />
            <Icon
              color='black'
              size={150}
              name={playing ? 'pause-circle' : 'play-circle'}
              type='ionicon'
              onPress={togglePlaying}
            />
            <Icon
              color='black'
              size={80}
              name='play-skip-forward-circle'
              type='ionicon'
              onLongPress={() => goForwardBackward(1)}
              onPressOut={pressOutHandler}
            />
          </View>
          <View style={styles.navContainer}>
            <Icon
              color='black'
              size={80}
              name='ios-reload-circle-outline'
              type='ionicon'
              onPress={() => seekTo(0)}
            />
            <Icon
              color='black'
              size={80}
              name={isMuted ? 'volume-off' : 'volume-up'}
              type='fontawesome'
              onPress={muteHandler}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },

  sliderContainer: {
    padding: 10,
  },

  title: {
    //marginTop: 20,
    // marginBottom: 70,
    marginHorizontal: 10,
    fontSize: 22,
    fontWeight: 'bold',
  },

  bottom: {
    flex: 0.9,
    // backgroundColor: 'red',
    justifyContent: 'space-around',
    marginHorizontal: 20,
  },

  navContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    //marginBottom: 40,
  },

  navButton: {
    overflow: 'hidden',
  },
});

export default ActivityScreen;
