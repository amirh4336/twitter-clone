"use client"
import { useSession } from "next-auth/react";
import Button from "./button";


const FollowButton = ({
  userId,
  isFollowing,
}: {
  userId: string;
  isFollowing: boolean;
}) => {
  const session = useSession();

  if (session.status !== "authenticated"|| session.data.user.id === userId) {
    return null;
  }

  const onClick = () => {}

  return (
    <Button onClick={onClick} small gray={isFollowing}>
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default FollowButton