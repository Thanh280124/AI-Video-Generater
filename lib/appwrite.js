// appwrite.js

import { Client, Account, ID, Avatars, Databases, Query, Storage } from 'react-native-appwrite';

export const appwriteConfig = {
  endpoint: 'https://cloud.appwrite.io/v1',
  platform: 'com.student.moona',
  projectId: '66d0d06600081b867468',
  databaseId: '66d0d221002501c7e0c5',
  userCollectionId: '66d0d243001a6a944d71',
  videoCollectionId: '66d0d26a0011b9e1d7cf',
  storageId: '66d1683c000d34621984',
  liked_videos: '66dd4f8600019b6993b6'
};

const client = new Client();
client.setEndpoint(appwriteConfig.endpoint).setProject(appwriteConfig.projectId);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, username);
    if (!newAccount) throw new Error('User account creation failed');

    const avataUrl = avatars.getInitials(username);
    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avata: avataUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.log('Error creating user:', error.message);
    throw new Error(error.message || 'Failed to create user');
  }
};

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    console.log('Error signing in:', error.message);
    throw new Error(error.message || 'Failed to sign in');
  }
};

export const getCurrentUser = async () =>{
  try {
    const currentAccount = await account.get();
    if(!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId',currentAccount.$id)]
    )

    if(!currentUser) throw Error;
return currentUser.documents[0];  
  } catch (error) {
    console.log(error)
  }
}

export async function getAllPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc("$createdAt")]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getLatestPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function searchPosts(query) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.search("title", query)]
    );

    if (!posts) throw new Error("Something went wrong");

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getUserPosts(userId) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getFilePreview(fileId, type) {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

export async function uploadFile(file, type) {
  if (!file) return;
  const asset = { 
     name: file.fileName,
    type: file.mimeType,
    size: file.fileSize, 
    uri: file.uri,
  };

  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}


export async function createVideoPost(form) {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    throw new Error(error);
  }
}



export const saveLikedVideo = async (userId, videoId) => {
  try {
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.liked_videos,
      ID.unique(),  
      {
        userId: userId,
        videoId: videoId,
      }
    );
  } catch (error) {
    console.error('Error saving liked video:', error);
    throw new Error(error.message || 'Failed to save liked video');
  }
};

export const getLikedVideos = async (userId) => {
  try {
    // Fetch liked video IDs for the user
    const likedVideoDocs = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.liked_videos,
      [Query.equal('userId', userId)]
    );

    const likedVideoIds = likedVideoDocs.documents.map(doc => doc.videoId);

    if (likedVideoIds.length === 0) {
      return []; // No liked videos
    }

    // Fetch all liked videos individually
    const likedVideos = await Promise.all(
      likedVideoIds.map(videoId =>
        databases.getDocument(appwriteConfig.databaseId, appwriteConfig.videoCollectionId, videoId)
      )
    );

    return likedVideos;
  } catch (error) {
    console.error('Error fetching liked videos:', error);
    throw new Error(error.message || 'Failed to fetch liked videos');
  }
};


export async function deleteLikedVideo(userId, videoId) {
  try {
    // Query to find the liked video document
    const likedVideo = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.liked_videos,
      [Query.equal('userId', userId), Query.equal('videoId', videoId)]
    );

    // Check if the document exists
    if (likedVideo.total > 0) {
      const documentId = likedVideo.documents[0].$id; // Only access $id if the document exists
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.liked_videos,
        documentId
      );
    } else {
      console.error('No liked video found to delete'); // Handle case where no document was found
    }
  } catch (error) {
    console.error('Error deleting liked video:', error);
    throw new Error(error.message || 'Failed to delete liked video');
  }
}


export async function deleteUserPost(userId, postId) {
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      postId
    );

    console.log('Post deleted successfully');
  } catch (error) {
    console.error('Error deleting post:', error.message);
    throw new Error(error.message || 'Failed to delete post');
  }
}
