import {
	TouchableOpacity,
	View,
	StyleSheet,
	ActivityIndicator,
	useWindowDimensions,
} from "react-native";
import { useState, useEffect } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";

const AroundMeScreen = ({ setToken }) => {
	const navigation = useNavigation();
	const [rooms, setRooms] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [coordinates, setCoordinates] = useState({
		longitude: 2.333333,
		latitude: 48.866667,
	});

	const styles = useStyle();

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
				// Demander la permission d'accéder à la localisation
				const { status } = await Location.requestForegroundPermissionsAsync();
				if (status === "granted") {
					// Obtenir la localisation actuelle
					const location = await Location.getCurrentPositionAsync({});
					const { latitude, longitude } = location.coords;

					// Mettre à jour la localisation de l'utilisateur
					setCoordinates({ latitude, longitude });

					// Appeler l'API avec la latitude et la longitude
					const response = await axios.get(
						`https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms/around?latitude=${latitude}&longitude=${longitude}`
					);

					setCoordinates({ latitude, longitude });
					setRooms(response.data);
				} else {
					const response = await axios.get(
						`https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms`
					);

					setRooms(response.data);
				}
			} catch (error) {
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	return isLoading ? (
		<ActivityIndicator size="large" color="#EB5A62" />
	) : (
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

				{rooms.map((room) => {
					return (
						<Marker
							key={room._id}
							coordinate={{
								longitude: room.location[0],
								latitude: room.location[1],
							}}
							title={room.title}
							description={room.description}
							onPress={() =>
								navigation.navigate("RoomScreen", { roomId: room._id })
							}>
							<FontAwesome name="map-marker" size={24} color="#EB5A62" />
						</Marker>
					);
				})}
			</MapView>
		</View>
	);
};

export default AroundMeScreen;
const useStyle = () => {
	// On destructure l'objet retourné par le hook `useWindowDimensions`
	const { height, width } = useWindowDimensions();

	// On créé notre feuille de style
	const styles = StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: "#fff",
			// alignItems: "center",
			justifyContent: "center",
		},
		map: {
			// Par défault, il prend toute la largeur de son parent car nous somme en flexbox
			height: height,
		},
	});
	return styles;
};
