import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./css/Loader.css";

const Loader = () => {
	const loaderRef = useRef();
  const landingRef = useRef();
  
  gsap.registerPlugin(useGSAP, ScrollTrigger);

	useGSAP(() => {
		const letters = loaderRef.current.querySelectorAll(".text span");
		const tl = gsap.timeline({
			// scrollTrigger: ".loader",
			// start: "top 20%"
		});

		tl.to(letters, {
			duration: 0.6,
			y: 0,
			stagger: 0.05,
			ease: "power2.out",
		})
			.to(letters, {
				"--clipPath": "inset(0% 0 0 0)",
				duration: 0.8,
				delay: 0.3,
				stagger: 0.05,
				ease: "power1.inOut",
			})
			.to(letters, {
				duration: 0.6,
				y: 100,
				opacity: 0,
				stagger: 0.05,
				delay: 0.5,
				ease: "power2.in",
			})
			.to(
				loaderRef.current,
				{
					y: -100,
					opacity: 0,
					duration: 0.7,
					ease: "power2.inOut",
					pointerEvents: "none",
				},
				"-=0.3"
			)
			.fromTo(
				landingRef.current,
				{ opacity: 0, y: 50 },
				{ opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
				"-=0.3"
			);
	});

	return (
		<div>
			<div className="loader" ref={loaderRef}>
				<div className="text">
					<span data-text="A">A</span>
					<span data-text="S">S</span>
					<span data-text="H">H</span>
					<span data-text="D">D</span>
					<span data-text="E">E</span>
					<span data-text="V">V</span>
				</div>
			</div>
			<section ref={landingRef} className="landing">
				<h1>Landing Page</h1>
				<p>This is your placeholder content.</p>
			</section>
		</div>
	);
};

export default Loader;
