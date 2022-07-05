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
import { useQuery } from '@apollo/client';

import SubProgram from '../components/SubProgram';
import { activitiesQuery } from '../graphql/queries';

function SubProgramScreen(props) {
  const SEP_HEIGHT = 10; // height of the separator
  const [refreshing, setRefreshing] = useState(false);

  const { loading, error, data, refetch } = useQuery(activitiesQuery, {
    variables: { program: props.route.params._id, order: 'asc' },
  });

  const handlePress = item => {
    props.navigation.navigate('Activity', {
      item,
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
      <SubProgram
        item={item}
        index={index}
        handlePress={() => handlePress(item)}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          styles.title,
          props.route.params.level === 1 ? styles.beginner : '',
          props.route.params.level === 2 ? styles.medium : '',
          props.route.params.level === 3 ? styles.advanced : '',
        ]}
      >
        <Text
          style={[
            styles.title__left,
            props.route.params.level === 1 ? styles.beginner : '',
            props.route.params.level === 2 ? styles.medium : '',
            props.route.params.level === 3 ? styles.advanced : '',
          ]}
        >
          {props.route.params.name}
        </Text>
        <Text
          style={[
            styles.title__right,
            props.route.params.level === 1 ? styles.beginner : '',
            props.route.params.level === 2 ? styles.medium : '',
            props.route.params.level === 3 ? styles.advanced : '',
          ]}
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
          data={data.activities}
          ItemSeparatorComponent={() => <View style={{ height: SEP_HEIGHT }} />}
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
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
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

  beginner: {
    backgroundColor: '#6ee7b7',
    color: '#064e3b',
  },

  medium: {
    backgroundColor: '#fdba74',
    color: '#7c2d12',
  },

  advanced: {
    backgroundColor: '#fca5a5',
    color: '#7f1d1d',
  },
});

export default SubProgramScreen;
