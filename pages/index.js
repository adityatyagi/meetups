import React, { Fragment, useState, useEffect } from "react";
import Head from "next/head";
import { MongoClient } from "mongodb";
import constants from "../constants";
import MeetupList from "../components/meetups/MeetupList";
const DUMMY_MEETUPS = [
  {
    id: "629cd2c36c7754b4768f1bae",
    title: "Kidstock",
    image:
      "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
    address: "10 Dewitt Avenue, Tivoli, Vermont",
    description:
      "Pariatur in eu velit labore Lorem officia ex nulla mollit ex laborum elit.",
  },
  {
    id: "629cd2c3ba18d1b207a32897",
    title: "Farmage",
    image:
      "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8&w=1000&q=80",
    address: "10 Ryerson Street, Cobbtown, Georgia",
    description: "Mollit occaecat officia adipisicing reprehenderit et.",
  },
  {
    id: "629cd2c326d90e87a2237775",
    title: "Everest",
    image:
      "https://media.istockphoto.com/photos/hot-air-balloons-flying-over-the-botan-canyon-in-turkey-picture-id1297349747?b=1&k=20&m=1297349747&s=170667a&w=0&h=oH31fJty_4xWl_JQ4OIQWZKP8C6ji9Mz7L4XmEnbqRU=",
    address: "10 Garfield Place, Faywood, Louisiana",
    description: "Eu Lorem cupidatat ea est.",
  },
  {
    id: "629cd2c3c7ed98e61c58dadd",
    title: "Interloo",
    image:
      "https://www.bhaktiphotos.com/wp-content/uploads/2018/04/Mahadev-Bhagwan-Photo-for-Devotee.jpg",
    address: "10 Williams Court, Escondida, Kansas",
    description: "Magna cillum do sunt do.",
  },
  {
    id: "629cd2c34671206a9c6f7ac1",
    title: "Lovepad",
    image:
      "https://freerangestock.com/thumbnail/137610/lonely-man-under-night-sky--starry-sky-over-the-horizon--conte.jpg",
    address: "10 Centre Street, Trinway, New Mexico",
    description: "Irure est aliquip officia ad duis tempor ad sit voluptate.",
  },
  {
    id: "629cd2c3a58c3a9a70498522",
    title: "Unia",
    image:
      "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8bWFufGVufDB8fDB8fA%3D%3D&w=1000&q=80",
    address: "10 Glen Street, Freeburn, Federated States Of Micronesia",
    description: "Do est ex esse qui aliquip dolore.",
  },
  {
    id: "629cd2c3493a7bc2f3109b75",
    title: "Xymonk",
    image:
      "https://media.gettyimages.com/photos/city-life-main-bazar-paharganj-new-delhi-india-picture-id962826702?s=612x612",
    address: "10 Erskine Loop, Tyro, Kentucky",
    description:
      "Duis et do eiusmod sunt consectetur proident aute proident eu consequat.",
  },
  {
    id: "629cd2c39ee18aae0e138c0b",
    title: "Endipin",
    image:
      "https://images.pexels.com/photos/1172253/pexels-photo-1172253.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    address: "10 Strong Place, Spelter, Montana",
    description: "Consequat cillum deserunt culpa in.",
  },
  {
    id: "629cd2c3ba6e2e563b4c3500",
    title: "Supremia",
    image:
      "https://media.istockphoto.com/photos/picturesque-morning-in-plitvice-national-park-colorful-spring-scene-picture-id1093110112?k=20&m=1093110112&s=612x612&w=0&h=3OhKOpvzOSJgwThQmGhshfOnZTvMExZX2R91jNNStBY=",
    address: "10 Elm Avenue, Ivanhoe, Mississippi",
    description:
      "Elit Lorem et amet ullamco do esse adipisicing sunt laboris do in nulla.",
  },
];
const HomePage = (props) => {
  // const [loadedMeetups, setLoadedMeetups] = useState([]);
  // useEffect(() => {
  //   setLoadedMeetups(DUMMY_MEETUPS);
  // }, []);

  return (
    <Fragment>
      <Head>
        <title>Meetups</title>
        <meta name="description" content="Browse a huge list of meetups" />
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
};

// SSG/ISG
// now the page is being pre-rendered with the data from the database.
// it will NOT pre-render for every incoming requests as this is not getServerSideProps.
// it will only pre-render during the build process and when we re-validate
// but because this is ISG (because of revalidate), This means, this page will NOT  be generated during the build process, but also generated on the server every “n” seconds if there is requests for this page
export const getStaticProps = async () => {
  // fetch data from API

  // securly connect to a DB
  try {
    // we are not hitting a GET requests to get the data as this is not required. We can directly access the DB from here.
    // This code anyways will be kept on the server and will not be a part of client bundle
    // store in database
    const client = await MongoClient.connect(
      `mongodb+srv://${constants.DATABSE.USERNAME}:${constants.DATABSE.PASSWORD}@cluster0.ojvah.mongodb.net/${constants.DATABSE.DB}?retryWrites=true&w=majority`
    );

    const db = client.db();

    // collection = tables
    // documents = entries in the tables (rows)
    const meetupsCollection = db.collection("meetups");

    // insert 1 new entry (document)
    const result = await meetupsCollection.find().toArray();

    client.close();
    // always returns obejct
    return {
      props: {
        meetups: result.map((item) => {
          return {
            title: item.title,
            address: item.address,
            image: item.image,
            id: item._id.toString(),
          };
        }),
      },
      revalidate: 10,
    };
  } catch (error) {
    return {
      props: {
        meetups: [],
      },
    };
  }
};
// SSR
// export const getServerSideProps = async (context) => {
//   // fetch data from file system or server
//   // can also use credentials that is not supposed to be exposed to the users
//   // this will always run on the server

//   // accessing the request and response (like a middleware)
//   const req = context.req; // access to request can be useful when you want to check some session cookie (during auth)
//   const res = context.res;
//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// };

export default HomePage;
