import {View,Text, ScrollView,Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link,Redirect,router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import images from '../constants/images';
import CustomButton from '../components/CustomButton';
import { useGlobalContext } from '../context/GlobalProvider';
export default function App() {
  const {isLoading,isLoggedIn} = useGlobalContext();
  
  if(!isLoading && isLoggedIn) return <Redirect href='/home'/>
  return (
   <SafeAreaView className = 'bg-primary h-full'>
      <ScrollView contentContainerStyle={{height:"100%",flexGrow: 1}}>
        <View className='flex-1 w-full justify-center items-center px-4'>
          <Image source={images.profile} resizeMode='contain' className= 'w-[140px] h-[84px]'/>

          <Image source={images.cards} resizeMode='contain' className= 'max-w-[380px] w-full h-[300px]'/>
        
        
        <View className='relative mt-5'>
          <Text className='text-2xl text-white font-bold text-center'>Accompany us to create more meaningful videos {' '}<Text className='text-secondary-200'>NKL</Text>
          </Text>
          <Image source={images.path} className='w-[136px] h-[15px] absolute -bottom-2 -right-3' resizeMode='contain'/>

        </View>
            <Text className='text-gray-100 text-sm font-pregular mt-7 text-center'>Your creativity can help many people have more positivity or let us spread that with NKL</Text>
        <CustomButton title = 'Countinue with Email'
        handlePress={()=> router.push('/sign-in')} containerStyle='w-full mt-7'/>
        </View>
      </ScrollView>
      <StatusBar backgroundColor='#161622' style='light'/>
   </SafeAreaView>
  );
}

// com.student.moona
