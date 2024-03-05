import { useState, useEffect } from 'react';
import { Pressable, Text } from 'react-native';
import styles from '../styles/master-stylesheet';

export default Item = ({ itemId, itemText }) => {

	return (
		<Pressable
			style={styles.item}
			onPress={() => { }}
			key={itemId}
		>
			<Text style={[styles.itemText] }>{itemText }</Text>
		</Pressable>
		)
}