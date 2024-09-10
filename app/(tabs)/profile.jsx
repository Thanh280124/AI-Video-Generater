import { View, Text,Alert,FlatList,TouchableOpacity,Image} from 'react-native';
import {router} from 'expo-router';
import {  signOut } from '../../lib/appwrite'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import EmptyState from '../../components/EmptyState';
import useAppwrite from '../../lib/useAppwrite.js';
import VideoCard from '../../components/VideoCard.jsx';
import { getUserPosts } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider.js';
import InfoBox from '../../components/InfoBox.jsx';
import icons from '../../constants/icons.js';
import { deleteUserPost } from '../../lib/appwrite.js';
const Profile = () => {
  const { user, setUser, setisLoggedIn } = useGlobalContext();
  const { data: posts, reFetch } = useAppwrite(() => getUserPosts(user.$id));

  const handleDeleteForever = async (postId) => {
    try {
      await deleteUserPost(user.$id, postId);
     
      reFetch(); // Re-fetch the posts after deletion
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  

  const handleLogout = async () => {
    await signOut();
    setUser(null);
    setisLoggedIn(false);
    router.replace('/sign-in');
  };

  return (
    <SafeAreaView className='bg-primary h-full'>
      <FlatList 
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => ( 
          <VideoCard
            video={item}
            onDelete={() => handleDeleteForever(item.$id)} // Use handleDeleteForever
          />
        )}
        ListHeaderComponent={() => (
          <View className='w-full justify-center items-center mt-6 mb-12 px-4'>
            <TouchableOpacity className='w-full items-end mb-10' onPress={handleLogout}>
              <Image source={icons.logout} resizeMode='contain' className='w-6 h-6' />
            </TouchableOpacity>
            <View className='w-16 h-16 rounded-lg border border-secondary justify-center items-center'>
              <Image source={{ uri: user?.avata }} className='w-[90%] h-[90%] rounded-lg' resizeMode='cover'/>
            </View>
            <InfoBox title={user?.username} containerStyles='mt-5' titleStyles='text-lg' />
            <View className='mt-5 flex-row'>
              <InfoBox title={posts.length || 0} subTitle='Posts' containerStyles='mr-5' titleStyles='text-xl' />
              <InfoBox title='1.2k' subTitle='Likes' titleStyles='text-xl' />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState title='No Videos Found' subTitle='No video found for this search' />
        )}
        showsVerticalScrollIndicator={false}
      />
      <StatusBar style='light' />
    </SafeAreaView>
  );
};


export default Profile;
