import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 85,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    flexRow: {
        flexDirection: 'row'
    },
    input: {
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 4,
        flex: 1,
        height: 48,
        margin: 16,
        padding: 8,
    },
    item: {
        borderWidth: 2,
        borderColor: 'black',
        borderStyle: 'solid',
        backgroundColor: 'white',
        padding: 4,
        margin: 4,
    },
    itemText: {
        fontSize: 18,

    },
    scrollArea: {
        backgroundColor: '#a0a0a0',
    },
    sectionHeading: {
        fontSize: 18,
        marginBottom: 8,

    },
});

export default styles;