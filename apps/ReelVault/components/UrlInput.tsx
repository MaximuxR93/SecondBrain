import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";

import { useState } from "react";

import { validateUrl } from "../utils/validateUrl";

import { Ionicons } from "@expo/vector-icons";

export default function UrlInput() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!url.trim()) {
      Alert.alert(
        "Missing URL",
        "Please paste a video URL."
      );

      return;
    }

    const isValid = validateUrl(url);

    if (!isValid) {
      Alert.alert(
        "Invalid URL",
        "Only Instagram and YouTube URLs are supported."
      );

      return;
    }

    try {
      setLoading(true);

      await new Promise((resolve) =>
        setTimeout(resolve, 2000)
      );

      Alert.alert(
        "Success",
        "Video analyzed successfully."
      );
    } catch (error) {
      Alert.alert(
        "Error",
        "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="mt-10">
      <TextInput
        value={url}
        onChangeText={setUrl}
        placeholder="Paste video URL..."
        placeholderTextColor="#a1a1aa"
        className="bg-zinc-900 text-white p-5 rounded-2xl text-base"
      />

      <TouchableOpacity
        onPress={handleAnalyze}
        className="bg-white mt-5 p-5 rounded-2xl items-center flex-row justify-center"
      >
        <Ionicons
          name={loading ? "time" : "search"}
          size={20}
          color="black"
        />

        <Text className="text-black font-bold text-base ml-2">
          {loading
            ? "Analyzing..."
            : "Analyze Video"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}