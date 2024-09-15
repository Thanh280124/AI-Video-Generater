import { View, Text, ScrollView, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link, router } from 'expo-router';
import { getCurrentUser, signIn } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';
const SignIn = () => {
  const {setUser, setisLoggedIn} = useGlobalContext();
  const [form,setForm] = useState({
    email:'',
    password:''
  })

  const [isSubmitting,setSubmitting] = useState(false);


  
  const submit = async () => {

    if (!form.email || !form.password) {
      Alert.alert('Error', "Please fill in all the fields");
      return; // Ensure function exits if condition is met
  }

    setSubmitting(true);
    try {
         await signIn(form.email, form.password);
        const result = await getCurrentUser();
        setUser(result);
        setisLoggedIn(true);
        router.replace('/home');
    } catch (error) {
        Alert.alert('Error', error.message);
    } finally {
        setSubmitting(false);
    }
};

  return (
    <SafeAreaView className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}keyboardShouldPersistTaps='handled'>
        <View className="flex-1 justify-center px-4">
          <Image source={images.profile} resizeMode="contain" style={{ width: 115, height: 100 }} />
          <Text className="text-2xl text-white font-semibold mt-10">Log in to NKL</Text>
          <FormField 
          title ='Email'
          value ={form.email}
          handleChangeText = {(e) => setForm({...form,email:e})}
          otherStyles ='mt-7'
          keyboardType ='email-address'
          />

<FormField 
          title ='Password'
          value ={form.password}
          handleChangeText = {(e) => setForm({...form,password:e})}
          otherStyles ='mt-7'
          />

          <CustomButton title='Sign in' handlePress={submit} containerStyle = 'mt-10' isLoading={isSubmitting}/>

          <View className ='justify-center pt-5 flex-row gap-2'>
            <Text className='text-lg text-gray-100 font-pregular'>Don't have account?</Text>
           <Link href='/sign-up' className='text-lg text-secondary font-psemibold'>Sign Up</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
