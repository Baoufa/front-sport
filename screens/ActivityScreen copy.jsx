import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useState, useCallback, useRef, useEffect } from 'react';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useQuery } from '@apollo/client';

import PlayerNavigation from '../components/activity/PlayerNavigation';
import Timer from '../components/activity/Timer';

import { activityQuery, getPrevNextQuery } from '../graphql/queries';
import SliderNavigation from '../components/activity/SliderNavigation';

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_TOTAL_TIME':
      state.totalTime = action.payload;

    case 'PLAYING':
      state.isPlaying = true;

      if (action.payload) {
        state.elapsedTime = action.payload;
        state.remainingTime = state.totalTime - state.elapsedTime;
      }
      return state;

    case 'PAUSED':
      state.isPlaying = false;
      return state;

    case 'SEEK_TO':
      state.elapsedTime = action.payload;
      state.remainingTime = state.totalTime - state.elapsedTime;
      return state;

    default:
      return state;
  }
};

function ActivityScreen(props) {
  const FORWARD_AND_BACKWARD = 10; // in seconds
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
  const [totalTime, setTotalTime] = useState(
    props.route.params.item.duration_indicator
  );
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerStarted, setIsTimerStarted] = useState(false);

  const { title, order, program } = props.route.params.item;

  const [state, dispatch] = useReducer(reducer, {}, init);

  const { loading, error, data, refetch } = useQuery(activityQuery, {
    variables: { id: props.route.params.item._id },
  });

  const {
    loading: loading2,
    error: error2,
    data: data2,
  } = useQuery(getPrevNextQuery, {
    variables: { program: program, order: order },
  });

  const onPrevNextHandler = position => {
    if (data2.getPrevNext[position]) {
      props.navigation.replace('Activity', {
        item: data2.getPrevNext[position],
      });
    }
  };

  const onReadyHandler = () => {
    setIsLoading(false);
    if (playerRef.current) {
      playerRef.current
        .getDuration()
        .then(duration =>
          dispatch({ type: 'SET_TOTAL_TIME', payload: duration })
        );
    }
  };

  const onSlidingCompleteHandler = event => {
    if (wasPlaying) {
      setPlaying(true);
      setWasPlaying(false);
    }

    if (playerRef.current) {
      playerRef.current.seekTo(elapsedTime, true);
    }
  };

  const onSlidingStartHandler = () => {
    if (playing) {
      setWasPlaying(true);
      setPlaying(false);
    }
  };

  const muteHandler = () => {
    if (playerRef.current) {
      playerRef.current.isMuted().then(bool => setIsMuted(!bool));
    }
  };

  const seekTo = useCallback((time, press) => {
    setIsTimerStarted(true);
    setRemainingTime(totalTime - time);
    setElapsedTime(time);
    if ((time === 0 || press) && playerRef.current) {
      playerRef.current.seekTo(time, true);
    }
  });

  const onStateChange = useCallback(playerState => {
    if (playerState === 'ended') {
      dispatch({ type: 'PAUSED' });
    }
    if (playerState === 'paused') {
      dispatch({ type: 'PAUSED' });
    }
    if (playerState === 'playing') {
      dispatch({ type: 'PLAYING' });
    }
  }, []);

  const goForwardBackward = backfor => {
    setPlaying(false);
    if (playerRef.current) {
      forward_backward.current = setInterval(() => {
        playerRef.current.getCurrentTime().then(time => {
          seekTo(time + FORWARD_AND_BACKWARD * backfor, true);
        });
      }, 400);
    }
  };

  const pressOutHandler = () => {
    clearInterval(forward_backward.current);
    dispatch({ type: 'PLAYING' });
  };

  const togglePlaying = useCallback(() => {
    if(state.isPlaying) {
      dispatch({ type: 'PAUSED' });
    }

    if(!state.isPlaying) {
      dispatch({ type: 'PLAYING' });
    }

  }, []);

  useEffect(() => {
    props.navigation.setOptions({
      headerTitle: title,
    });
  }, []);

  useEffect(() => {
    clearInterval(interval.current);
    if (state.isPlaying && playerRef.current) {
      interval.current = setInterval(async () => {
        const time = await playerRef.current.getCurrentTime();
        setIsTimerStarted(true);
        setElapsedTime(time);
        setRemainingTime(totalTime - time);
      }, 900);
    }
    return () => {
      clearInterval(interval.current);
      clearInterval(forward_backward.current);
    };
  }, [playing, totalTime, playerRef]);

  // Render loading view while data is loading
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={{ height: 220, marginTop: 100 }}></View>
        <ActivityIndicator size='large' color='red' />
      </View>
    );
  }

  //Render page if data is not loading
  if (data) {
    return (
      <View style={styles.container}>
        {remainingTime > 0.5 && (
          <YoutubePlayer
            ref={playerRef}
            play={playing}
            height={220}
            videoId={data.activity.video_url}
            onChangeState={onStateChange}
            onReady={onReadyHandler}
            initialPlayerParams={{ controls: false }}
            mute={isMuted}
          />
        )}

        {remainingTime <= 0.5 && (
          <View
            style={{
              height: 220,
              justifyContent: 'center',
              alignItem: 'center',
            }}
          >
            <Text style={{ fontSize: 20, color: 'red', textAlign: 'center' }}>
              {' '}
              Go to Next
            </Text>
          </View>
        )}

        {isLoading && (
          <ActivityIndicator
            size='large'
            color='blue'
            style={{ marginTop: 100 }}
          />
        )}

        {!isLoading && (
          <View style={styles.bottom}>
            <SliderNavigation
              elapsedTime={elapsedTime}
              onSlidingStartHandler={onSlidingStartHandler}
              onSlidingCompleteHandler={onSlidingCompleteHandler}
              seekTo={seekTo}
              totalTime={totalTime}
            />

            <Timer
              remainingTime={remainingTime}
              isTimerStarted={isTimerStarted}
            />

            <PlayerNavigation
              data2={data2}
              goForwardBackward={goForwardBackward}
              onPrevNextHandler={onPrevNextHandler}
              pressOutHandler={pressOutHandler}
              playing={playing}
              togglePlaying={togglePlaying}
              isMuted={isMuted}
              muteHandler={muteHandler}
              seekTo={seekTo}
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },

  title: {
    marginHorizontal: 10,
    fontSize: 22,
    fontWeight: 'bold',
  },

  bottom: {
    flex: 1,
    justifyContent: 'flex-start',
    marginHorizontal: 20,
  },

  navButton: {
    overflow: 'hidden',
  },
});

export default ActivityScreen;
