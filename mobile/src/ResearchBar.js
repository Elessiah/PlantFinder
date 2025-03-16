import React, {useEffect, useState} from 'react';
import {View, TextInput, Text, StyleSheet} from 'react-native';
import getKeywords from "./getKeywords";
import updateData from "./UpdateData";

function ResearchBar({ setData, db }) {
    const [text, setText] = useState('');
    const [research, setResearch] = useState('');

    useEffect(() => {
        if (research.length > 0) {
            setData([]);
            const keywords = getKeywords(research);
            updateData(db, keywords, setData);
        }
    }, [research, db, setResearch]);

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Rechercher"
                value={text}
                onChangeText={setText}
                onSubmitEditing={() => setResearch(text)}
                returnKeyType="done"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
        marginHorizontal: "auto",
        width: '100%',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
    },
    input: {
        backgroundColor: 'white',
        height: 40,
        width: '100%',
        borderColor: "gray",
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    output: {
        marginTop: 10,
        fontSize: 16,
    },
});

export default ResearchBar;