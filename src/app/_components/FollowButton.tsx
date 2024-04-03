"use client";
import { useSession } from "next-auth/react";
import Button from "./button";

const FollowButton = ({
  onClick,
  isLoading,
  userId,
  isFollowing,
}: {
  onClick: () => void;
  userId: string;
  isFollowing: boolean;
  isLoading: boolean;
}) => {
  const session = useSession();

  if (session.status !== "authenticated" || session.data.user.id === userId) {
    return null;
  }

  return (
    <Button onClick={onClick} disabled={isLoading} small gray={isFollowing}>
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default FollowButton;
