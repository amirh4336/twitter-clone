import type { Metadata, NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { VscArrowLeft } from "react-icons/vsc";
import Button from "~/app/_components/button";
import IconHoverEffect from "~/app/_components/iconHoverEffect";
import ProfileImage from "~/app/_components/profileImage";
import TweetsWrapper from "~/app/_components/tweetsWrapper";
import { getServerAuthSession } from "~/server/auth";

import { api } from "~/trpc/server";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const id = params.id;

  // fetch data
  const profile = await api.profile.getById({
    id,
  });

  return {
    title: `Twitter Clone - ${profile?.name}`,
  };
}

const Page: NextPage<Props> = async ({ params }) => {
  const profile = await api.profile.getById({
    id: params.id,
  });

  if (profile == null ?? profile?.name == null)
    return <p>Opss we have a problem</p>;

  return (
    <>
      <header className="sticky top-0 z-10 flex items-center border-b bg-white p-2 px-4">
        <Link href=".." className="mr-2">
          <IconHoverEffect>
            <VscArrowLeft className="h-6 w-6" />
          </IconHoverEffect>
        </Link>
        <ProfileImage src={profile.image} className="flex-shrink-0" />
        <div className="ml-2 flex-grow">
          <h1 className="text-lg font-bold">{profile.name}</h1>
          <div className="text-gray-500">
            {profile.tweetsCount}{" "}
            {getPlural(profile.tweetsCount, "Tweet", "Tweets")} -{" "}
            {profile.followersCount}{" "}
            {getPlural(profile.followersCount, "Follower", "Followers")} -{" "}
            {profile.followsCount} Following
          </div>
        </div>
        <FollowButton
          isFollowing={profile.isFollowing}
          userId={params.id}
          onClick={() => null}
        />
      </header>
      <TweetsWrapper id={params.id} />
    </>
  );
};

const FollowButton = async ({
  userId,
  isFollowing,
  onClick,
}: {
  userId: string;
  isFollowing: boolean;
  onClick: () => void;
}) => {
  const session = await getServerAuthSession();

  if (session?.user == null || session.user.id === userId) {
    return null;
  }

  return (
    <Button onClick={onClick} small gray={isFollowing}>
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
};

const pluralRules = new Intl.PluralRules();
const getPlural = (number: number, singular: string, plural: string) => {
  return pluralRules.select(parseInt(number.toString())) === "one"
    ? singular
    : plural;
};

export default Page;
