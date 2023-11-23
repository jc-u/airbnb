import { Image, StyleSheet } from "react-native";

const HeaderLogo = () => {
	return <Image source={require("../assets/logo.png")} style={styles.logo} />;
};

export default HeaderLogo;

const styles = StyleSheet.create({
	logo: {
		width: 30,
		height: 30,
		resizeMode: "contain",
	},
});
