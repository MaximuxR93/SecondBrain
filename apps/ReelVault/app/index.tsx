import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from "react-native";

import { useState } from "react";

import { analyzeVideo } from "../services/videoService";

import { downloadVideo } from "../services/downloadService";

export default function Home() {
  const [url, setUrl] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [videoData, setVideoData] =
    useState<any>(null);

  const handleAnalyze = async () => {
    if (!url.trim()) {
      Alert.alert(
        "Missing URL",
        "Please paste a video URL."
      );

      return;
    }

    try {
      setLoading(true);

      const data = await analyzeVideo(url);

      setVideoData(data);
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to analyze video."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (
    formatId: string
  ) => {
    try {
      await downloadVideo(url, formatId);

      Alert.alert(
        "Success",
        "Video downloaded successfully."
      );
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to download video."
      );
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#000",
      }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 60,
          paddingBottom: 40,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 36,
            fontWeight: "bold",
          }}
        >
          ReelVault
        </Text>

        <Text
          style={{
            color: "#a1a1aa",
            marginTop: 10,
            fontSize: 16,
          }}
        >
          Download Instagram reels and
          YouTube videos.
        </Text>

        <TextInput
          value={url}
          onChangeText={setUrl}
          placeholder="Paste video URL..."
          placeholderTextColor="#71717a"
          style={{
            backgroundColor: "#18181b",
            color: "white",
            marginTop: 40,
            padding: 18,
            borderRadius: 18,
            fontSize: 16,
          }}
        />

        <TouchableOpacity
          onPress={handleAnalyze}
          style={{
            backgroundColor: "white",
            marginTop: 20,
            padding: 18,
            borderRadius: 18,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "black",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            {loading
              ? "Analyzing..."
              : "Analyze Video"}
          </Text>
        </TouchableOpacity>

        {videoData && (
          <View
            style={{
              marginTop: 40,
              backgroundColor: "#18181b",
              borderRadius: 20,
              padding: 16,
            }}
          >
            <Image
              source={{
                uri: videoData.thumbnail,
              }}
              style={{
                width: "100%",
                height: 200,
                borderRadius: 12,
              }}
              resizeMode="cover"
            />

            <Text
              style={{
                color: "white",
                fontSize: 20,
                fontWeight: "bold",
                marginTop: 16,
              }}
            >
              {videoData.title}
            </Text>

            <Text
              style={{
                color: "#a1a1aa",
                marginTop: 8,
                fontSize: 15,
              }}
            >
              Creator:{" "}
              {videoData.uploader}
            </Text>

            <Text
              style={{
                color: "#a1a1aa",
                marginTop: 4,
                fontSize: 15,
              }}
            >
              Duration:{" "}
              {videoData.duration}s
            </Text>

            <Text
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: "600",
                marginTop: 24,
                marginBottom: 12,
              }}
            >
              Available Qualities
            </Text>

            <View>
              {videoData.formats?.map(
                (
                  format: any,
                  index: number
                ) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() =>
                      handleDownload(
                        format.formatId
                      )
                    }
                    style={{
                      backgroundColor:
                        "#27272a",

                      padding: 16,

                      borderRadius: 14,

                      marginBottom: 12,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 15,
                        fontWeight: "600",
                      }}
                    >
                      Download{" "}
                      {format.quality}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}