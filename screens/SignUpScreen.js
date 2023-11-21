import React, { useState } from "react";
import {
	Text,
	View,
	TextInput,
	Button,
	StyleSheet,
	Image,
	TouchableOpacity,
} from "react-native";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useWindowDimensions } from "react-native";

const SignUpScreen = ({ navigation }) => {
	// Utilisation de la fonction 'useStyle' qui utilise le hook "useWindowDimensions"
	const styles = useStyle();

	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [description, setDescription] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const handleSignUp = async () => {
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
				// Inscription réussie, naviguez vers l'écran souhaité
				navigation.navigate("Votre écran souhaité");
			} else {
				// Échec de l'inscription, affichez une erreur
				setErrorMessage("Une erreur s'est produite lors de l'inscription.");
			}
		} catch (error) {
			if (error.response) {
				setErrorMessage(error.response.data.message);
			} else {
				setErrorMessage("Une erreur s'est produite. Veuillez réessayer.");
			}
		}
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
							setEmail(text);
						}}
					/>
					<TextInput
						style={styles.input}
						placeholder="Username"
						value={username}
						onChangeText={setUsername}
					/>
					<TextInput
						style={[styles.input, styles.description]}
						placeholder="Describe yourself in a few words..."
						value={description}
						multiline={true}
						textAlignVertical="top"
						onChangeText={setDescription}
					/>
					<TextInput
						style={styles.input}
						placeholder="password"
						value={password}
						onChangeText={setPassword}
						secureTextEntry
					/>
					<TextInput
						style={styles.input}
						placeholder="confirm password"
						value={confirmPassword}
						onChangeText={setConfirmPassword}
						secureTextEntry
					/>
					<View style={styles.signBtn}>
						{errorMessage ? <Text>{errorMessage}</Text> : null}
						<TouchableOpacity
							style={styles.btn}
							activeOpacity={0.8}
							onPress={handleSignUp}>
							<Text style={styles.btnText}>Sign up</Text>
						</TouchableOpacity>
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
			height: height * 0.8,
		},
		signHeader: {
			flex: 1,
			alignItems: "center",
			justifyContent: "center",
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
			marginTop: 200,
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
		signBtn: {
			marginTop: 50,
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
		},
	});

	// Retourne le style
	return styles;
};
