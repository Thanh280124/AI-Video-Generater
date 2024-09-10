import { View, Text, Image, TouchableOpacity, Animated } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { icons } from '../constants';
import { Video, ResizeMode } from 'expo-av';
import { useGlobalContext } from '../context/GlobalProvider';
import { saveLikedVideo, deleteLikedVideo, getLikedVideos } from '../lib/appwrite'; // Import functions

const VideoCard2 = ({ video: { title, thumbnail, video, creator: { username, avata }, $id } }) => {
  const [play, setPlay] = useState(false);
  const [liked, setLiked] = useState(false); // State to toggle like/dislike
  const scaleValue = useRef(new Animated.Value(1)).current; // Animation scale value
  const { user, setUser } = useGlobalContext(); // Get the current user

  useEffect(() => {
    // Fetch initial liked state
    const fetchLikedState = async () => {
      try {
        const likedVideos = await getLikedVideos(user.$id);
        const isLiked = likedVideos.some(likedVideo => likedVideo.videoId === $id);
        setLiked(isLiked);
      } catch (error) {
        console.error("Error fetching liked state:", error);
      }
    };

    fetchLikedState();
  }, [user, $id]); // Re-run the effect if user or $id changes

  const toggleLike = async () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.5,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    const newLikedState = !liked;
    setLiked(newLikedState); // Toggle liked state
    if (newLikedState) {
      await saveLikedVideo(user.$id, $id);
    } else {
      await deleteLikedVideo(user.$id, $id);
    }
    const updatedLikedVideos = await getLikedVideos(user.$id);
    setUser(prevState => ({ ...prevState, likedVideos: updatedLikedVideos }));
  };

  return (
    <View className='flex-col items-center px-4 mb-14'>
      <View className='flex-row gap-3 items-start'>
        <View className='justify-center items-center flex-row flex-1'>
          <View className='w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5'>
            <Image source={{ uri: avata }} className='w-full h-full rounded-lg' />
          </View>
          <View className='justify-center flex-1 ml-3 gap-y-1'>
            <Text className='text-white font-psemibold text-sm' numberOfLines={1}>
              {title}
            </Text>
            <Text className='text-xs text-gray-100 font-pregular' numberOfLines={1}>
              {username}
            </Text>
          </View>
        </View>

        {/* Heart Icon with Like/Dislike Toggle */}
        <View className='pt-1'>
          <TouchableOpacity onPress={toggleLike} activeOpacity={0.7}>
            <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
              <Image
                source={icons.heart}
                className='w-9 h-9'
                resizeMode='contain'
                style={{ tintColor: liked ? 'red' : 'white' }} // Change color based on liked state
              />
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Video or Thumbnail */}
      {play ? (
        <Video
          source={{ uri: video }}
          className='w-full h-60 rounded-xl mt-3'
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className='w-full h-60 rounded-xl mt-3 relative justify-center items-center'>
          <Image
            source={{ uri: thumbnail }}
            className='w-full h-full rounded-xl mt-3'
            resizeMode='cover'
          />
          <Image
            source={icons.play}
            className='w-12 h-12 absolute'
            resizeMode='contain'
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard2;
