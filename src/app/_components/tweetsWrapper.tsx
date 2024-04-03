"use client";

import { api } from "~/trpc/react";
import InfiniteTweetList from "./infiniteTweetList";

type TweetsWrapperProps = {
  id: string;
};

const TweetsWrapper = ({ id }: TweetsWrapperProps) => {
  const tweets = api.tweet.infiniteProfileFeed.useInfiniteQuery(
    { userId: id },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );

  return (
    <main>
      <InfiniteTweetList
        tweets={tweets.data?.pages.flatMap((page) => page.tweets)}
        isError={tweets.isError}
        isLoading={tweets.isLoading}
        hasMore={tweets.hasNextPage}
        fetchNewTweets={tweets.fetchNextPage}
      />
    </main>
  );
};

export default TweetsWrapper;
