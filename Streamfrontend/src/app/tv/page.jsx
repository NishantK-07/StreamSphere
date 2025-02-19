import BannerSection from "@/components/Sections/BannerSection";
import CategoriesSection from "@/components/Sections/CategroySection";
import JumperSection from "@/components/Sections/Jumper";
import { api, ENDPOINT } from "@/lib/api";


export default function Home() {
    const list = [
        {
            label: "Comedy",
            href: "comedy",
            fetcher: async () => {
                const resp=await api.get(ENDPOINT.fetchComedyMovies);
                const data= resp?.data?.response?.results
                return data;
            },
        },
        {
            label: "Crime",
            href: "crime",
            fetcher: async () => {
                const resp=await api.get(ENDPOINT.fetchCrimeTvShows);
                const data= resp?.data?.response?.results
                return data;
            },
        },
        {
            label: "Drama",
            href: "drama",
            fetcher: async () => {
                const resp=await api.get(ENDPOINT.fetchDramaTvShows);
                const data= resp?.data?.response?.results
                return data;
            },
        },
        {
            label: "Action",
            href: "action",
            fetcher: async () => {
                const resp=await api.get(ENDPOINT.fetchActionTvShows);
                const data= resp?.data?.response?.results
                return data;
            },
        },
    ];
    const getTVBannerData = async () => {
        const resp=await api.get(ENDPOINT.fetchMysteryTvShows);
                const data= resp?.data?.response?.results
                return data;
    };

  return (
    <>
    {/* <JumperSection list={list}/>
          <BannerSection fetcher={getTVBannerData}/> */}
    {/* // list of categories  */}
      {/* {list.map((item) => {
        return <CategoriesSection key={item.label} title={item.label} id={item.href} fetcher={item.fetcher} />
      })} */}
    </>
  );
}