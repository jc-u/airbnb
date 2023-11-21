import { Text, View, TouchableOpacity } from "react-native";

const HomeScreen = ({ navigation }) => {
	return (
		<View>
			<Text>This is the HomeScreen component</Text>
			<TouchableOpacity onPress={() => navigation.navigate("Signin")}>
				<Text>Signin</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => navigation.navigate("Signup")}>
				<Text>Signup</Text>
			</TouchableOpacity>
		</View>
	);
};

export default HomeScreen;
