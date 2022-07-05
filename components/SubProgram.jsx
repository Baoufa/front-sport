import { Icon } from '@rneui/themed';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Image,  Skeleton  } from '@rneui/themed';
//import { icon } from 'react-native-elements';



const SubProgram = ({ item, index, handlePress }) => {
//  TouchableOpacity.defaultProps = { activeOpacity: .1 };
  
  const {_id, title, program, video_url, poster_image, duration_indicator, order} = item;

  return (
    <TouchableOpacity
    onPress={handlePress}
    style={[
      styles.container,
      { backgroundColor: index % 2 ? '#fef2f2' : 'white' }
    ]}
  >
       <Image
        style={styles.container__image}
        PlaceholderContent={<Skeleton width={100} height={400} animation="wave" />}
        source={{
          uri: poster_image
        }}
      />
      <View style={styles.container__right}>
        <Text style={styles.container__upper}>{title}</Text>
        <View style={styles.container__lower}>
        <Icon
            style={styles.container__icon}
            type='feather'
            name='clock'
            color='white'
          />
          <Text style={styles.container__desc}>{duration_indicator / 100} min</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 25,
    overflow: 'hidden',
  },

  container__image: {
    width: 100,
    height: 100,
    borderRadius: 20,
    overflow: 'hidden',
  },

  container__right: {
    flex: 4,
    height: 100,
    alignItems: 'flex-end',
    padding: 10,
    justifyContent: 'space-between',
  },

  container__upper: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ef4444'
  },

  container__lower: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#fca5a5',
    padding: 5,
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 10,
 
  },

  container__icon: {
    flex: 0,
    marginRight: 5,

  },

  container__desc: {
    fontWeight: '500',
    color: 'white',
  },
});

export default SubProgram;
