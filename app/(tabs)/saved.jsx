import { View, Text, FlatList, RefreshControl } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import VideoCard from '../../components/VideoCard';
import { getLikedVideos } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';
import { useFocusEffect } from '@react-navigation/native';

const Saved = () => {
  const { user } = useGlobalContext();
  const [likedVideos, setLikedVideos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLikedVideos = async () => {
    try {
      const videos = await getLikedVideos(user.$id);
      setLikedVideos(videos);
    } catch (error) {
      console.error("Error fetching liked videos:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchLikedVideos();
    }, [user.$id])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLikedVideos();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className='bg-primary h-full'>
      <FlatList 
        data={likedVideos}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard video={item} onDelete={fetchLikedVideos} /> // Ensure fetchLikedVideos is used
        )}
        ListHeaderComponent={() => (
          <View className='my-6 px-4'>
            <Text className='font-pmedium text-3xl text-gray-100 mb-10'>Saved Videos You Like</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <Text className='text-white text-center'>No Liked Videos Found</Text>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      />
      <StatusBar style='light' />
    </SafeAreaView>
  );
};


export default Saved;
