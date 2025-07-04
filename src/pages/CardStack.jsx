import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import './css/CardStack.css'

const CardStack = () => {
	gsap.registerPlugin(useGSAP, ScrollTrigger);

	useGSAP(() => {
		// Initialize Lenis for smooth scrolling and connect to GSAP ticker
		const lenis = new Lenis();
		lenis.on("scroll", ScrollTrigger.update);

		gsap.ticker.add((time) => {
			lenis.raf(time * 1000);
		});
		gsap.ticker.lagSmoothing(0);

		// DOM element references
		const pinnedSection = document.querySelector(".stack-pinned");
		const stickyHeader = document.querySelector(".stack-sticky-header");
		const cards = document.querySelectorAll(".stack-card");
		const progressBarContainer = document.querySelector(".stack-progress-bar");
		const progressBar = document.querySelector(".stack-progress");
		const indicesContainer = document.querySelector(".stack-indices");
		const indices = document.querySelectorAll(".stack-index");

		// Animation configuration
		const cardCount = cards.length;
		const pinnedHeight = window.innerHeight * (cardCount + 1);
		const startRotations = [0, 5, 0, -5]; // Initial card rotations
		const endRotations = [10, -5, 10, 5]; // Final card rotations
		const progressColors = ["#ecb74c", "#7dd8cd", "#e0ff57", "#7dd8cd"]; // Progress bar colors

		// Set initial card rotations
		cards.forEach((card, index) => {
			gsap.set(card, { rotation: startRotations[index] });
		});

		let isProgressBarVisible = false;
		let currentActiveIndex = -1;

		// Animate opacity of indices (timeline markers)
		function animateIndexOpacity(newIndex) {
			if (newIndex !== currentActiveIndex) {
				indices.forEach((index, i) => {
					gsap.to(index, {
						opacity: i === newIndex ? 1 : 0.25,
						duration: 0.5,
						ease: "power2.Out",
					});
				});

				currentActiveIndex = newIndex;
			}
		}

		// Show progress bar and indices
		function showProgressAndIndices() {
			gsap.to([progressBarContainer, indicesContainer], {
				opacity: 1,
				duration: 0.5,
				ease: "power2.Out",
			});
			isProgressBarVisible = true;
			animateIndexOpacity(-1);
		}

		// Hide progress bar and indices
		function hideProgressAndIndices() {
			gsap.to([progressBarContainer, indicesContainer], {
				opacity: 0,
				duration: 0.5,
				ease: "power2.Out",
			});
			isProgressBarVisible = false;
			animateIndexOpacity(-1);
		}

		// Main ScrollTrigger for pinning and animating the card stack
		ScrollTrigger.create({
			trigger: pinnedSection,
			start: "top top",
			end: `+=${pinnedHeight}`,
			pin: true,
			pinSpacing: true,
			onLeave: hideProgressAndIndices, // Hide progress when leaving section
			onEnterBack: showProgressAndIndices, // Show progress when re-entering
			onUpdate: (self) => {
				const progress = self.progress * (cardCount + 1);
				const currentCard = Math.floor(progress);

				// Animate stack-sticky header opacity as user scrolls
				if (progress <= 1) {
					gsap.to(stickyHeader, {
						opacity: 1 - progress,
						duration: 0.1,
						ease: "none",
					});
				} else {
					gsap.set(stickyHeader, { opacity: 0 });
				}

				// Show/hide progress bar and indices based on scroll position
				if (progress > 1 && !isProgressBarVisible) showProgressAndIndices();
				else if (progress <= 1 && isProgressBarVisible)
					hideProgressAndIndices();

				// Calculate progress bar height and color
				let progressHeight = 0;
				let colorIndex = -1;
				if (progress > 1) {
					progressHeight = ((progress - 1) / cardCount) * 100;
					colorIndex = Math.min(Math.floor(progress - 1), cardCount - 1);
				}

				// Animate progress bar
				gsap.to(progressBar, {
					height: `${progressHeight}%`,
					backgroundColor: progressColors[colorIndex],
					ease: "power1.Out",
					duration: 0.3,
				});

				// Animate active index opacity
				if (isProgressBarVisible) animateIndexOpacity(colorIndex);

				// Animate card positions and rotations based on scroll progress
				cards.forEach((card, index) => {
					if (index < currentCard) {
						// Cards that have been passed
						gsap.set(card, {
							rotation: endRotations[index],
							top: "50%",
						});
					} else if (index === currentCard) {
						// Card currently in view, interpolate position/rotation
						const cardProgress = progress - currentCard;
						const newTop = gsap.utils.interpolate(150, 50, cardProgress);
						const newRotation = gsap.utils.interpolate(
							startRotations[index],
							endRotations[index],
							cardProgress
						);
						gsap.set(card, {
							rotation: newRotation,
							top: `${newTop}%`,
						});
					} else {
						// Cards yet to come
						gsap.set(card, {
							rotation: startRotations[index],
							top: "150%",
						});
					}
				});
			},
		});
	});
	return (
		<div className="card-stack-container">
			<section className="stack-pinned">
				<div className="stack-sticky-header">
					<h1>Roadmap</h1>
				</div>

				<div className="stack-progress-bar">
					<div className="stack-progress"></div>
				</div>

				<div className="stack-indices">
					{[
						"bulb-sharp",
						"rocket-sharp",
						"extension-puzzle-sharp",
						"trending-up-sharp",
					].map((icon, i) => (
						<div key={i} className="stack-index" id={`stack-index-${i + 1}`}>
							<p>
								<ion-icon name={icon}></ion-icon>
							</p>
							<p>{["May 15th", "July 1st", "August 20th", "October 5th"][i]}</p>
							<p>
								{
									[
										"Beta Launch",
										"Public Release",
										"API Integration",
										"Pro Features",
									][i]
								}
							</p>
						</div>
					))}
				</div>

				{["Phase #01", "Phase #02", "Phase #03", "Phase #04"].map(
					(phase, i) => (
						<div key={i} className="stack-card" id={`stack-card-${i + 1}`}>
							<div className="stack-card-phase">
								<p>{phase}</p>
							</div>
							<div className="stack-card-title">
								<p>
									From{" "}
									{["May 15th", "July 1st", "August 20th", "October 5th"][i]}
								</p>
								<h1>
									{["Beta", "Public", "API", "Pro"][i]}{" "}
									<span>
										{["Launch", "Release", "Integration", "Features"][i]}
									</span>
								</h1>
							</div>
						</div>
					)
				)}
			</section>
			<section className="stack-footer">
				<h1>Your next section goes here</h1>
			</section>
		</div>
	);
};

export default CardStack;
