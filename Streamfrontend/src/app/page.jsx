
import BannerSection from "@/components/Sections/BannerSection";
import CategoriesSection from "@/components/Sections/CategroySection";
import Header from "@/components/Sections/Header";
import JumperSection from "@/components/Sections/Jumper";
import {api,ENDPOINT} from "@/lib/api"

export default function Home() {
  //pass this list in jumper section
  const list = [
    {
      label: "Top Rated",
      href: "top-rated",
      fetcher:async function getTopRatedData() {
      const resp = await api.get(ENDPOINT.discoverTopRated);
      const data = resp?.data?.response?.results;
      return data;
    }
    },
    {
      label: "Popular",
      href: "popular",
      fetcher:async function getPopular(){
        const resp = await api.get(ENDPOINT.discoverTrending);
        const data = resp?.data?.response?.results;
        return data;
      }
    },
    {
      label: "Upcoming",
      href: "upcoming",
      fetcher: async function getUpcoming() {
        const resp = await api.get(ENDPOINT.discoverUpcoming);
        const data = resp?.data?.response?.results;
        return data;
      }
    },
  ];
  async function getHomeBannerData() {
    try {
      const resp = await api.get(ENDPOINT.discoverNowPlaying);
      if (!resp.status) {
        throw new Error(`API request failed with status: ${resp.status}`);
      }
      const data = resp?.data?.response?.results; // Assuming the response is JSON
      console.log("data is coming dont worry");
      return data;
    } catch (error) {
      console.error('Error fetching home banner data:', error);
      return []; // Or any fallback data
    }
  }
  return (
    <>
    
    <JumperSection list={list}/> 
    <BannerSection fetcher={getHomeBannerData}/> 
    {/* // list of categories  */}
    {list.map((item) => {
        return <CategoriesSection key={item.label} title={item.label} id={item.href} fetcher={item.fetcher} />
      })} 
    <Header/> 
    </>
  );
}
