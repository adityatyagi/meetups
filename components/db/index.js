import { MongoClient } from "mongodb";
import CONSTANTS from "../../constants";
let client;
const getMeetupsCollection = async () => {
  try {
    // store in database
    client = await MongoClient.connect(
      `mongodb+srv://${CONSTANTS.DATABSE.USERNAME}:${CONSTANTS.DATABSE.PASSWORD}@cluster0.ojvah.mongodb.net/${CONSTANTS.DATABSE.DB}?retryWrites=true&w=majority`
    );

    const db = client.db();

    // collection = tables
    // documents = entries in the tables (rows)
    const meetupsCollection = await db.collection("meetups");
    return meetupsCollection;
  } catch (error) {
    console.log(error);
  }
};

export const closeClient = () => {
  client.close();
};

export default getMeetupsCollection;
