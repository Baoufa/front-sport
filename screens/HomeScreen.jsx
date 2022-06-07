import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Program from '../components/Program';
import ProgramList from '../data/ProgramList';

import { useQuery } from '@apollo/client';
import { programsQuery } from '../graphql/queries';
// import { activitiesQuery } from '../graphql/queries';

const HomeScreen = ({ navigation }) => {
  const SEP_HEIGHT = 10; // height of the separator
  const [itemHeight, setItemHeight] = useState(null);
  //const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [programsData] = useState(ProgramList);

  const { loading, error, data, refetch } = useQuery(programsQuery);

  useEffect(() => {
    console.log('error:', error);
    console.log('data:', data);
    console.log('loading:', loading);
  }, [data, error, loading]);

  const handlePress = (_id, level, name, background) => {
    navigation.navigate('SubProgram', {
      _id,
      level,
      name,
      mainColor: background,
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const renderItem = ({ item, index }) => {
    return (
      <Program
        item={item}
        index={index}
        height={itemHeight}
        handlePress={() =>
          handlePress(item._id, item.level, item.name, item.background)
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading && (
        <ActivityIndicator size='large' color='#8000ff' style={{ flex: 1 }} />
      )}
      {!loading && (
        <FlatList
          onLayout={event => {
            const { x, y, width, height } = event.nativeEvent.layout;
            setItemHeight(
              (height - SEP_HEIGHT * (programsData.length - 1)) /
                programsData.length
            );
          }}
          refreshControl={
            <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
          }
          contentContainerStyle={{
            flex: 1,
          }}
          ItemSeparatorComponent={() => <View style={{ height: SEP_HEIGHT }} />}
          data={programsData}
          renderItem={renderItem}
          keyExtractor={item => item._id}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    justifyContent: 'space-between',
  },
});

export default HomeScreen;
