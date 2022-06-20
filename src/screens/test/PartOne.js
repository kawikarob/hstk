import React from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";

import localPlaceholderData from "../../localPlaceholderData";

export default function () {
  return (
    <SafeAreaView>
      <FlatList
        keyExtractor={(item) => item.id}
        data={localPlaceholderData}
        renderItem={({ item }) => (
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
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "flex-start",
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
});
