import React, { Fragment } from "react";
import { ObjectId } from "mongodb";
import getMeetupsCollection, { closeClient } from "../../components/db";
import MeetupDetail from "../../components/meetups/MeetupDetail";
import Head from "next/head";

const MeetupDetails = (props) => {
  const { meetupData } = props;
  return (
    <Fragment>
      <Head>
        <title>{meetupData.title}</title>
        <meta name="description" content={meetupData.description} />
      </Head>
      <MeetupDetail
        image={meetupData.image}
        title={meetupData.title}
        address={meetupData.address}
        description={meetupData.description}
      />
    </Fragment>
  );
};

// it has the job to return the object which defines all the dynamic segment values
// in this case, it should return all the meetupId
export async function getStaticPaths() {
  // fetch all the meetupId present from the database
  try {
    // collection = tables
    // documents = entries in the tables (rows)
    const meetupsCollection = await getMeetupsCollection();

    // insert 1 new entry (document)
    const meetups = await meetupsCollection.find({}).toArray();

    console.log("meetups", meetups);

    // returns an object / version of the page
    // every object has a params object which holds key-value pairs to route params and their possible values
    return {
      fallback: false,
      paths: meetups.map((item) => {
        return {
          params: {
            meetupId: item._id.toString(),
          },
        };
      }),
    };
  } catch (error) {
    return {
      fallback: false,
      paths: [],
    };
  }
}

// going with SSG because the data here will not change multiple times / second
export async function getStaticProps(context) {
  // fetch data for a single meetup
  const meetupId = context.params.meetupId;

  try {
    const meetupsCollection = await getMeetupsCollection();
    const selectedMeetup = await meetupsCollection.findOne({
      _id: ObjectId(meetupId),
    });
    closeClient();
    return {
      props: {
        meetupData: {
          id: selectedMeetup._id.toString(),
          image: selectedMeetup.image,
          title: selectedMeetup.title,
          address: selectedMeetup.address,
          description: selectedMeetup.description,
        },
      },
    };
  } catch (error) {
    return {};
  }
}

export default MeetupDetails;
