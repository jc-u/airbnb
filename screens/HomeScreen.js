import {
	Text,
	View,
	FlatList,
	Image,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/core";
import { useState, useEffect } from "react";

import { ActivityIndicator } from "react-native";
import renderStars from "../utils/renderStars";
import axios from "axios";

const HomeScreen = ({ setToken }) => {
	const navigation = useNavigation();
	const [rooms, setRooms] = useState([]);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (setToken) {
			navigation.navigate("Home");
		} else {
			navigation.navigate("Signin");
		}
	}, [setToken]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(
					"https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms"
				);

				setRooms(response.data);
				setIsLoading(false);
			} catch (error) {
				if (error.response) {
					setError(error.response.data.error);
					setIsLoading(false);
				} else {
					setError(
						"Une erreur est survenue lors de la récupération des offres."
					);
					setIsLoading(false);
				}
			}
		};

		fetchData();
	}, []);

	return isLoading ? (
		<ActivityIndicator size="large" color="#EB5A62" />
	) : (
		<View style={styles.roomsContainer}>
			<FlatList
				data={rooms}
				keyExtractor={(item) => item._id}
				renderItem={({ item }) => (
					<>
						<TouchableOpacity
							onPress={() => {
								navigation.navigate("Room", { roomId: item._id });
							}}>
							<View style={styles.roomCard}>
								<View style={styles.imgContainer}>
									{item.photos && item.photos.length > 0 && (
										<Image
											style={styles.img}
											source={{ uri: item.photos[0].url }}
										/>
									)}
									<Text style={styles.price}>{item.price} €</Text>
								</View>
								<View style={styles.descriptionContainer}>
									<Text numberOfLines={1} style={styles.title}>
										{item.title}
									</Text>
									<View style={styles.ratingContainer}>
										<View style={styles.stars}>
											{renderStars(item.ratingValue)}
										</View>
										<Text style={styles.reviews}>{item.reviews} reviews</Text>
									</View>
									<View style={styles.userContainer}>
										<Image
											style={styles.userImg}
											source={{ uri: item.user.account.photo.url }}
										/>
									</View>
								</View>
							</View>
						</TouchableOpacity>
					</>
				)}
			/>
		</View>
	);
};

export default HomeScreen;

const styles = StyleSheet.create({
	roomsContainer: {
		padding: 20,
		backgroundColor: "white",
	},
	roomCard: {
		borderBottomWidth: 2,
		borderColor: "rgba(187, 187, 187, 0.3)",
		marginBottom: 20,
	},
	imgContainer: {
		position: "relative",
	},
	img: {
		width: "100%",
		height: 200,
	},
	price: {
		position: "absolute",
		bottom: 10,
		left: 0,
		backgroundColor: "black",
		color: "white",
		paddingVertical: 12,
		paddingHorizontal: 25,
		fontSize: 20,
	},
	title: {
		fontSize: 18,
		marginVertical: 20,
		width: "80%",
	},
	descriptionContainer: {
		position: "relative",
	},
	ratingContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 20,
	},
	stars: {
		flexDirection: "row",
	},
	reviews: {
		color: "#BBBBBB",
	},
	userImg: {
		width: 78,
		height: 78,
		borderRadius: 50,
		position: "absolute",
		bottom: 15,
		right: 0,
	},
});
