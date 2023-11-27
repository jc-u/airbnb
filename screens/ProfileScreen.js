import {
	Text,
	View,
	Image,
	TouchableOpacity,
	TextInput,
	ActivityIndicator,
	StyleSheet,
	useWindowDimensions,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useState, useEffect } from "react";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const ProfileScreen = ({ setToken, getUserId, userToken }) => {
	const [user, setUser] = useState(null);
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [description, setDescription] = useState("");
	const [photo, setPhoto] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const styles = useStyle();

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			const userId = await getUserId();
			const response = await axios.get(
				`https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/${userId}`,
				{
					headers: {
						Authorization: `Bearer ${userToken}`,
					},
				}
			);

			setUser(response.data);
			setEmail(response.data.email);
			setUsername(response.data.username);
			setDescription(response.data.description);
			if (response.data.photo) {
				setPhoto(response.data.photo.url);
			}
			setIsLoading(false);
		};

		fetchData();
	}, []);

	const handleUpdate = async () => {
		setIsLoading(true);
		try {
			if (
				email.trim() === "" ||
				username.trim() === "" ||
				description.trim() === ""
			) {
				setErrorMessage("Tous les champs sont obligatoires.");
				return;
			}

			const userId = await getUserId();
			let formData = new FormData();

			formData.append("email", email);
			formData.append("username", username);
			formData.append("description", description);

			// Mettre à jour les informations de l'utilisateur
			await axios.put(
				`https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/update`,
				{
					email,
					username,
					description,
				},
				{
					headers: {
						Authorization: `Bearer ${userToken}`,
					},
				}
			);

			// Mettre à jour la photo de profil de l'utilisateur
			if (photo) {
				const tab = photo.split(".");
				const formData = new FormData();
				formData.append("photo", {
					uri: photo,
					name: `my-pic.${tab[tab.length - 1]}`,
					type: `image/${tab[tab.length - 1]}`,
				});

				await axios.put(
					`https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/upload_picture`,
					formData,
					{
						headers: {
							Authorization: `Bearer ${userToken}`,
							"Content-Type": "multipart/form-data",
						},
					}
				);
				alert("Photo envoyée");
			}
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<KeyboardAwareScrollView>
			{user ? (
				<>
					<View style={styles.imgProfile}>
						<View style={styles.imgBorder}>
							{photo ? (
								<Image style={styles.img} source={{ uri: photo }} />
							) : (
								<MaterialIcons name="person" size={155} color="gray" />
							)}
						</View>
						{photo && (
							<TouchableOpacity
								style={styles.deleteIcon}
								onPress={() => setPhoto(null)}>
								<MaterialIcons name="close" size={28} color="gray" />
							</TouchableOpacity>
						)}

						<View style={styles.btnProfile}>
							<TouchableOpacity
								title="Upload"
								onPress={async () => {
									const { status } =
										await ImagePicker.requestMediaLibraryPermissionsAsync();
									if (status === "granted") {
										const result = await ImagePicker.launchImageLibraryAsync({
											allowsEditing: true,
											aspect: [1, 1],
										});
										if (result.canceled === true) {
											alert("Pas de photo sélectionnée");
										} else {
											console.log(result.assets[0].uri);
											setPhoto(result.assets[0].uri);
										}
									} else {
										alert("Permission refusée");
									}
								}}>
								<MaterialIcons name="image" size={28} color="gray" />
							</TouchableOpacity>
							<TouchableOpacity
								title="Take Photo"
								onPress={async () => {
									const { status } =
										await ImagePicker.requestCameraPermissionsAsync();
									if (status === "granted") {
										const result = await ImagePicker.launchCameraAsync({
											allowsEditing: true,
											aspect: [1, 1],
										});
										if (result.canceled === true) {
											alert("Pas de photo sélectionnée");
										} else {
											console.log(result.assets[0].uri);
											setPhoto(result.assets[0].uri);
										}
									} else {
										alert("Permission refusée");
									}
								}}>
								<MaterialIcons name="photo-camera" size={28} color="gray" />
							</TouchableOpacity>
						</View>
					</View>
					<View style={styles.form}>
						<TextInput
							style={styles.input}
							defaultValue={user.email}
							onChangeText={(text) => {
								setErrorMessage("");
								setEmail(text);
							}}
						/>
						<TextInput
							style={styles.input}
							defaultValue={user.username}
							onChangeText={(text) => {
								setErrorMessage("");
								setUsername(text);
							}}
						/>
						<TextInput
							style={[styles.input, styles.description]}
							multiLine={true}
							textAlignVertical="top"
							defaultValue={user.description}
							onChangeText={(text) => {
								setErrorMessage("");
								setDescription(text);
							}}
						/>
					</View>
					<View style={styles.errorContainer}>
						{errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
					</View>
					<View style={styles.btnContainer}>
						{isLoading === true ? (
							<ActivityIndicator size="small" color="#EB5A62" />
						) : (
							<TouchableOpacity onPress={handleUpdate} style={styles.btn}>
								<Text style={styles.btnText}>Update</Text>
							</TouchableOpacity>
						)}
						<TouchableOpacity
							style={[styles.btn, styles.btnLogout]}
							onPress={() => {
								setToken(null);
								getUserId(null);
							}}>
							<Text style={styles.btnText}>Log out</Text>
						</TouchableOpacity>
					</View>
				</>
			) : null}
		</KeyboardAwareScrollView>
	);
};
export default ProfileScreen;

const useStyle = () => {
	// utilisation du hook "useWindowDimensions"
	const { height, width } = useWindowDimensions();

	// Créatioon du style
	const styles = StyleSheet.create({
		imgProfile: {
			flexDirection: "row",
			justifyContent: "center",
			alignItems: "center",
			height: 200,
			position: "relative",
		},
		imgBorder: {
			borderWidth: 1,
			borderRadius: 150,
			borderColor: "#EB5A62",
			height: 180,
			width: 180,
			padding: 13,
			overflow: "hidden",
		},
		img: {
			width: 150,
			height: 150,
			borderRadius: 150,
		},
		deleteIcon: {
			position: "absolute",
			top: "5%",
			right: "35%",
		},
		btnProfile: {
			marginLeft: 20,
			justifyContent: "space-between",
			height: 100,
		},
		form: {
			marginTop: 40,
		},
		input: {
			borderBottomWidth: 1,
			borderColor: "#EB5A62",
			paddingVertical: 10,
			marginHorizontal: 35,
			width: width * 0.8,
			marginBottom: 40,
		},
		description: {
			borderWidth: 1,
			paddingBottom: 70,
			paddingLeft: 10,
		},
		errorContainer: {
			height: 50,
			textAlign: "center",
			width: width * 0.8,
			justifyContent: "center",
			alignItems: "center",
			flexWrap: "wrap",
			marginHorizontal: 80,
		},
		error: {
			color: "red",
			marginBottom: 10,
			textAlign: "center",
		},
		btnContainer: {
			alignItems: "center",
		},
		btn: {
			borderColor: "#EB5A62",
			borderWidth: 3,
			paddingVertical: 15,
			paddingHorizontal: 50,
			borderRadius: 100,
			width: width * 0.5,
			alignItems: "center",
			justifyContent: "center",
			marginBottom: 20,
		},
		btnText: {
			color: "#737373",
			fontSize: 18,
			fontWeight: "bold",
		},
		btnLogout: {
			backgroundColor: "#E7E7E7",
		},
	});
	// Retourne le style
	return styles;
};
