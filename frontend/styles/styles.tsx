import {StyleSheet} from "react-native";
export const styles = StyleSheet.create({
    container: {
        color: "#000000",
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 24,
        paddingTop: 60,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#222222',
        marginBottom: 24,
    },
    header: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        color: '#333333',
        marginBottom: 12,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#DDDDDD',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#000000',
        backgroundColor: '#FAFAFA',
        marginVertical: 10,
    },
    error: {
        marginVertical: 10,
        textAlign: 'center',
        color: '#D8000C',
        fontSize: 14,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
    button: {
        flex: 1,
        backgroundColor: '#3366FF',
        paddingVertical: 12,
        marginHorizontal: 6,
        borderRadius: 6,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
    link: {
        marginTop: 16,
        fontSize: 14,
        textAlign: 'center',
        color: '#1e90ff',
    },
    changeText: {marginTop: 8, color: '#007bff'},
    username: {fontSize: 24, fontWeight: '600', marginBottom: 8},
    description: {fontSize: 16, textAlign: 'center'},
    profileInput: {
        alignSelf: 'stretch',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 10,
        marginBottom: 12,
        fontSize: 16,
    },
    // profileInput: {
    //     flex: 1,
    //     borderBottomWidth: 1,
    //     borderBottomColor: '#aaa',
    //     fontSize: 16,
    //     paddingVertical: 2,
    //     color: '#222',
    // },
    multiline: {height: 100, textAlignVertical: 'top'},
    buttonRow: {flexDirection: 'row', gap: 12, marginTop: 24},
    bgImage: {
        ...StyleSheet.absoluteFillObject,
        height: 180,
    },

    profileImageWrapper: {
        position: 'absolute',
        top: 130,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },
    infoContainer: {
        flex: 1,
        marginTop: 60,
        paddingHorizontal: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        flex: 1,
        fontWeight: '600',
        fontSize: 16,
        color: '#555',
    },

    value: {
        flex: 2,
        fontSize: 16,
        color: '#222',
    },

    unmetReqs: {
        color: 'red',
        textAlign: 'left',
        fontSize: 12
    },
    // should add this for every other style sheet
    // cellSelection

    root: {
        flex: 1,
    },
    listContent: {
        paddingBottom: 16,
    },
    item: {
        margin: 4,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cellLabel: {
        color: '#ffffff',
        fontWeight: '600',
    },
    symbol: {
        position: 'absolute',
        top: 4,
        right: 4,
        fontSize: 18,
    },
    modalContent: {
        padding: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    modalSymbol: {
        fontSize: 24,
        marginBottom: 8,
    },
    modalText: {
        marginBottom: 4,
        textTransform: 'capitalize',
    },
    box: {
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },

    //map


    sheetContent:  {minHeight: 100, padding: 16, backgroundColor: '#CCAA77' },
    openButton: {
        marginTop: 50,
        alignSelf: 'center',
        padding: 10,
        backgroundColor: '#1E90FF',
        borderRadius: 8,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.3)', // semi-transparent overlay
    },
    modalContentMap: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    closeButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#FF6347',
        borderRadius: 8,
    },

});

