import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import './css/TileFlip.css'

const TileFlip = () => {
	const ROWS = 6;
	const COLS = 6;
	const COOLDOWN = 1000;
	const [isFlipped, setIsFlipped] = useState(false);
	const isFlippedRef = useRef(isFlipped);
	const container = useRef(null);

	// keep the ref in sync with React state
	useEffect(() => {
		isFlippedRef.current = isFlipped;
	}, [isFlipped]);

	useGSAP(
		() => {
			// Get all tile elements and the flip button
			const tiles = Array.from(container.current.querySelectorAll(".tile"));
			const flipButton = container.current.querySelector("#flipButton");

			// Attach mouseenter event to each tile for flip animation
			tiles.forEach((tile, index) => {
				let lastEnter = 0;
				const onEnter = () => {
					const now = Date.now();
					// Prevent rapid re-triggering (cooldown)
					if (now - lastEnter < COOLDOWN) return;
					lastEnter = now;

					// Calculate column index and tilt for 3D effect
					const colId = index % COLS;
					const tiltMap = { 0: -40, 1: -20, 2: -10, 4: 20, 5: 40 };
					const tiltY = tiltMap[colId] ?? 10;

					// Read the current flipped state from the ref
					const flipped = isFlippedRef.current;

					// Animate the tile flip with GSAP timeline
					gsap
						.timeline()
						.set(tile, { rotateX: flipped ? 180 : 0, rotateY: 0 })
						.to(tile, {
							rotateX: flipped ? 450 : 270,
							rotateY: tiltY,
							duration: 0.5,
							ease: "power2.out",
						})
						.to(
							tile,
							{
								rotateX: flipped ? 540 : 360,
								rotateY: 0,
								duration: 0.5,
								ease: "power2.out",
							},
							"-=0.25"
						);
				};

				// Add event listener for mouseenter
				tile.addEventListener("mouseenter", onEnter);

				// Cleanup event listener on unmount
				return () => tile.removeEventListener("mouseenter", onEnter);
			});

			// Handler for flipping all tiles at once
			const onFlipAll = () => {
				const newFlipped = !isFlippedRef.current;
				setIsFlipped(newFlipped);
				// Update the ref immediately for correct hover behavior
				isFlippedRef.current = newFlipped;

				// Animate all tiles flipping with staggered timing
				gsap.to(tiles, {
					rotateX: newFlipped ? 180 : 0,
					duration: 1,
					stagger: { amount: 0.5, from: "random" },
					ease: "power2.inOut",
				});
			};

			// Add event listener for the flip button
			flipButton?.addEventListener("click", onFlipAll);
			// Cleanup event listener on unmount
			return () => flipButton?.removeEventListener("click", onFlipAll);
		},
		{ scope: container }
	);

	return (
		<div ref={container} className="tile-flip-wrapper">
			<nav className="tile-flip-nav">
				<a href="#">
					Ash<span>Dev</span>
				</a>
				<button id="flipButton">Flip Tiles</button>
			</nav>

			<section className="tile-board">
				{Array.from({ length: ROWS }).map((_, rowId) => (
					<div className="tile-row" key={rowId}>
						{Array.from({ length: COLS }).map((_, colId) => {
							const bgPos = `${colId * 20}% ${rowId * 20}%`;
							return (
								<div key={colId} className="tile">
									<div
										className="tile-face tile-front"
										style={{ backgroundPosition: bgPos }}
									/>
									<div
										className="tile-face tile-back"
										style={{ backgroundPosition: bgPos }}
									/>
								</div>
							);
						})}
					</div>
				))}
			</section>
		</div>
	);
};

export default TileFlip;
