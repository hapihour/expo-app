import React, { useState, useEffect } from "react";
import { useTheme } from "react-native-paper";
import { View, FlatList, RefreshControl } from "react-native";
import { FeedItem } from "../../components/FeedItem";
import { fetchAlgoliaEvents } from "../../actions/events";
import { AlgoliaEvent } from "../../types";
import { StackNavigationProp } from "@react-navigation/stack";

import { RootStackParamList } from "../../types";
type Props = {
  navigation: StackNavigationProp<RootStackParamList, "Home">;
};

export const FeedScreen = ({ navigation }: Props) => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [algoliaEvents, setAlgoliaEvents] = useState<AlgoliaEvent[]>([]);
  const [page, setPage] = useState<number>(0);
  const theme = useTheme();
  const feedItemOnPressHandler = (algoliaEvent: AlgoliaEvent) => {
    navigation.push("ProfilePreview", { userId: algoliaEvent.userId });
  };

  useEffect(() => {
    (async () => {
      setAlgoliaEvents(await fetchAlgoliaEvents({ page }));
    })();
  }, []);

  useEffect(() => {
    setRefreshing(false);
  }, [algoliaEvents]);

  const onRefreshHandler = async () => {
    setRefreshing(true);
    const newAlgoliaEvents = await fetchAlgoliaEvents({ page: 0 });
    setAlgoliaEvents(newAlgoliaEvents);
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={{ backgroundColor: theme.colors.background }}
        style={{ backgroundColor: theme.colors.background }}
        data={algoliaEvents}
        renderItem={({ item }) => {
          return (
            <FeedItem algoliaEvent={item} onPress={feedItemOnPressHandler} />
          );
        }}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefreshHandler}
          />
        }
      />
    </View>
  );
};
