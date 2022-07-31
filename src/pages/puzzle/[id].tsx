import Head from 'next/head'
import { trpc } from '../../utils/trpc'
import Board from '../../components/Board'
import useMediaQuery from '../../hooks/useMediaQuery'

import { createSSGHelpers } from '@trpc/react/ssg';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { appRouter } from '../../server/router/index';
import superjson from 'superjson';
import { createContext } from '../../server/router/context';

export async function getServerSideProps(
    context: GetServerSidePropsContext<{ id: string }>,
) {
    const ssg = createSSGHelpers({
        router: appRouter,
        ctx: createContext(),
        transformer: superjson,
    });
    const id = context.params?.id as string;

    // Prefetch `post.byId`
    await ssg.fetchQuery('level.fetchById', id);

    // Make sure to return { props: { trpcState: ssg.dehydrate() } }
    return {
        props: {
            trpcState: ssg.dehydrate(),
            id,
        },
    };
}

const Puzzle = (
    props: InferGetServerSidePropsType<typeof getServerSideProps>,
) => {
    const { id } = props;

    const { data, isLoading: levelLoading } = trpc.useQuery(["level.fetchById", id as string], { staleTime: Infinity });
    const levelData = data || null;
    const isMobile = useMediaQuery("(max-width: 768px)");

    return <>
        <Head>
            <title>{data?.name}</title>
            <meta name="description" content={`${data?.size} x ${data?.size} nonogram/picross puzzle.`} />
        </Head>
        <div className="flex h-full w-full flex-col items-center justify-evenly">
            <header className="text-4xl my-8 text-center">&ldquo;{data?.name}&rdquo;</header>
            <div className="my-2">
                {!levelLoading && <Board levelData={levelData} size={isMobile ? 0 : 2} />}
            </div>
            <h2 className="text-3xl my-8">Size: {`${data?.size}x${data?.size}`}</h2>
        </div >
    </>
}

export default Puzzle