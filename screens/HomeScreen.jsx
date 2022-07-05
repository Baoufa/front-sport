import { useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useQuery } from '@apollo/client';

import Program from '../components/Program';
import { programsQuery } from '../graphql/queries';
import useAuthContext from '../hooks/useAuthContext.js';

const HomeScreen = ({ navigation }) => {
  const SEP_HEIGHT = 10; // height of the separator
  const [itemHeight, setItemHeight] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const context = useAuthContext();
  console.log(context);

  const { loading, error, data, refetch } = useQuery(programsQuery, {
    variables: { sort: 'asc' },
  });

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
              (height - SEP_HEIGHT * (data.programs.length - 1)) /
                data.programs.length
            );
          }}
          refreshControl={
            <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
          }
          contentContainerStyle={{
            flex: 1,
          }}
          ItemSeparatorComponent={() => <View style={{ height: SEP_HEIGHT }} />}
          data={data.programs}
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
