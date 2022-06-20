import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import hstkFetch from "../../hstkFetch";

import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";

export default function ({ navigation }) {
  const [initialData, setInitialData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    hstkFetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((json) => {
        setData(json);
        setInitialData(json);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const filterData = (text) => {
    const newData = initialData.filter((item) => {
      const itemData = item.title.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setData(newData);
    setText(text);
  };

  return (
    <SafeAreaView>
      {isLoading ? (
        <ActivityIndicator size="large" style={styles.padding} />
      ) : (
        <View>
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<Text style={styles.padding}>Not Found</Text>}
            ListHeaderComponent={
              <TextInput
                style={styles.input}
                placeholder="Search Here"
                value={text}
                onChangeText={(text) => filterData(text)}
              />
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("part-three-detail", { id: item.id });
                }}
              >
                <View style={styles.container}>
                  <MaterialCommunityIcons name="ninja" size={20} />
                  <View style={styles.item}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text>{item.id}</Text>
                  </View>
                  <View>
                    <AntDesign name="right" color="#151515" size={20} />
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  item: {
    flex: 1,
    flexDirection: "column",
    marginLeft: 2,
  },
  itemTitle: {
    flexDirection: "row",
    maxWidth: "50%",
  },
  padding: {
    padding: 12,
  },
});
