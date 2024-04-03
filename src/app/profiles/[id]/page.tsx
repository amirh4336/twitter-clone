import type { Metadata, NextPage } from "next";
import Profile from "~/app/_components/profile";

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

const Page: NextPage<Props> = ({ params }) => {
  return (
    <>
      <Profile params={params} />
    </>
  );
};

export default Page;
