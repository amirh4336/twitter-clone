"use client";
import Link from "next/link";
import { VscArrowLeft } from "react-icons/vsc";
import FollowButton from "./FollowButton";
import IconHoverEffect from "./iconHoverEffect";
import ProfileImage from "./profileImage";
import TweetsWrapper from "./tweetsWrapper";
import { api } from "~/trpc/react";
import LoadingSpinner from "./loadingSpinner";

type Props = {
  params: { id: string };
};

const Profile = ({ params: { id } }: Props) => {
  const { data: profile } = api.profile.getById.useQuery({
    id,
  });

  
  const trpcUtils = api.useUtils()
  
  const toggleFollow = api.profile.toggleFollow.useMutation({
    onSuccess: ({ addedFollow }) => {
      trpcUtils.profile.getById.setData({ id }, (oldData) => {
        if (oldData == null) return
        
        const countModifier = addedFollow ? 1 : -1
        return {
          ...oldData, 
          isFollowing: addedFollow,
          followersCount: oldData.followersCount + countModifier
        }
      })
    },
  });
  
  if (profile == null ?? profile?.name == null) return <LoadingSpinner />;
  
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
          onClick={() => toggleFollow.mutate({ userId: id })}
          isLoading={toggleFollow.isPending}
          isFollowing={profile.isFollowing}
          userId={id}
        />
      </header>
      <TweetsWrapper id={id} />
    </>
  );
};

const pluralRules = new Intl.PluralRules();
const getPlural = (number: number, singular: string, plural: string) => {
  return pluralRules.select(parseInt(number.toString())) === "one"
    ? singular
    : plural;
};

export default Profile;
