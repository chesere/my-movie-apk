import { Client,Databases,ID,Query } from "appwrite";
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;


const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67be02d00025028f4070')

const database = new Databases(client);

export const updateSearchCount = async(searchTerm, movie)=>{
  try{
    const result = await database.listDocuments('67be03a400333c908cac','67be04b600328b41be61', [
        Query.equal('searchTerm', searchTerm)
    ])
    if(SpeechRecognitionResultList.document.length > 0){
        const doc = result.documents[0];

        await database.updateDocument('67be03a400333c908cac', '67be04b600328b41be61',doc.$id,  {
            count:doc.count +1,
        })
    } else {
        await database.createDocument('67be03a400333c908cac', '67be04b600328b41be61', ID.unique(),{
            searchTerm,
            count:1,
            movie_id:movie.id,
            poster_url:`https://image.tmdb.org/t/p/w500${movie.poster_path}`
        })
    }

  } catch(error){
    console.error(error);
  }

}