import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import hstkFetch from "../../hstkFetch";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ({ route }) {
  // Reset comments to show //
  // AsyncStorage.clear();

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    hstkFetch(
      `https://jsonplaceholder.typicode.com/posts?id=${route.params.id}`
    )
      .then((response) => response.json())
      .then((json) => {
        setData(json);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    async function fetchAndFilter() {
      let toFilter = [];
      try {
        toFilter = JSON.parse(await AsyncStorage.getItem("hidden-comments"));
      } catch (e) {
        console.log(e);
      }
      hstkFetch(
        `https://jsonplaceholder.typicode.com/comments?postId=${route.params.id}`
      )
        .then((response) => response.json())
        .then((json) => {
          if (toFilter !== null) {
            json = json.filter((item) => {
              return toFilter.indexOf(item.id) < 0;
            });
          }
          setComments(json);
        })
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
    }

    fetchAndFilter();
  }, []);

  const hideComment = async (id) => {
    const filtered = comments.filter((comment) => {
      return comment.id != id;
    });
    try {
      const values = JSON.parse(await AsyncStorage.getItem("hidden-comments"));
      if (values === null) {
        await AsyncStorage.setItem("hidden-comments", JSON.stringify([id]));
      } else {
        await AsyncStorage.setItem(
          "hidden-comments",
          JSON.stringify([...values, id])
        );
      }
    } catch (e) {
      console.log(e);
    }
    setComments(filtered);
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" style={styles.padding} />
      ) : (
        <View style={{ flex: 1 }}>
          {data.length > 0 && (
            <View style={styles.padding}>
              <Text>{data[0].title}</Text>
              <Text>{data[0].body}</Text>
            </View>
          )}
          {comments.length > 0 && (
            <FlatList
              data={comments}
              keyExtractor={(item) => item.id}
              style={styles.listPadding}
              renderItem={({ item }) => (
                <View>
                  <Text style={{ marginBottom: 10 }}>Email:{item.email}</Text>
                  <Text>Comment: {item.body}</Text>
                  <Button
                    title="Hide Comment"
                    onPress={() => {
                      hideComment(item.id);
                    }}
                  />
                </View>
              )}
            />
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listPadding: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 50,
  },
  padding: {
    padding: 12,
  },
});
