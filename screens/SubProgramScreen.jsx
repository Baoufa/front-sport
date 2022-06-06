import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import SubPrograms from '../data/SubPrograms';
import SubProgram from '../components/SubProgram';

function SubProgramScreen(props) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const data = JSON.parse(SubPrograms)
    .filter(item => item.program === props.route.params._id)
    .sort((a, b) => a.order - b.order);

  const [subProgramsData] = useState(data);

  const handlePress = (item) => {
    props.navigation.navigate('Activity', {
      item,
    });
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const renderItem = ({ item, index }) => {
    return (
      (
        <SubProgram
          item={item}
          index={index}
          handlePress={() => handlePress(item)}
        />
      )
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.title__left}>{props.route.params.name}</Text>
        <Text
          style={styles.title__right}
        >{`(niveau ${props.route.params.level})`}</Text>
      </View>

      {loading && (
        <ActivityIndicator size='large' color='#8000ff' style={{ flex: 1 }} />
      )}
      {!loading && (
        <FlatList
          refreshControl={
            <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
          }
          data={subProgramsData}
          renderItem={renderItem}
          keyExtractor={item => item._id}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    justifyContent: 'space-between',
  },

  title: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  title__left: {
    fontSize: 30,
    fontWeight: '500',
    marginRight: 10,
  },

  title__right: {
    fontSize: 25,
    fontWeight: '500',
  },
});

export default SubProgramScreen;
