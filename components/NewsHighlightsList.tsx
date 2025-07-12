// components/NewsHighlightsList.tsx
import React from "react";
import { FlatList, Text, useColorScheme, View } from "react-native";
import HighlightCard from "./HighlightCard";
import NewsCard from "./NewsCard";
import NewsCardSkeleton from "./NewsCardSkeleton";

type NewsItem = {
  id: string;
  title: string;
  source: string;
  url: string;
  thumbnail?: string;
  publishedAt?: string;
};

type HighlightItem = {
  videoId: string;
  title: string;
  publishedAt: string;
  thumbnail: string;
};

type CombinedItem =
  | (NewsItem & { itemType: "news" })
  | (HighlightItem & { itemType: "highlight" });

type NewsHighlightsListProps = {
  items: CombinedItem[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
};

const NewsHighlightsList: React.FC<NewsHighlightsListProps> = ({
  items,
  loading,
  refreshing,
  onRefresh,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  if (loading) {
    return (
      <View
        style={{
          paddingTop: 10,
          paddingHorizontal: 16,
          paddingBottom: 100,
        }}
      >
        <NewsCardSkeleton />
        <NewsCardSkeleton />
        <NewsCardSkeleton />
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) =>
        item.itemType === "news" ? item.id : item.videoId
      }
      refreshing={refreshing}
      onRefresh={onRefresh}
      contentContainerStyle={{
        paddingBottom: 100,
        paddingTop: 10,
        paddingHorizontal: 16, // 👈 add this
      }}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) =>
        item.itemType === "news" ? (
          <NewsCard
            id={item.id}
            title={item.title}
            source={item.source}
            url={item.url}
            thumbnail={item.thumbnail}
          />
        ) : (
          <HighlightCard
            videoId={item.videoId}
            title={item.title}
            publishedAt={item.publishedAt}
            thumbnail={item.thumbnail}
          />
        )
      }
      ListEmptyComponent={
        <Text
          style={{
            textAlign: "center",
            marginTop: 20,
            color: isDark ? "#aaa" : "#999",
          }}
        >
          No news or highlights found.
        </Text>
      }
    />
  );
};

export default NewsHighlightsList;
