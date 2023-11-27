import { useState, useEffect } from "react";
import axios from "axios";
import {
	ActivityIndicator,
	View,
	Text,
	Image,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
} from "react-native";
import renderStars from "../utils/renderStars";
import { AntDesign } from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { FontAwesome } from "@expo/vector-icons";

const RoomScreen = ({ route }) => {
	const [room, setRoom] = useState([]);
	const [error, setError] = useState(null);
	const [isTextTruncated, setIsTextTruncated] = useState(true);
	const [isLoading, setIsLoading] = useState(true);
	const [coordinates, setCoordinates] = useState({
		longitude: 2.333333,
		latitude: 48.866667,
	});

	const { roomId } = route.params;

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(
					`https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms/${roomId}`
				);
				setRoom(response.data);
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
		<>
			<ScrollView>
				<View style={styles.roomCard}>
					<View style={styles.imgContainer}>
						{room.photos && room.photos.length > 0 && (
							<Image style={styles.img} source={{ uri: room.photos[0].url }} />
						)}
						<Text style={styles.price}>{room.price} €</Text>
					</View>
					<View style={styles.descriptionContainer}>
						<Text numberOfLines={1} style={styles.title}>
							{room.title}
						</Text>
						<View style={styles.ratingContainer}>
							<View style={styles.stars}>{renderStars(room.ratingValue)}</View>
							<Text style={styles.reviews}>{room.reviews} reviews</Text>
						</View>
						<Text
							numberOfLines={isTextTruncated ? 3 : null}
							style={styles.descritption}>
							{room.description}
						</Text>
						<TouchableOpacity
							title={isTextTruncated ? "Show more" : "Show less"}
							onPress={() => setIsTextTruncated(!isTextTruncated)}
							style={styles.show}>
							<Text style={styles.showMore}>
								{isTextTruncated ? "Show more" : "Show less"}
							</Text>
							<AntDesign
								name={isTextTruncated ? "caretdown" : "caretup"}
								size={14}
								style={isTextTruncated ? styles.iconMore : styles.iconLess}
							/>
						</TouchableOpacity>
						<View style={styles.userContainer}>
							{room.user && room.user.account && room.user.account.photo && (
								<Image
									style={styles.userImg}
									source={{ uri: room.user.account.photo.url }}
								/>
							)}
						</View>
					</View>
				</View>
				<View style={styles.container}>
					<MapView
						style={styles.map}
						// Pour demander à Iphone d'utiliser GoogleMaps plutôt que Maps
						provider={PROVIDER_GOOGLE}
						// Dévinition du centrage de la carte
						initialRegion={{
							longitude: coordinates.longitude,
							latitude: coordinates.latitude,
							// Niveau de zoom de la carte
							latitudeDelta: 0.1,
							longitudeDelta: 0.1,
						}}
						// Afficher la position de l'utilisateur (fonctionne uniquement si l'utilisateur à accepter le partage de sa localisation)
						showsUserLocation>
						{/* // Affichage des marqueur dont les coordonées sont dans le tableau */}
						<Marker
							key={room._id}
							coordinate={{
								longitude: room.location[0],
								latitude: room.location[1],
							}}
							title={room.title}
							description={room.description}>
							<FontAwesome name="map-marker" size={24} color="#EB5A62" />
						</Marker>
					</MapView>
				</View>
			</ScrollView>
		</>
	);
};

export default RoomScreen;

const styles = StyleSheet.create({
	roomCard: {
		marginBottom: 20,
	},
	imgContainer: {
		position: "relative",
	},
	img: {
		width: "100%",
		height: 300,
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
		paddingHorizontal: 20,
	},
	show: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 10,

		alignItems: "flex-start",
	},
	showMore: {
		color: "#BBBBBB",
		marginRight: 5,
	},
	iconMore: { color: "#717171" },
	ratingContainer: {
		flexDirection: "row",
		alignItems: "baseline",
	},
	iconLess: { color: "#717171", marginTop: 5 },
	ratingContainer: {
		flexDirection: "row",
		alignItems: "baseline",
	},
	stars: {
		flexDirection: "row",
	},
	reviews: {
		color: "#BBBBBB",
	},
	userContainer: {
		position: "absolute",
		top: 10,
		right: 20,
	},
	userImg: {
		width: 78,
		height: 78,
		borderRadius: 50,
	},
	descritption: {
		lineHeight: 20,
		marginTop: 10,
	},
	container: {
		flex: 1,
		backgroundColor: "#fff",
		// alignItems: "center",
		justifyContent: "center",
	},
	map: {
		// Par défault, il prend toute la largeur de son parent car nous somme en flexbox
		height: 250,
	},
});
