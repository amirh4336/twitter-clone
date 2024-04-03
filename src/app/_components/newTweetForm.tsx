"use client";
import { useSession } from "next-auth/react";
import Button from "./button";
import ProfileImage from "./profileImage";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { api } from "~/trpc/react";

function updateTextAreaSize(textArea?: HTMLTextAreaElement) {
  if (textArea == null) return;
  textArea.style.height = "0";
  textArea.style.height = `${textArea.scrollHeight}px`;
}

const NewTweetForm = () => {
  const session = useSession();
  const [inputValue, setInputValue] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>();
  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaSize(textArea);
    textAreaRef.current = textArea;
  }, []);

  const trpcUtils = api.useContext();

  useLayoutEffect(() => {
    updateTextAreaSize(textAreaRef.current);
  }, [inputValue]);

  const createTweet = api.tweet.create.useMutation({
    onSuccess: (newTweet) => {
      setInputValue("");

      if (session.status !== "authenticated") return;

      // @ts-expect-error don't set the params 
      const updateNewTweet: Parameters<
        typeof trpcUtils.tweet.infiniteFeed.setInfiniteData
      >[1] = (oldData) => {
        if (oldData == null) return;
        if (oldData.pages[0] == null) return;

        const newCacheTweed = {
          ...newTweet,
          likeCount: 0,
          likedByMe: false,
          createdAt: new Date().toISOString(),
          user: {
            id: session.data.user.id,
            name: session.data.user.name,
            image: session.data.user.image,
          },
        };

        return {
          ...oldData,
          pages: [
            {
              ...oldData.pages[0],
              tweets: [newCacheTweed, ...oldData.pages[0].tweets],
            },
            ...oldData.pages.slice(1),
          ],
        };
      };

      trpcUtils.tweet.infiniteFeed.setInfiniteData({}, updateNewTweet);
    },
  });

  if (session.status !== "authenticated") return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createTweet.mutate({ content: inputValue });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 border-b px-4 py-2"
    >
      <div className="flex gap-4">
        <ProfileImage src={session.data.user.image} />
        <textarea
          ref={inputRef}
          style={{ height: 0 }}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-grow resize-none overflow-hidden p-4 text-lg outline-none"
          placeholder="What's happening?"
        />
      </div>
      <Button className="self-end">Tweet</Button>
    </form>
  );
};

export default NewTweetForm;
