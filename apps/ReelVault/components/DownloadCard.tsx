import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function DownloadCard() {
  return (
    <View className="bg-zinc-900 rounded-3xl p-5">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-white text-lg font-semibold">
            Anime Edit.mp4
          </Text>

          <Text className="text-zinc-400 mt-1">
            1080p • 12 MB
          </Text>
        </View>

        <Ionicons
          name="play-circle"
          size={42}
          color="white"
        />
      </View>
    </View>
  );
}