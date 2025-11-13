import Hero from "../components/Home/Hero";
import Products from "../components/Home/Products";
import Quality from "../components/Home/Quality";


const Home = () => {
  return (
    <main className="bg-gray-200">
      <Hero />
      <Quality />
      <Products />
    </main>
  );
};

export default Home;
