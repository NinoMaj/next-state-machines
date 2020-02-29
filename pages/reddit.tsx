import React from "react";
import Head from "next/head";
import { useMachine } from "@xstate/react";

import { redditMachine } from "../machines/reddit";
const subreddits = ["frontend", "reactjs", "vuejs"];

import Nav from "../components/nav";
import Subreddit from "../components/subreddit";

const Reddit = () => {
  const [current, send] = useMachine(redditMachine);
  const { subreddit } = current.context;
  return (
    <div>
      <Head>
        <title>Reddit</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <div className="hero">
        <h1 className="title">Reddit</h1>
        <main>
          <header>
            <select
              onChange={e => {
                send("SELECT", { name: e.target.value });
              }}
            >
              {subreddits.map(subreddit => {
                return <option key={subreddit}>{subreddit}</option>;
              })}
            </select>
          </header>
          {subreddit && <Subreddit service={subreddit} key={subreddit.id} />}
        </main>
      </div>

      <style jsx>{`
        .hero {
          width: 100%;
          padding: 16px;
          color: #333;
        }
        .title {
          margin: 0;
          width: 100%;
          padding-top: 80px;
          line-height: 1.15;
          font-size: 48px;
        }
      `}</style>
    </div>
  );
};

export default Reddit;
