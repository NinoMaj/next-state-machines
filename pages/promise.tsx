import React from "react";
import Head from "next/head";
import { Machine } from "xstate";

import Nav from "../components/nav";

const Home = () => {
  const promiseMachine = Machine({
    id: "promise",
    initial: "pending",
    states: {
      pending: {
        on: {
          RESOLVE: "resolved",
          REJECT: "rejected"
        }
      },
      resolved: {
        type: "final"
      },
      rejected: {
        type: "final"
      }
    }
  });
  promiseMachine.transition("pending", "RESOLVE");
  console.log(promiseMachine.parent);

  return (
    <div>
      <Head>
        <title>Promise</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav />

      <div className="hero">
        <h1 className="title">Welcome to Next.js!</h1>
        <p className="description">
          To get started, edit <code>pages/index.js</code> and save to reload.
        </p>
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
        .title,
        .description {
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default Home;
