import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

import HomeScreen from "./screens/HomeScreen";
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import ProfileScreen from "./screens/ProfileScreen";
import RoomScreen from "./screens/RoomScreen";
import AroundMeScreen from "./screens/AroundMeScreen";
import HeaderLogo from "./components/HeaderLogo";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
	const [isLoading, setIsLoading] = useState(true);
	const [userToken, setUserToken] = useState(null);

	const setToken = async (token, userId) => {
		if (token) {
			// Connexion
			await AsyncStorage.setItem("userToken", token);
			await AsyncStorage.setItem("userId", userId);
		} else {
			// Deconnexion
			await AsyncStorage.removeItem("userToken");
			await AsyncStorage.removeItem("userId");
		}

		setUserToken(token);
	};

	const getUserId = async () => {
		try {
			const userId = await AsyncStorage.getItem("userId");
			if (userId !== null) {
				return userId;
			}
		} catch (e) {
			// error reading value
			console.log(e);
		}
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
													headerTitleAlign: "center",
													headerTitleStyle: {
														color: "white",
													},
													headerTitle: () => <HeaderLogo />,
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
													headerTitle: () => <HeaderLogo />,
												}}
											/>
										</Stack.Navigator>
									)}
								</Tab.Screen>
								<Tab.Screen
									name="TabAroundMe"
									options={{
										tabBarLabel: "Around me",
										tabBarIcon: ({ color, size }) => (
											<FontAwesome
												name="map-marker"
												size={size}
												color={color}
											/>
										),
									}}>
									{() => (
										<Stack.Navigator>
											<Stack.Screen
												name="Around me"
												options={{
													headerTitleAlign: "center",
													headerTitleStyle: {
														color: "white",
													},
													headerTitle: () => <HeaderLogo />,
												}}>
												{() => <AroundMeScreen setToken={setToken} />}
											</Stack.Screen>
											<Stack.Screen
												name="RoomScreen"
												component={RoomScreen}
												options={{
													title: "Room",
													headerTitleAlign: "center",
													headerTitleStyle: {
														color: "white",
													},
													headerTitle: () => <HeaderLogo />,
												}}></Stack.Screen>
										</Stack.Navigator>
									)}
								</Tab.Screen>
								<Tab.Screen
									name="TabSettings"
									options={{
										tabBarLabel: "Settings",
										tabBarIcon: ({ color, size }) => (
											<Ionicons
												name="md-person-circle-outline"
												size={size}
												color={color}
											/>
										),
									}}>
									{() => (
										<Stack.Navigator>
											<Stack.Screen
												name="Profile"
												options={{
													headerTitleAlign: "center",
													headerTitleStyle: {
														color: "white",
													},
													headerTitle: () => <HeaderLogo />,
												}}>
												{() => (
													<ProfileScreen
														setToken={setToken}
														getUserId={getUserId}
														userToken={userToken}
													/>
												)}
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
