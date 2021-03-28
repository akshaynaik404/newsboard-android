/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  Text,
  View,
  Linking,
  Alert,
} from 'react-native';

import {
  Appbar, ActivityIndicator, List,
  Divider, FAB, Snackbar,
  DefaultTheme
} from 'react-native-paper';

const App = () => {
  const [fetchState, setFetchState] = useState({
    isLoading: false,
    errorMsg: null,
    data: [],
  });
  const getNewsListFromApi = () => {
    return fetch('https://api.nytimes.com/svc/topstories/v2/home.json?api-key=ZL4OZZ5nk99JTJAbKYwA89ONuaNFiOzd')
      .then((response) => response.json())
      .then((json) => {
        return json.results;
      })
      .catch((error) => {
        throw new Error(error);
      });
  };

  const getData = async () => {
    setFetchState({
      isLoading: true,
      data: [],
      errorMsg: null,
    });
    try {
      const newsList = await getNewsListFromApi();
      setFetchState({
        isLoading: false,
        data: newsList,
      });
    } catch (error) {
      const errorMsgToDisplay = "Unable to feth news, Please try again later!";
      Alert.alert(errorMsgToDisplay);
      setFetchState({
        isLoading: false,
        errorMsg: errorMsgToDisplay,
      });
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handlePress = (url) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };
  return (
    <SafeAreaView>
      <Appbar.Header>
        <Appbar.Content title={<Text>Newsboard</Text>} style={styles.title} />
      </Appbar.Header>
      <Snackbar
        visible={!!fetchState.errorMsg}
        onDismiss={() => setFetchState({ errorMsg: null})}
        action={{
          label: 'Undo',
          onPress: () => {
            getData();
          },
        }}>
        <Text>{fetchState.errorMsg}</Text>
      </Snackbar>
      <View style={{ height: '100%' }}>
        {
          fetchState.isLoading ? (
            <View style={styles.loaderWrapper}>
              <ActivityIndicator
                size="large"
                animating={true}
                color={"#ccc"} />
            </View>
          ) : (
              (!fetchState?.data || fetchState?.data?.length === 0) ?
              <View style={styles.noDataFound}><Text>No data found</Text></View> :
              <FlatList
                keyExtractor={(item, index) => item.uri}
                data={fetchState.data}
                renderItem={({ item }) => {
                  return (
                    <>
                      <List.Item title={item.title} onPress={() => handlePress(item.url)} />
                      <Divider />
                    </>
                  );
                }}
              />
          )
        }
      </View>
      <View style={styles.fabView}>
        <FAB
          medium
          icon="autorenew"
          onPress={() => getData()}
          disabled={fetchState.isLoading}
          theme={{ colors: { accent: DefaultTheme.colors.primary } }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    alignItems: 'center',
  },
  fabView: {
    position: 'absolute',
    margin: 16,
    right: 150,
    bottom: 64,
  },

  loaderWrapper: {
    height: '100%',
    justifyContent: "center",
    alignItems: "center",
  },

  noDataFound: {
    height: '100%',
    justifyContent: "center",
    alignItems: "center",
  },

});

export default App;
