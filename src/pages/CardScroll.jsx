import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import './css/CardScroll.css'

const CardScroll = () => {
	
	useGSAP(() => {
		gsap.registerPlugin(useGSAP, ScrollTrigger);

		const lenis = new Lenis();
		lenis.on("scroll", ScrollTrigger.update);
		gsap.ticker.add((time) => lenis.raf(time * 1000));
		gsap.ticker.lagSmoothing(0);

		const smoothStep = (p) => p * p * (3 - 2 * p);

		ScrollTrigger.create({
			trigger: ".scroll-container",
			start: "top top",
			end: "75% top",
			scrub: 1,
			onUpdate: (self) => {
				const progress = self.progress;
				const heroCardsContainerOpacity = gsap.utils.interpolate(
					1,
					0.5,
					smoothStep(progress)
				);
				gsap.set(".scroll-hero-cards", { opacity: heroCardsContainerOpacity });

				["#scroll-hero-card-1", "#scroll-hero-card-2", "#scroll-hero-card-3"].forEach(
					(cardId, index) => {
						const delay = index * 0.9;
						const cardProgress = gsap.utils.clamp(
							0,
							1,
							(progress - delay * 0.1) / (1 - delay * 0.1)
						);

						const y = gsap.utils.interpolate(
							"0%",
							"250%",
							smoothStep(cardProgress)
						);

						const scale = gsap.utils.interpolate(
							1,
							0.75,
							smoothStep(cardProgress)
						);

						let x = "0%";
						let rotation = 0;
						if (index === 0) {
							x = gsap.utils.interpolate("0%", "90%", smoothStep(cardProgress));
							rotation = gsap.utils.interpolate(
								0,
								-15,
								smoothStep(cardProgress)
							);
						} else if (index === 2) {
							x = gsap.utils.interpolate(
								"0%",
								"-90%",
								smoothStep(cardProgress)
							);
							rotation = gsap.utils.interpolate(
								0,
								15,
								smoothStep(cardProgress)
							);
						}

						gsap.set(cardId, {
							y,
							x,
							rotation,
							scale,
						});
					}
				);
			},
		});

		ScrollTrigger.create({
			trigger: ".scroll-services",
			start: "top top",
			end: `+=${window.innerHeight * 4}px`,
			pin: ".scroll-services",
			// pinSpacing: true,
		});

		ScrollTrigger.create({
			trigger: ".scroll-services",
			start: "top top",
			end: `+=${window.innerHeight * 4}px`,
			onLeave: () => {
				const servicesSection = document.querySelector(".services");
				const servicesRect = servicesSection.getBoundingClientRect();
				const servicesTop = window.pageYOffset + servicesRect.top;

				gsap.set(".scroll-cards", {
					position: "absolute",
					top: servicesTop,
					left: 0,
					width: "100vw",
					height: "100vh",
				});
			},
			onEnterBack: () => {
				gsap.set(".scroll-cards", {
					position: "fixed",
					top: 0,
					left: 0,
					width: "100vw",
					height: "100vh",
				});
			},
		});

		ScrollTrigger.create({
			trigger: ".scroll-services",
			start: "top bottom",
			end: `+=${window.innerHeight * 4}px`,
			scrub: 1,
			onUpdate: (self) => {
				const progress = self.progress;
				const headerProgress = gsap.utils.clamp(0, 1, progress / 0.9);
				const headerY = gsap.utils.interpolate(
					"400%",
					"0%",
					smoothStep(headerProgress)
				);
				gsap.set(".scroll-services-header", { y: headerY });

				["#scroll-card-1", "#scroll-card-2", "#scroll-card-3"].forEach((cardId, index) => {
					const delay = index * 0.5;
					const cardProgress = gsap.utils.clamp(
						0,
						1,
						(progress - delay * 0.1) / (0.9 - delay * 0.1)
					);

					const innerCard = document.querySelector(
						`${cardId} .flip-card-inner`
					);

					let y;
					if (cardProgress < 0.4) {
						const normalizedProgress = cardProgress / 0.4;
						y = gsap.utils.interpolate(
							"-100%",
							"50%",
							smoothStep(normalizedProgress)
						);
					} else if (cardProgress < 0.6) {
						const normalizedProgress = (cardProgress - 0.4) / 0.2;
						y = gsap.utils.interpolate(
							"50%",
							"0%",
							smoothStep(normalizedProgress)
						);
					} else {
						y = "0%";
					}

					let scale;
					if (cardProgress < 0.4) {
						const normalizedProgress = cardProgress / 0.4;
						scale = gsap.utils.interpolate(
							0.25,
							0.75,
							smoothStep(normalizedProgress)
						);
					} else if (cardProgress < 0.6) {
						const normalizedProgress = (cardProgress - 0.4) / 0.2;
						scale = gsap.utils.interpolate(
							0.75,
							1,
							smoothStep(normalizedProgress)
						);
					} else {
						scale = 1;
					}

					let opacity;
					if (cardProgress < 0.2) {
						const normalizedProgress = cardProgress / 0.2;
						opacity = smoothStep(normalizedProgress);
					} else {
						opacity = 1;
					}

					let x, rotate, rotationY;
					if (cardProgress < 0.6) {
						x = index === 0 ? "100%" : index === 1 ? "0%" : "-100%";
						rotate = index === 0 ? -5 : index === 1 ? 0 : 5;
						rotationY = 0;
					} else if (cardProgress < 1) {
						const normalizedProgress = (cardProgress - 0.6) / 0.4;
						x = gsap.utils.interpolate(
							index === 0 ? "100%" : index === 1 ? "0%" : "-100%",
							"0%",
							smoothStep(normalizedProgress)
						);
						rotate = gsap.utils.interpolate(
							index === 0 ? -5 : index === 1 ? 0 : 5,
							0,
							smoothStep(normalizedProgress)
						);
						rotationY = smoothStep(normalizedProgress) * 180;
					} else {
						x = "0%";
						rotate = 0;
						rotationY = 180;
					}

					gsap.set(cardId, {
						opacity,
						y,
						x,
						rotate,
						scale,
					});
					gsap.set(innerCard, {
						rotationY,
					});
				});
			},
		});
	});
	
	return (
		<div className="scroll-container">
			<nav>
				<div className="scroll-logo">
					<span>Logo Here</span>
				</div>
				<div className="scroll-menu-btn">
					<span>Menu</span>
				</div>
			</nav>

			<section className="scroll-hero">
				<div className="scroll-hero-cards">
					<div className="scroll-card" id="scroll-hero-card-1">
						<div className="scroll-card-title">
							<span>Plan</span>
							<span>01</span>
						</div>
						<div className="scroll-card-title">
							<span>01</span>
							<span>Plan</span>
						</div>
					</div>
					<div className="scroll-card" id="scroll-hero-card-2">
						<div className="scroll-card-title">
							<span>Design</span>
							<span>02</span>
						</div>
						<div className="scroll-card-title">
							<span>02</span>
							<span>Design</span>
						</div>
					</div>
					<div className="scroll-card" id="scroll-hero-card-3">
						<div className="scroll-card-title">
							<span>Develop</span>
							<span>03</span>
						</div>
						<div className="scroll-card-title">
							<span>03</span>
							<span>Develop</span>
						</div>
					</div>
				</div>
			</section>

			<section className="scroll-about">
				<h1>Keep scrolling — it gets good</h1>
			</section>

			<section className="scroll-services">
				<div className="scroll-services-header">
					<h1>Smooth animations that feels right</h1>
				</div>
			</section>

			<section className="scroll-cards">
				<div className="scroll-cards-container">
					<div className="scroll-card" id="scroll-card-1">
						<div className="scroll-card-wrapper">
							<div className="flip-card-inner">
								<div className="flip-card-front">
									<div className="scroll-card-title">
										<span>Plan</span>
										<span>01</span>
									</div>
									<div className="scroll-card-title">
										<span>01</span>
										<span>Plan</span>
									</div>
								</div>
								<div className="flip-card-back">
									<div className="scroll-card-title">
										<span>Plan</span>
										<span>01</span>
									</div>
									<div className="scroll-card-copy">
										<p>Discovery</p>
										<p>Audit</p>
										<p>User Flow</p>
										<p>Site Map</p>
										<p>Personas</p>
										<p>Strategy</p>
									</div>
									<div className="scroll-card-title">
										<span>01</span>
										<span>Plan</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="scroll-card" id="scroll-card-2">
						<div className="scroll-card-wrapper">
							<div className="flip-card-inner">
								<div className="flip-card-front">
									<div className="scroll-card-title">
										<span>Design</span>
										<span>02</span>
									</div>
									<div className="scroll-card-title">
										<span>02</span>
										<span>Design</span>
									</div>
								</div>
								<div className="flip-card-back">
									<div className="scroll-card-title">
										<span>Design</span>
										<span>02</span>
									</div>
									<div className="scroll-card-copy">
										<p>Wireframes</p>
										<p>UI Kits</p>
										<p>Prototypes</p>
										<p>Visual Style</p>
										<p>Interaction</p>
										<p>Design QA</p>
									</div>
									<div className="scroll-card-title">
										<span>02</span>
										<span>Design</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="scroll-card" id="scroll-card-3">
						<div className="scroll-card-wrapper">
							<div className="flip-card-inner">
								<div className="flip-card-front">
									<div className="scroll-card-title">
										<span>Develop</span>
										<span>03</span>
									</div>
									<div className="scroll-card-title">
										<span>03</span>
										<span>Develop</span>
									</div>
								</div>
								<div className="flip-card-back">
									<div className="scroll-card-title">
										<span>Develop</span>
										<span>03</span>
									</div>
									<div className="scroll-card-copy">
										<p>HTML/CSS/JS</p>
										<p>CMS Build</p>
										<p>GSAP Motion</p>
										<p>Responsive</p>
										<p>Optimization</p>
										<p>Launch</p>
									</div>
									<div className="scroll-card-title">
										<span>03</span>
										<span>Develop</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="scroll-outro">
				<h1>It's just the start of the beginning...</h1>
			</section>
		</div>
	);
};

export default CardScroll;
