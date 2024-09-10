import { useState,useEffect } from "react";
import { Alert } from "react-native";
const useAppwrite = (fn) =>{
  const [data,setData] = useState([]);
  const [isLoading,setIsLoading] = useState(true);
  const fetchData = async () => {
    setIsLoading(true);

    try {
     const respone = await fn();
      setData(respone)
    } catch (error) {
      Alert.alert('Error',error.message)
    }finally{
      setIsLoading(false)
    }
   }


 useEffect(() =>{
 fetchData()
 },[])

 const reFetch = () => fetchData();
    return {data, isLoading , reFetch}

}
export default useAppwrite