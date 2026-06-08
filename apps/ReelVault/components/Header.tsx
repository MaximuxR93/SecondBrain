import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Header() {
  return (
    <View className="flex-row items-center">
      <Ionicons
        name="download"
        size={32}
        color="white"
      />

      <Text className="text-white text-4xl font-bold ml-3">
        ReelVault
      </Text>
    </View>
  );
}