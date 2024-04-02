import InfiniteTweetList from "./_components/infiniteTweetList";
import NewTweetForm from "./_components/newTweetForm";


export default async function Home() {
  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-white pt-2">
        <h1 className="mb-2 px-4 text-lg font-bold">Home</h1>
      </header>
      <NewTweetForm />
      <RecentTweets />
    </>
  );
}

const RecentTweets = () => {
  const tweets = []

  return <InfiniteTweetList tweets={tweets}  />
}