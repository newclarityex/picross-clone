import Link from 'next/link';
import { trpc } from '../utils/trpc'
import { useRouter } from 'next/router'
import { useState } from 'react';

const TheNavbar = () => {
    const { data: randomLevel, refetch: refetchRandomLevel, isLoading: randomLevelLoading } = trpc.useQuery(["level.fetchRandom"]);
    const router = useRouter();

    const [navOpen, setNavOpen] = useState(false);

    return <>
        <button className={`absolute top-2 right-2 lg:hidden w-12 h-12 bg-blue-200 z-10 text-2xl`} onClick={() => setNavOpen(true)}>≡</button>
        <div className={`fixed top-0 left-0 w-full h-full bg-black/20 z-20 ${navOpen ? 'block lg:hidden' : 'hidden'}`} onClick={() => setNavOpen(false)} />
        <nav className={`
            ${navOpen ? '' : '-translate-x-full lg:translate-x-0'} 
            lg:bg-blue-400 bg-blue-200 text-white 
            flex flex-col lg:flex-row lg:justify-between items-center 
            z-30 w-fit lg:w-full h-full lg:h-auto
            absolute lg:relative top-0
            transition-transform duration-400
            `}>
            <Link href="/">
                <a className="text-5xl bg-blue-400 w-full text-center lg:text-left px-16 lg:px-12 py-4">Picross</a>
            </Link>
            <ul className="flex flex-col lg:flex-row text-3xl px-12 lg:px-4 text-center lg:text-left">
                <li className="mx-6 py-4">
                    <Link href="/">
                        <a onClick={() => setNavOpen(false)}>Home</a>
                    </Link>
                </li>
                <li className="mx-6 py-4">
                    <Link href="/editor">
                        <a onClick={() => setNavOpen(false)}>Editor</a>
                    </Link>
                </li>
                <li className="mx-6 py-4">
                    <Link href="/browse">
                        <a onClick={() => setNavOpen(false)}>Browse</a>
                    </Link>
                </li>
                <li className="mx-6 py-4">
                    <button disabled={randomLevel === undefined || randomLevel === null || randomLevelLoading} onClick={
                        async () => {
                            setNavOpen(false);
                            await refetchRandomLevel();
                            router.push(`../puzzle/${randomLevel!.id}`);
                        }
                    } className="disabled:opacity-20">Random</button>
                </li>
            </ul>
        </nav>
    </>
};

export default TheNavbar;
