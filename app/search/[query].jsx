import { View, Text,Alert,FlatList} from 'react-native';
import React, { useEffect } from 'react';
import {router, useLocalSearchParams } from 'expo-router';
import { signOut } from '../../lib/appwrite'; // Adjust the path as needed
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import SearchInput from '../../components/SearchInput';
import EmptyState from '../../components/EmptyState';
import useAppwrite from '../../lib/useAppwrite.js';
import VideoCard from '../../components/VideoCard.jsx';
import { searchPosts } from '../../lib/appwrite';
const Search = () => {
  const {query} = useLocalSearchParams();
const {data:posts ,reFetch} = useAppwrite(() => searchPosts(query))

useEffect(() =>{
  reFetch()
},[query])



  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/sign-in'); 
    } catch (error) {
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  return (
    <SafeAreaView className= 'bg-primary h-full'>
        <FlatList 
          data={posts}
          keyExtractor={(item) => item.$id}
          renderItem={({item}) => ( 
           <VideoCard video ={item}/>
          )}
          ListHeaderComponent={() => (
              <View className = 'my-6 px-4'>
                        <Text className='font-pmedium text-sm text-gray-100'>
                          Search Result
                        </Text>
                        <Text className='text-2xl font-psemibold text-white mt-2'>
                          {query}
                        </Text>
                        <View className ='mt-6 mb-8'>
                        <SearchInput initialQuery = {query}/>
                        </View>  
              </View>
          )}
          ListEmptyComponent={() => (
            <EmptyState title = 'No Videos Found'
            subTitle ='No video found for this search'/>
          )}
          
          showsVerticalScrollIndicator={false}
        />
        <StatusBar style='light'/>
    </SafeAreaView>
  );
};

export default Search;

{/* 
    <View className ='mt-96' >
      <Button title="Logout" onPress={handleLogout} />
    </View> */}