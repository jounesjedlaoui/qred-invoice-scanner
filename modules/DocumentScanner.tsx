import React, { useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import TextRecognition from 'react-native-text-recognition';
import { font } from '../constants/font';
import { uiElements } from '../constants/uiElements';
import CustomButton from './Button';
import { useNavigation } from '@react-navigation/native';

const mockAPIResponse = [
        {display: 'Sender', value: 'Max Mustermann', type: 'text'},
        {display: 'Account number', value: '324982019', type: 'text'},
        {display: 'Receiver', value: 'Example Person', type: 'text'},
        {display: 'Account', value: '2459823327', type: 'text'},
        {display: 'Receiving Bank', value: 'SEB', type: 'text'},
        {display: 'Amount', value: '19 157', type: 'number', currency: 'SEK'},
        {display: 'Date', value: new Date().toISOString(), type: 'date'}
];

export default function DocumentScanner():React.JSX.Element {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const startScan = async(isLibrary: Boolean) => {
        console.log('starting scan', isLibrary ? 'lib' : 'cam');

        try {
            let res;

            if(isLibrary) {
                res = await launchImageLibrary({mediaType: 'photo'});
            } else {
                res = await launchCamera({mediaType: 'photo'});
            }

            if(res.assets) {
                parseDocument(res.assets[0].uri!)
                    .then(async(d) => {
                        const f = await fetchForm(d!);
                        if(f) {
                            navigation.navigate('Verify', {form : f});
                        }
                        else {
                            setLoading(false);
                        }
                    });
            } else {
                handleError(res);
            }
        } catch(e) {
            console.error(e);
        }
    };

    /**
     * Extraxt raw text from image
     * @param uri - uri of scanned document
     * @returns string[] of text fields
     */
    const parseDocument = async(uri: string) => {
        try {
            setLoading(true);
            console.log('Parsing raw text from document: ', uri);

            return await TextRecognition.recognize(uri);
        } catch(e) {
            console.log(e);
        }
    };

    /**
     * Sends a mock request to mimic a json parser service.
     * @param text {string[]} - extracted text fields from document
     * @returns 
     */
    const fetchForm = async(text: string[]) => {
        if(text.length === 0) {
            Alert.alert('Could not find any text in Document. Try again!')
            setLoading(false);
            return false;
        } else {
            try {
                console.log(`Mock analyzing ${text}`);

                const response = await fetch('https://c20zuamcv7.execute-api.eu-north-1.amazonaws.com/default/CaseStudy_Dummy_Endpoint')
                const resJSON = await response.json();

                // Validate JSON!

                console.log(resJSON);

                setLoading(false);

                return mockAPIResponse;
            } catch(e) {
                console.error(e);
            }
        }
    }


    /**
     * Handle error in image selection and inform user.
     * @param res ImagePickerResponse that caused an error
     */
    const handleError = (res: ImagePickerResponse) => {
        setLoading(false);

        if(res.didCancel) {
            Alert.alert('No Document was selected')
        } else if(res.errorCode) {
            Alert.alert(`${res.errorCode} - ${res.errorMessage}`)
        }
    }



    return (
        <View style={styles.documentScanner}>
            <View>
                <Text style={font.title}>Welcome!</Text>
                <Text style={font.subtitle}>Let's start by selecting an Invoice!</Text>
            </View>

            { loading && 
                <ActivityIndicator size={'large'} color={uiElements.primaryColor} />
            }

            { !loading &&
                <Image style={styles.iconScanner} source={require('../assets/icon_scanner.png')}/>
            }


            <View>

                <CustomButton   
                    text="Select from Library"
                    handler={startScan}
                    args={true}
                    buttonStyle={uiElements.isPrimary}
                    textStyle={uiElements.isPrimary}/>

                <CustomButton   
                    text="Select from Camera"
                    handler={startScan}
                    args={false}
                    buttonStyle={uiElements.isSecondary}
                    textStyle={{color: uiElements.primaryColor}}/>

            </View>
        </View>
    )
}

export const styles = StyleSheet.create({
    button: {
        padding: 15,
        margin: 10,
        borderRadius: 10
    },
    documentScanner: {
        display: 'flex',
        height: Dimensions.get('window').height * .9 ,
        padding: 20,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: uiElements.secondaryColor,
    },
    iconScanner: {
        display: 'flex',
        alignItems: 'center',
        alignSelf: 'center',
        height: Dimensions.get('window').height * .2,
        width   : Dimensions.get('window').height * .2,

    }
})