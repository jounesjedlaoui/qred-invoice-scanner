import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import { font } from '../constants/font';
import { uiElements } from '../constants/uiElements';
import CustomButton from './Button';
import ReactNativeBiometrics from 'react-native-biometrics';
import { useNavigation } from '@react-navigation/native';

const MOCK_PAYMENT_OPTIONS = [
    {display: 'Pay now', icon: '', amount: '19 157', currency: 'SEK' },
    {display: 'Pay in 30 days', icon: '', amount: '19 444', currency: 'SEK' },
    {display: 'Split in 12 months', icon: '', amount: '1 700', currency: 'SEK' },

];

/**
 * @param emitConfirm {function} - emits page changes to parent
 * @param form {Array} - Array of form fields and their values
 * @returns React.Component
 */
export default function PaymentOptions({route}): React.JSX.Element {
    const navigation = useNavigation();

    const [paymentOptions, setPaymenOptions] = useState([]);
    const [showConfirmScreen, setShowConfirmScreen] = useState(false);
    const [selected, setSelected] = useState(undefined);

    const { form } = route.params;

    useEffect(() => {
        fetchPaymentOptions();
    }, []);

    // Mock fetch available payment options from backend
    const fetchPaymentOptions = () => {
        // Send form data to receive available Payment Options.
        setPaymenOptions(MOCK_PAYMENT_OPTIONS);
    }

    const resetToFirstScreen = () => {
        Alert.alert('Transaction was successful!');
        navigation.popToTop();
    }

    const handleConfirm = async () => {
        console.log('confirm');
        const rnBiometrics = new ReactNativeBiometrics({allowDeviceCredentials: true});

        if(Platform.OS === 'android') {
            setTimeout(() => {
                resetToFirstScreen();
            }, 3000);
        }

        rnBiometrics.simplePrompt({promptMessage: 'Confirm Identity'})
          .then((resultObject) => {
            const { success } = resultObject;
            if(success) {
                resetToFirstScreen();
            }
            else {
                Alert.prompt('Transaction failed.', 'Do you want to try again?', [
                    {
                        text: 'No',
                        onPress: () => navigation.popToTop(),
                    },
                    {
                        text: 'Yes',
                        onPress: () => setShowConfirmScreen(false),
                    }
                ]);
            }
          });
    };

    const handleNext = async() => {
        if(selected) {
            setShowConfirmScreen(true);
        } else {
            Alert.alert('Please select a payment option!');
        }
    };

    const back = () => {
        navigation.goBack();
    };

    function renderPaymentOptions() {
        return paymentOptions.map((p, i) => 
            <TouchableOpacity   
                onPress={() => setSelected(p)}
                key={i} 
                style={[ uiElements.isSecondary, styles.options, selected === p ? styles.active : {}]}>

                <Text style={[font.text]}>{p.display}</Text>
                <Text style={font.text}>{p.amount} {p.currency}</Text>

            </TouchableOpacity>
        )
    }

    return (
        <View>
            <View style={styles.selectScreen}>
                <View>
                    <Text style={font.title}>How would you like to pay?</Text>
                    {renderPaymentOptions()}
                </View>

                    <View style={styles.navButtons}>
                    
                        <CustomButton
                            text="Back"
                            handler={back}
                            buttonStyle={uiElements.isSecondary}
                            textStyle={font.textDark}/>
                        <CustomButton 
                            text={'Next'}
                            handler={handleNext}
                            buttonStyle={[uiElements.isPrimary, styles.confirmButton]}
                            textStyle={uiElements.isPrimary}/>

                    </View>
            </View>
            
            {showConfirmScreen && 
                <View style={styles.confirmScreen}>
                    <Text style={[font.subtitle, uiElements.centerText]}>Please verify via BankID</Text>
                    <Image style={styles.bankIDIcon} source={require('../assets/icon_bankID.png')}/>

                    <CustomButton 
                        text={'Confirm'}
                        handler={handleConfirm}
                        buttonStyle={uiElements.isPrimary}
                        textStyle={uiElements.isPrimary}/>
                </View>}
        </View>
    )
}

const dimension = Dimensions.get('window');


const styles = StyleSheet.create({
    options: {
        // borderBottomColor: 'white',
        // borderBottomWidth: 1,
        padding: 10,
        margin: 5,
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: dimension.height * .1
    },
    selectScreen: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        height: dimension.height * .9,
        padding: 20,

    },
    active: {
        backgroundColor: uiElements.secondaryColor,
        borderColor: uiElements.primaryColor,
        borderWidth: 3,
        borderStyle: 'solid'
    },
    confirmScreen: {
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'space-around',
        height: dimension.height * .9 ,
        width: dimension.width ,
        left: 0,
        position: 'absolute',
        backgroundColor: 'white',
    },
    bankIDIcon: {
        display: 'flex',
        alignItems: 'center',
        alignSelf: 'center',
        height: dimension.height * .2,
        width   : dimension.height * .2,
    },
    navButtons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    confirmButton: {
        width: dimension.width * .64
    }
})