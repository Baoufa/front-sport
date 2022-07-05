import { View, StyleSheet } from 'react-native';
import { Icon } from '@rneui/themed';

const PlayerNavigation = ({
  data2,
  goForwardBackward,
  onPrevNextHandler,
  pressOutHandler,
  playing,
  togglePlaying,
  isMuted,
  muteHandler,
  seekTo,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.navContainer}>
        <Icon
          color={data2.getPrevNext[0] ? '#ef4444' : '#fca5a5'}
          size={80}
          name='play-skip-back-circle'
          type='ionicon'
          onLongPress={() => goForwardBackward(-1)}
          onPress={() => data2.getPrevNext[0] && onPrevNextHandler(0)}
          onPressOut={pressOutHandler}
        />
        <Icon
          color='#ef4444'
          size={150}
          name={playing ? 'pause-circle' : 'play-circle'}
          type='ionicon'
          onPress={togglePlaying}
        />
        <Icon
          color={data2.getPrevNext[1] ? '#ef4444' : '#fca5a5'}
          size={80}
          name='play-skip-forward-circle'
          type='ionicon'
          onLongPress={() => goForwardBackward(1)}
          onPress={() => onPrevNextHandler(1)}
          onPressOut={pressOutHandler}
        />
      </View>
      <View style={styles.navContainer}>
        <Icon
          color='#ef4444'
          size={80}
          name='ios-reload-circle-outline'
          type='ionicon'
          onPress={() => seekTo(0)}
        />
        <Icon
          color={!isMuted ? '#ef4444' : '#fca5a5'}
          size={80}
          name={isMuted ? 'volume-off' : 'volume-up'}
          type='fontawesome'
          onPress={muteHandler}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    marginTop: 20,
  },

   navContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    borderRadius: 10,
    paddingVertical: 20,
    //marginBottom: 40,
  },

 
});

export default PlayerNavigation;
