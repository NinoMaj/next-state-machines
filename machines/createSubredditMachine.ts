import { Machine, assign, Interpreter } from "xstate";
import fetch from "isomorphic-unfetch";

function invokeFetchSubreddit(context) {
  const { subreddit } = context;

  return fetch(`https://www.reddit.com/r/${subreddit}.json`)
    .then(response => response.json())
    .then(json => json.data.children.map(child => child.data));
}

export interface SubredditStateSchema {
  states: {
    loading: {};
    loaded: {};
    failure: {};
  };
}

// The events that the machine handles
export type SubredditEvent =
  | { type: "SELECT"; name: string }
  | { type: "REFRESH" }
  | { type: "RETRY" };

interface Post {
  id: string;
  title: string;
}

// The context (extended state) of the machine
export interface SubredditContext {
  subreddit: string;
  posts: Post[] | null;
  lastUpdated: number | null;
}

export type SubredditMachine = Interpreter<
  SubredditContext,
  SubredditStateSchema,
  SubredditEvent
>;

export const createSubredditMachine = (subreddit: string) => {
  return Machine<SubredditContext, SubredditStateSchema, SubredditEvent>({
    id: "subreddit",
    initial: "loading",
    context: {
      subreddit, // subreddit name passed in
      posts: null,
      lastUpdated: null
    },
    states: {
      loading: {
        invoke: {
          id: "fetch-subreddit",
          src: invokeFetchSubreddit,
          onDone: {
            target: "loaded",
            actions: assign({
              posts: (_, event) => event.data,
              lastUpdated: () => Date.now()
            })
          },
          onError: "failure"
        }
      },
      loaded: {
        on: {
          REFRESH: "loading"
        }
      },
      failure: {
        on: {
          RETRY: "loading"
        }
      }
    }
  });
};
