import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "react-native";

import HomeScreen from "./screens/HomeScreen";
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import SettingsScreen from "./screens/SettingsScreen";
import RoomScreen from "./screens/RoomScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
	const [isLoading, setIsLoading] = useState(true);
	const [userToken, setUserToken] = useState(null);

	const setToken = async (token) => {
		if (token) {
			// Connexion
			await AsyncStorage.setItem("userToken", token);
		} else {
			// Deconnexion
			await AsyncStorage.removeItem("userToken");
		}

		setUserToken(token);
	};

	useEffect(() => {
		// Fetch the token from storage then navigate to our appropriate place
		const bootstrapAsync = async () => {
			// We should also handle error for production apps
			const userToken = await AsyncStorage.getItem("userToken");

			// This will switch to the App screen or Auth screen and this loading
			// screen will be unmounted and thrown away.
			setUserToken(userToken);

			setIsLoading(false);
		};

		bootstrapAsync();
	}, []);

	if (isLoading === true) {
		// We haven't finished checking for the token yet
		return null;
	}

	return (
		<NavigationContainer>
			<Stack.Navigator>
				{userToken === null ? (
					// No token found, user isn't signed in
					<>
						<Stack.Screen name="Signin">
							{() => <SignInScreen setToken={setToken} />}
						</Stack.Screen>
						<Stack.Screen name="Signup" options={{ headerShown: false }}>
							{() => <SignUpScreen setToken={setToken} />}
						</Stack.Screen>
					</>
				) : (
					// User is signed in ! 🎉
					<Stack.Screen name="Tab" options={{ headerShown: false }}>
						{() => (
							<Tab.Navigator
								screenOptions={{
									headerShown: false,
									tabBarActiveTintColor: "tomato",
									tabBarInactiveTintColor: "gray",
									tabBarStyle: { height: 80, paddingBottom: 20 },
								}}>
								<Tab.Screen
									name="TabHome"
									options={{
										tabBarLabel: "Home",
										tabBarIcon: ({ color, size }) => (
											<Ionicons name={"ios-home"} size={size} color={color} />
										),
									}}>
									{() => (
										<Stack.Navigator>
											<Stack.Screen
												name="Home"
												options={{
													title: "My App",
													headerTitleAlign: "center",
													headerTitleStyle: {
														color: "white",
													},
													headerTitle: (props) => (
														<Image
															source={require("./assets/logo.png")}
															style={{ width: 30, height: 30 }}
														/>
													),
												}}>
												{() => <HomeScreen setToken={setToken} />}
											</Stack.Screen>
											<Stack.Screen
												name="Room"
												component={RoomScreen}
												options={{
													title: "Room",
													headerTitleAlign: "center",
													headerTitleStyle: {
														color: "white",
													},
													headerTitle: (props) => (
														<Image
															source={require("./assets/logo.png")}
															style={{ width: 30, height: 30 }}
														/>
													),
												}}
											/>
										</Stack.Navigator>
									)}
								</Tab.Screen>
								<Tab.Screen
									name="TabSettings"
									options={{
										tabBarLabel: "Settings",
										tabBarIcon: ({ color, size }) => (
											<Ionicons
												name={"ios-options"}
												size={size}
												color={color}
											/>
										),
									}}>
									{() => (
										<Stack.Navigator>
											<Stack.Screen
												name="Settings"
												options={{
													title: "Settings",
												}}>
												{() => <SettingsScreen setToken={setToken} />}
											</Stack.Screen>
										</Stack.Navigator>
									)}
								</Tab.Screen>
							</Tab.Navigator>
						)}
					</Stack.Screen>
				)}
			</Stack.Navigator>
		</NavigationContainer>
	);
}
