import { Machine, assign, spawn } from "xstate";

import {
  createSubredditMachine,
  SubredditMachine
} from "./createSubredditMachine";

// The hierarchical (recursive) schema for the states
export interface RedditStateSchema {
  states: {
    idle: {};
    selected: {};
  };
}

// The events that the machine handles
type RedditEvent = { type: "SELECT"; name: string };

// The context (extended state) of the machine
interface RedditContext {
  subreddits: { string?: SubredditMachine };
  subreddit: SubredditMachine | null;
}

export const redditMachine = Machine<
  RedditContext,
  RedditStateSchema,
  RedditEvent
>({
  id: "reddit",
  initial: "idle",
  context: {
    subreddits: {},
    subreddit: null
  },
  states: {
    idle: {},
    selected: {} // no invocations!
  },
  on: {
    SELECT: {
      target: ".selected",
      actions: assign((context, event) => {
        // Use the existing subreddit actor if one doesn't exist
        let subreddit = context.subreddits[event.name];

        if (subreddit) {
          return {
            ...context,
            subreddit
          };
        }

        // Otherwise, spawn a new subreddit actor and
        // save it in the subreddits object
        subreddit = spawn(createSubredditMachine(event.name));

        return {
          subreddits: {
            ...context.subreddits,
            [event.name]: subreddit
          },
          subreddit
        };
      })
    }
  }
});

export const selectEvent = {
  type: "SELECT", // event type
  name: "reactjs" // subreddit name
};
