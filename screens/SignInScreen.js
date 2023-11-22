import {
	Text,
	View,
	Image,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	useWindowDimensions,
	ActivityIndicator,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useState } from "react";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons";

const SignInScreen = ({ navigation }) => {
	// Utilisation de la fonction 'useStyle' qui utilise le hook "useWindowDimensions"
	const styles = useStyle();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSumit = async () => {
		setIsLoading(true);
		try {
			const response = await axios.post(
				"https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/log_in",
				{
					email: email,
					password: password,
				}
			);

			if (response.status === 200) {
				// Connexion réussie, affiche une popup
				alert("Connexion réussie");
			}
		} catch (error) {
			console.log(error.response.data.error);
			setErrorMessage(error.response.data.error);
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
					<Text style={styles.title}>Sign In</Text>
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
					<View style={styles.passwordContainer}>
						<TextInput
							style={styles.input}
							placeholder="password"
							secureTextEntry={true}
							value={password}
							onChangeText={(text) => {
								setPassword(text);
							}}
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
				</View>
				<View style={styles.signBtn}>
					{errorMessage ? (
						<Text style={styles.error}>{errorMessage}</Text>
					) : null}
					{isLoading ? (
						<ActivityIndicator size="large" color="#EB5A62" />
					) : (
						<TouchableOpacity
							style={styles.btn}
							activeOpacity={0.8}
							onPress={handleSumit}>
							<Text style={styles.btnText}>Sign In</Text>
						</TouchableOpacity>
					)}
					<TouchableOpacity onPress={() => navigation.navigate("Signup")}>
						<Text style={styles.register}>No account ? Register</Text>
					</TouchableOpacity>
				</View>
			</View>
		</KeyboardAwareScrollView>
	);
};

export default SignInScreen;

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
		},
		logo: {
			width: 100,
			height: 100,
		},
		input: {
			borderBottomWidth: 1,
			borderColor: "#EB5A62",
			padding: 8,
			margin: 10,
			width: width * 0.8,
		},
		icon: {
			position: "absolute",
			right: 10,
			bottom: 25,
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
		error: {
			color: "red",
			marginBottom: 10,
			textAlign: "center",
		},
	});

	// Retourne le style
	return styles;
};
