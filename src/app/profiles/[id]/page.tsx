import type { GetStaticPathsContext } from "next";
import Head from "next/head";
import { ssgHelper } from "~/server/api/ssgHelper";

const Page = () => {
  return (
    <>
      <Head>
        <title>{`Twitter Clone ${user.name}`}</title>
      </Head>
    </>
  );
};

export async function GetStaticProps(context: GetStaticPathsContext<{id : string}>) {
  const id = context.params.id;

  if (id == null) {
    return {
      redirect : {
        destination : "/"
      }
    }
  }

  const ssg = ssgHelper()

  ssg.profile

}

export default Page;
