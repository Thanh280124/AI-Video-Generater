import { View, Text, Alert,FlatList,Image, RefreshControl } from 'react-native';
import React, { useState } from 'react';
import {router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { images } from '../../constants';
import SearchInput from '../../components/SearchInput';
import Trending from '../../components/Trending';
import EmptyState from '../../components/EmptyState';
import { getAllPosts } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite.js';
import VideoCard2 from '../../components/VideoCard2.jsx';
import { getLatestPosts } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider.js';
const Home = () => {
  const {user,setUser, setisLoggedIn} = useGlobalContext();
const {data:posts ,reFetch} = useAppwrite(getAllPosts)

const {data:latestPosts} = useAppwrite(getLatestPosts)

 const [refresh,setRefreshing] = useState(false);
 const onRefreshing = async () =>{
  setRefreshing(true);
  await reFetch();
  setRefreshing(false)
 }

  return (
    <SafeAreaView className= 'bg-primary h-full'>
        <FlatList 
          data={posts}
          keyExtractor={(item) => item.$id}
          renderItem={({item}) => ( 
           <VideoCard2 video ={item}/>
          )}
          ListHeaderComponent={() => (
              <View className = 'my-6 px-4 space-y-6'>
                  <View className ='justify-between items-start flex-row mb-6'>
                      <View>
                        <Text className='font-pmedium text-sm text-gray-100'>
                          Welcome Back,
                        </Text>
                        <Text className='text-2xl font-psemibold text-white mt-2'>
                         {user?.username}
                        </Text>
                      </View>

                      <View className = 'mt-1.5'> 
                        <Image source={images.profile}
                        className ='w-9 h-11'
                        resizeMode='contain'
                        />
                      </View>
                  </View>

                  <SearchInput/>

                  <View className ='w-full flex-1 pt-5 pb-8'>
                      <Text className='text-green-100 text-lg font-pregular mb-3'>Latest Videos</Text>

                      <Trending posts ={latestPosts ?? []}/>
                  </View>
              </View>
          )}
          ListEmptyComponent={() => (
            <EmptyState title = 'No Videos Found'
            subTitle ='No video created yet'/>
          )}

          refreshControl={<RefreshControl refreshing ={refresh} onRefresh={onRefreshing}/>}

          showsVerticalScrollIndicator={false}
        />
        <StatusBar style='light'/>
    </SafeAreaView>
  );
};

export default Home;

