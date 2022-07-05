import { Icon } from '@rneui/themed';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';

const Program = ({ item, height, index, handlePress }) => {
//  TouchableOpacity.defaultProps = { activeOpacity: .1 };


  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.container,
        { height },
        { backgroundColor: item.background },
      ]}
    >
    
        <ImageBackground
          style={styles.container__image}
          source={{ uri: item.poster_image }}
          resizeMode='cover'
        >
          <Text
            style={[
              styles.container__upper,
              { alignSelf: index % 2 ? 'flex-start' : 'flex-end' },
            ]}
          >
            {item.name}
          </Text>
        </ImageBackground>

        <View style={styles.container__lower}>
          <Icon
            style={styles.container__icon}
            type='feather'
            name={item.icon}
            color='#fff'
          />
          <Text style={styles.container__desc}>{item.description}</Text>
        </View>

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
  },

  container__image: {
    flex: 1,
    width: '100%',
  },

  container__upper: {
    padding: 10,
    fontSize: 30,
    fontWeight: '300',
    textTransform: 'uppercase',
    color: 'white',
  },

  container__lower: {
    padding: 15,
    flexDirection: 'row',
    backgroundColor: '#ef4444',
    alignItems: 'center',
  },

  container__icon: {
    flex: 0,
  },

  container__desc: {
    flex: 1,
    marginLeft: 10,
    color: 'white',
  },
});

export default Program;
