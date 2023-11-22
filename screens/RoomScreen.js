import { useState, useEffect } from "react";
import axios from "axios";
import {
	ActivityIndicator,
	View,
	Text,
	Image,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import renderStars from "../utils/renderStars";
import { AntDesign } from "@expo/vector-icons";

const RoomScreen = ({ route }) => {
	const [room, setRoom] = useState([]);
	const [error, setError] = useState(null);
	const [isTextTruncated, setIsTextTruncated] = useState(true);
	const [isLoading, setIsLoading] = useState(true);

	const { roomId } = route.params;

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(
					`https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms/${roomId}`
				);
				console.log(JSON.stringify(response.data, null, 2));
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
						style={styles.icon}
					/>
				</TouchableOpacity>
				<View style={styles.userContainer}>
					<Image
						style={styles.userImg}
						source={{ uri: room.user.account.photo.url }}
					/>
				</View>
			</View>
		</View>
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
	},
	showMore: {
		color: "#BBBBBB",
		marginRight: 5,
	},
	icon: { color: "#717171", marginTop: 4 },
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
	},
});
