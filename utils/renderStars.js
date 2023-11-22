import { Ionicons } from "@expo/vector-icons";

const renderStars = (ratingValue) => {
	let stars = [];
	for (let i = 1; i <= 5; i++) {
		stars.push(
			<Ionicons
				name="star"
				size={18}
				color={i <= ratingValue ? "#FBB101" : "#BBBBBB"}
				key={i}
				style={{ marginRight: 5 }}
			/>
		);
	}
	return stars;
};

export default renderStars;
