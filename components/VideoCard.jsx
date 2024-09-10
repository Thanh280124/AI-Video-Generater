import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { icons } from '../constants';
import { Video, ResizeMode } from 'expo-av';
import { useGlobalContext } from '../context/GlobalProvider';
import { deleteLikedVideo } from '../lib/appwrite';

const VideoCard = ({ video: { title, thumbnail, video, creator: { username, avata }, $id }, onDelete }) => {
  const [play, setPlay] = useState(false);
  const { user } = useGlobalContext();

  const handleDelete = async () => {
    try {
      await deleteLikedVideo(user.$id, $id);
      if (onDelete) onDelete(); // Notify parent to re-fetch data
    } catch (error) {
      console.error('Error deleting video:', error);
    }
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

        <View className='pt-2'>
          <TouchableOpacity onPress={handleDelete} activeOpacity={0.7}>
            <Image source={icons.trashbin} className='w-8 h-8' resizeMode='contain' />
          </TouchableOpacity>
        </View>
      </View>

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

export default VideoCard;
