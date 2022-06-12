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

    // returns an object / version of the page
    // every object has a params object which holds key-value pairs to route params and their possible values
    return {
      fallback: "blocking", // NextJS will not respond with a 404 page if it does not find a pre-rendered page immediately for the id requested by user. It will then generate (pre-generate) when needed and cache it. With fallback: true, it will immediatekly return empty page, and then pull down the dynamically geneerated page and then show it. In "blocking", all it does is just shows the pre-generated page once done.
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
      fallback: "blocking",
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
