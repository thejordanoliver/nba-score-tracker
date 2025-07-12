import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState, useLayoutEffect } from "react";
import {
  Image,
  ScrollView,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { getStyles } from "../../styles/NewsArticle.style";
import { CustomHeaderTitle } from "@/components/CustomHeaderTitle";
import NewsArticleSkeleton from "@/components/NewsArticleSkeleton";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function NewsArticleScreen() {
  const navigation = useNavigation();
  const { url, title, thumbnail } = useLocalSearchParams<{
    url?: string;
    title?: string;
    thumbnail?: string;
  }>();

  const [scrapedContent, setScrapedContent] = useState<string>("");
  const [loadingContent, setLoadingContent] = useState(false);
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme === "dark");

  useEffect(() => {
    if (!url) {
      setScrapedContent("No URL provided.");
      return;
    }

    const fetchScrapedContent = async () => {
      try {
        setLoadingContent(true);
        const res = await fetch(
          `${API_URL}/api/scrape?url=${encodeURIComponent(url)}`
        );
        if (!res.ok) {
          throw new Error(`Failed to scrape content: ${res.status}`);
        }
        const data = await res.json();
        setScrapedContent(data.content || "No content available.");
      } catch (err) {
        console.error("Failed to scrape:", err);
        setScrapedContent("Failed to load content.");
      } finally {
        setLoadingContent(false);
      }
    };

    fetchScrapedContent();
  }, [url]);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <CustomHeaderTitle title="" onBack={() => navigation.goBack?.()} />
      ),
    });
  }, [navigation]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loadingContent ? (
        <NewsArticleSkeleton />
      ) : (
        <>
          {title && <Text style={styles.title}>{title}</Text>}
          {thumbnail && <Image source={{ uri: thumbnail }} style={styles.image} />}
          <Text style={styles.content}>{scrapedContent}</Text>
        </>
      )}
    </ScrollView>
  );
}
