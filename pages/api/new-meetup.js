// URL - /api/new-meetup
// POST /api/new-meetup

import { MongoClient } from "mongodb";

const DATABSE = {
  USERNAME: "admin",
  PASSWORD: "admin",
  DB: "meetups",
};

async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;

    // const { title, image, address, description } = data;

    try {
      // store in database
      const client = await MongoClient.connect(
        `mongodb+srv://${DATABSE.USERNAME}:${DATABSE.PASSWORD}@cluster0.ojvah.mongodb.net/${DATABSE.DB}?retryWrites=true&w=majority`
      );

      const db = client.db();

      // collection = tables
      // documents = entries in the tables (rows)
      const meetupsCollection = db.collection("meetups");

      // insert 1 new entry (document)
      const result = await meetupsCollection.insertOne(data);

      console.log(result);

      client.close();

      // created successfully
      res.status(201).json({
        message: "Meetup Created!",
      });
    } catch (error) {
      console.log(error);
    }
  }
}

export default handler;
