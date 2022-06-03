import { Text, Button, View, Alert, StyleSheet } from 'react-native';
import { useState, useCallback, useRef } from 'react';
import { WebView } from 'react-native-webview';
import YoutubePlayer from 'react-native-youtube-iframe';
import { Icon } from '@rneui/themed';

function ActivityScreen(props) {
  const { _id, title, video_url, poster_image, duration_indicator} =
    props.route.params;
  
  console.log(props.navigation)  

  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback(state => {
    if (state === 'ended') {
      setPlaying(false);
      Alert.alert('video has finished playing!');
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying(prev => !prev);
  }, []);

  const Timer = ({ durationIndicator }) => {
    const [duration, setDuration] = useState(durationIndicator);

    return <Text>{duration}</Text>;
  };

  return (
    <View style={styles.container}>
      <View>
        <YoutubePlayer
          height={300}
          play={playing}
          videoId={video_url}
          onChangeState={onStateChange}
        />
         <Text>{title}</Text>
      </View>
      <View style={styles.navContainer}>
      < Button style={styles.btn} title='prev' onPress={togglePlaying} />
        <Button style={styles.btn} title={playing ? 'pause' : 'play'} onPress={togglePlaying} />
        <Button style={styles.btn} title='next' onPress={togglePlaying} />
      </View>
      <Timer durationIndicator={duration_indicator} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    justifyContent: 'space-between',
  },

  navContainer: {
    flexDirection: 'row',
    backgroundColor: 'red',
    justifyContent: 'center',
  },

  btn: {
    flex: 1,
  },

  timer: {
    backgroundColor: 'red',
    color: 'white',
    fontSize: 20,
    padding: 10,
    borderRadius: 10,
  },
});

export default ActivityScreen;
