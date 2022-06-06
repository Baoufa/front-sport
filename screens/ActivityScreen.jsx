import { Text, View, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useState, useCallback, useRef, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import YoutubePlayer from 'react-native-youtube-iframe';
import { Icon, Button } from '@rneui/themed';
import { Slider } from '@rneui/themed';

function ActivityScreen(props) {
  const FORWARD_AND_BACKWARD = 10; // in seconds

  const { video_url, title } = props.route.params.item;
  const playerRef = useRef();
  const interval = useRef();
  const forward_backward = useRef();

  const [playing, setPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [remainingTime, setRemainingTime] = useState(
    props.route.params.item.duration_indicator
  );
  const [totalTime, setTotalTime] = useState(remainingTime);
  const [elapsedTime, setElapsedTime] = useState(0);

  const [isTimerStarted, setIsTimerStarted] = useState(false);
  const [formattedTime, setFormattedTime] = useState('');

  const onReadyHandler = () => {
    setIsLoading(false);
    playerRef.current.getDuration().then(duration => setTotalTime(duration));
  };

  const [isCached, setIsCached] = useState(false);

  const onSliderStartHandler = () => {
    if(playing) {
      clearInterval(interval.current);
      setPlaying(false);
      setIsCached(true);
    }
  };

  const onSliderCompleteHandler = () => {
    if(isCached) {
      setPlaying(true);
      setIsCached(false);
    }
  };

  const seekTo = time => {
    setIsTimerStarted(true);
    setElapsedTime(time);
    setRemainingTime(totalTime - time);
    playerRef.current.seekTo(time);
  };

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
    if (state === 'buffering') {
      setPlaying(false);
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
    //setPlaying(true);
  };

  const togglePlaying = useCallback(() => {
    setPlaying(prev => !prev);
  }, []);

  useEffect(() => {
    clearInterval(interval.current);
    if (playing) {
      interval.current = setInterval(async () => {
        playerRef.current.getCurrentTime().then(time => {
          setIsTimerStarted(true);
          setElapsedTime(time);
          setRemainingTime(totalTime - time);
        });
      }, 200);
    }
    return () => clearInterval(interval.current);
  }, [playing, totalTime]);

  useEffect(() => {
    if (!isTimerStarted) {
      setFormattedTime(`${remainingTime / 100} min`);
    }

    if (isTimerStarted) {
      let minutes =
        Math.floor(remainingTime / 60) <= 0
          ? '00'
          : Math.floor(remainingTime / 60)
              .toString()
              .padStart(2, '0');
      let seconds =
        Math.floor(remainingTime % 60) <= 0
          ? '00'
          : Math.floor(remainingTime % 60)
              .toString()
              .padStart(2, '0');
      let milliseconds =
        Math.floor((remainingTime * 100) % 100) <= 0
          ? '00'
          : Math.floor((remainingTime * 100) % 100)
              .toString()
              .padStart(2, '0');
      setFormattedTime(`${minutes} : ${seconds}`);
    }
  }, [remainingTime, isTimerStarted]);

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
      />
      {!isLoading && (

        <View style={styles.sliderContainer}>
        <Slider
          value={elapsedTime}
          onSlidingStart={onSliderStartHandler}
          onSlidingComplete={onSliderCompleteHandler}
          onValueChange={seekTo}
          maximumValue={totalTime}
          minimumValue={0}
          step={1}
          allowTouchTrack
          trackStyle={{ height: 5, backgroundColor: 'transparent' }}
          thumbStyle={{ height: 20, width: 20, backgroundColor: 'transparent' }}
          thumbProps={{
            children: (
              <Icon
                name='heartbeat'
                type='font-awesome'
                size={20}
                reverse
                containerStyle={{ bottom: 20, right: 20 }}
              />
            ),
          }}
        />
        </View>
      )}

      <Text style={styles.title}>{title}</Text>

      {isLoading && <ActivityIndicator size='large' color='#8000ff' />}

      {!isLoading && (
        <View style={styles.bottom}>
          <Text
            style={[
              styles.timer,
              remainingTime > 300 ? styles.timerNormal : '',
              remainingTime <= 300 ? styles.timerWarning : '',
              remainingTime <= 60 ? styles.timerDanger : '',
            ]}
          >
            {formattedTime}
          </Text>

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
          <Icon
            color='black'
            size={80}
            name='ios-reload-circle-outline'
            type='ionicon'
            onPress={() => seekTo(0)}
          />
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
    marginTop: 20,
    marginBottom: 70,
    marginHorizontal: 10,
    fontSize: 22,
    fontWeight: 'bold',
  },

  bottom: {
    flex: 0.7,
    justifyContent: 'space-around',
    marginHorizontal: 20,
  },

  navContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  navButton: {
    overflow: 'hidden',
  },

  timer: {
    alignSelf: 'center',
    backgroundColor: 'green',
    color: 'white',
    textAlign: 'center',
    width: 300,
    fontSize: 40,
    padding: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 50,
  },

  timerNormal: {
    backgroundColor: 'green',
  },

  timerDanger: {
    backgroundColor: 'red',
  },

  timerWarning: {
    backgroundColor: 'orange',
  },
});

export default ActivityScreen;
