import BannerSection from "@/components/Sections/BannerSection";
import CategoriesSection from "@/components/Sections/CategroySection";
import JumperSection from "@/components/Sections/Jumper";
import { api, ENDPOINT } from "@/lib/api";


export default function Home() {
    const list = [
        {
            label: "Top Comedy Movies",
            href: "comedy",
            fetcher: async () => {
                const resp=await api.get(ENDPOINT.fetchComedyMovies);
                const data= resp?.data?.response?.results
                return data;
            },
        },
        {
            label: "Top Horror Movies",
            href: "horror",
            fetcher: async () => {
                const resp=await api.get(ENDPOINT.fetchHorrorMovies);
                const data= resp?.data?.response?.results
                return data;
            },
        },
        {
            label: "Top Romance Movies",
            href: "romance",
            fetcher: async () => {
                const resp=await api.get(ENDPOINT.fetchRomanceMovies);
                const data= resp?.data?.response?.results
                return data;
            },
        },
        {
            label: "Top Action Movies",
            href: "action",
            fetcher: async () => {
                const resp=await api.get(ENDPOINT.fetchActionMovies);
                const data= resp?.data?.response?.results
                return data;
            },
        },
    ];
    const getMoviesBannerData = async () => {
        const resp=await api.get(ENDPOINT.discoverNowPlaying);
                const data= resp?.data?.response?.results
                return data;
    };

    return (
        <>
            {/* <JumperSection list={list} />
            <BannerSection fetcher={getMoviesBannerData} /> */}
            {/* // list of categories  */}
            {/* {list.map((item) => {
                return <CategoriesSection key={item.label} title={item.label} id={item.href} fetcher={item.fetcher} />
            })} */}
            
        </>
    );
}