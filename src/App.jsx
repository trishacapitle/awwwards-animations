import Hero from "./pages/Hero";
import Loader from "./pages/Loader";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useRef } from "react";
import TileFlip from "./pages/TileFlip";

const App = () => {
	gsap.registerPlugin(useGSAP, ScrollSmoother);
  const smoother = useRef();
  const main = useRef();
	useGSAP(
		() => {
			smoother.current = ScrollSmoother.create({
				smooth: 2,
				effects: true,
			});
		},
		{ scope: main }
	);

  return (
		<div id="smooth-wrapper" ref={main}>
			<div id="smooth-content">
				<Hero />
				<Loader />
				<TileFlip />
			</div>
		</div>
	);
};

export default App;
