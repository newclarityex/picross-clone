import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);

  return (
    <>
      <Head>
        <title>Picross</title>
        <meta name="description" content="A simple Picross clone." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        
      </div>
    </>
  );
};

export default Home;
