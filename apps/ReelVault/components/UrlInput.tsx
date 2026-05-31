import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

export default function UrlInput() {
  return (
    <View className="mt-10">
      <TextInput
        placeholder="Paste video URL..."
        placeholderTextColor="#71717a"
        className="bg-zinc-900 text-white p-5 rounded-2xl text-base"
      />

      <TouchableOpacity className="bg-white mt-5 p-5 rounded-2xl items-center flex-row justify-center">
        <Ionicons name="search" size={20} color="black" />

        <Text className="text-black font-bold text-base ml-2">
          Analyze Video
        </Text>
      </TouchableOpacity>
    </View>
  );
}