import { useState } from "react";
import {
	Text,
	View,
	TextInput,
	StyleSheet,
	Image,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useWindowDimensions } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";

const SignUpScreen = ({ setToken }) => {
	const navigation = useNavigation();
	// Utilisation de la fonction 'useStyle' qui utilise le hook "useWindowDimensions"
	const styles = useStyle();

	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [description, setDescription] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSignUp = async () => {
		// Vérifiez si les champs sont vides
		if (!email || !username || !description || !password || !confirmPassword) {
			setErrorMessage("Tous les champs sont obligatoires.");
			return;
		}
		// Vérifiez si le mot de passe et la confirmation du mot de passe sont identiques
		if (password !== confirmPassword) {
			setErrorMessage(
				"Le mot de passe et la confirmation du mot de passe ne correspondent pas."
			);
			setIsLoading(false);
			return;
		}
		setIsLoading(true);
		try {
			const response = await axios.post(
				"https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/sign_up",
				{
					email,
					username,
					description,
					password,
				}
			);

			if (response.status === 200) {
				// Connexion réussie, affiche une popup
				alert("Inscription réussie");
			}
			//  Envoie du 'token' à la fonction pour le créer dans l'asyncStorage et le state puis accéder au reste de l'application
			setToken(response.data.token);
		} catch (error) {
			console.log(error.response.data.error);
			if (error.response) {
				setErrorMessage(error.response.data.error);
			} else {
				setErrorMessage("Une erreur est survenue");
			}
		}
		setIsLoading(false);
	};

	return (
		<KeyboardAwareScrollView>
			<View style={styles.signContainer}>
				<View style={styles.signHeader}>
					<Image
						style={styles.logo}
						source={require("../assets/logo.png")}></Image>
					<Text style={styles.title}>Sign up</Text>
				</View>
				<View style={styles.signForm}>
					<TextInput
						style={styles.input}
						placeholder="email"
						value={email}
						onChangeText={(text) => {
							setErrorMessage("");
							setEmail(text);
						}}
					/>
					<TextInput
						style={styles.input}
						placeholder="Username"
						value={username}
						onChangeText={(text) => {
							setErrorMessage("");
							setUsername(text);
						}}
					/>
					<TextInput
						style={[styles.input, styles.description]}
						placeholder="Describe yourself in a few words..."
						value={description}
						multiline={true}
						textAlignVertical="top"
						onChangeText={(text) => {
							setErrorMessage("");
							setDescription(text);
						}}
					/>
					<View style={styles.passwordContainer}>
						<TextInput
							style={styles.input}
							placeholder="password"
							value={password}
							onChangeText={(text) => {
								setErrorMessage("");
								setPassword(text);
							}}
							secureTextEntry={!isPasswordVisible} // Le mot de passe est caché si isPasswordVisible est false
							textContentType="newPassword"
						/>
						<FontAwesome
							name={isPasswordVisible ? "eye-slash" : "eye"}
							size={20}
							color="#EB5A62"
							style={styles.icon}
							icon={isPasswordVisible ? "eye-slash" : "eye"}
							onPress={() => setIsPasswordVisible(!isPasswordVisible)}
						/>
					</View>
					<View style={styles.passwordContainer}>
						<TextInput
							style={styles.input}
							placeholder="confirm password"
							value={confirmPassword}
							onChangeText={(text) => {
								setErrorMessage("");
								setConfirmPassword(text);
							}}
							secureTextEntry={!isPasswordVisible} // Le mot de passe est caché si isPasswordVisible est false
						/>
						<FontAwesome
							name={isPasswordVisible ? "eye-slash" : "eye"}
							size={20}
							color="#EB5A62"
							style={styles.icon}
							icon={isPasswordVisible ? "eye-slash" : "eye"}
							onPress={() => setIsPasswordVisible(!isPasswordVisible)}
						/>
					</View>
					<View style={styles.errorContainer}>
						{errorMessage ? (
							<Text style={styles.error}>{errorMessage}</Text>
						) : null}
					</View>
					<View style={styles.signBtn}>
						{isLoading ? (
							<ActivityIndicator size="large" color="#EB5A62" />
						) : (
							<TouchableOpacity
								style={styles.btn}
								activeOpacity={0.8}
								onPress={handleSignUp}>
								<Text style={styles.btnText}>Sign up</Text>
							</TouchableOpacity>
						)}
						<TouchableOpacity onPress={() => navigation.navigate("Signin")}>
							<Text style={styles.register}>
								Already have an account ? Sign in
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</KeyboardAwareScrollView>
	);
};

export default SignUpScreen;

const useStyle = () => {
	// utilisation du hook "useWindowDimensions"
	const { height, width } = useWindowDimensions();

	// Créatioon du style

	const styles = StyleSheet.create({
		signContainer: {
			flex: 1,
			alignItems: "center",
			justifyContent: "center",
		},
		signHeader: {
			flex: 1,
			alignItems: "center",
			justifyContent: "center",
			marginTop: 50,
		},
		title: {
			fontSize: 22,
			fontWeight: "bold",
			color: "#7A7A7A",
			marginTop: 20,
		},
		signForm: {
			flex: 1,
			alignItems: "center",
			justifyContent: "center",
			marginTop: 50,
		},
		logo: {
			width: 100,
			height: 100,
		},
		input: {
			borderBottomWidth: 1,
			borderColor: "#EB5A62",
			padding: 8,
			margin: 20,
			width: width * 0.8,
		},
		description: {
			height: 100,
			borderWidth: 1,
		},

		icon: {
			position: "absolute",
			right: 10,
			bottom: 25,
		},
		signBtn: {
			marginTop: 10,
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
		},
		btnText: {
			color: "#737373",
			fontSize: 18,
		},
		register: {
			color: "#737373",
			textAlign: "center",
			marginTop: 20,
			marginBottom: 20,
		},
		errorContainer: {
			height: 50,
			textAlign: "center",
			width: width * 0.8,
			justifyContent: "center",
			alignItems: "center",
			flexWrap: "wrap",
		},
		error: {
			color: "red",
			marginBottom: 10,
			textAlign: "center",
		},
	});

	// Retourne le style
	return styles;
};
