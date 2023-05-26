import Link from "next/link";
import Layout from "../../components/Layout";
import { useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { getAllTaskIds, getTaskData } from "../../lib/tasks";

const fetcher = (url) => fetch(url).then((res) => res.json());

const Post = ({ stasicTask, id }) => {
  const router = useRouter();
  const { data: task, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/detail-task/${id}`,
    fetcher,
    {
      fallbackData: stasicTask,
    }
  );

  useEffect(() => {
    mutate();
  }, []);

  if (router.isFallback || !task) {
    return <div>loading...</div>;
  }
  return (
    <Layout title={task.title}>
      <span className="mb-4">
        {"ID:"}
        {task.id}
      </span>

      <p className="mb-4 text-bold font-bold">{task.title}</p>
      <p className="mb-12">{task.created_at}</p>

      <Link href="/task-page">
        <div className="flex cursor-pointer mt-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-6 h-6 mr-3"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
            />
          </svg>
          <span>Back To Task Page</span>
        </div>
      </Link>
    </Layout>
  );
};

export default Post;

export async function getStaticPaths() {
  const paths = await getAllTaskIds();

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const { task: stasicTask } = await getTaskData(params.id);
  return {
    props: {
      id: stasicTask.id,
      stasicTask,
    },
    revalidate: 3,
  };
}
