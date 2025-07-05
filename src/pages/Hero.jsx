import "./css/Hero.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Hero = () => {
	gsap.registerPlugin(useGSAP);

	useGSAP(() => {
		const subHeaders = [
			"complete list of recreated reusable awwwards web animations using gsap.",
			"in depth analysis of animations logic and its reusability.",
			"get in touch with me for collaborations or inquiries.",
		];
		const items = document.querySelectorAll("#hero-item-1, #hero-item-2, #hero-item-3");
		const placeholder = document.querySelector(".hero-placeholder");
		const subheader = document.querySelector("#hero-subheader");

		function changeColor() {
			gsap.to(".hero-container", { backgroundColor: "#000", duration: 0.5 });
			gsap.to(".hero-placeholder, .hero-header p", { color: "#fff", duration: 0.5 });
			gsap.to(".hero-nav", {
				color: "#929292",
			});
		}

		function revertColor() {
			gsap.to(".hero-container", { backgroundColor: "#e3e3e3", duration: 0.5 });
			gsap.to(".hero-placeholder, .hero-nav, .hero-header p", { color: "#000", duration: 0.5 });
		}

		items.forEach((item) => {
			item.addEventListener("mouseover", changeColor);
			item.addEventListener("mouseout", revertColor);
		});

		function animateScale(element, scaleValue) {
			gsap.fromTo(
				element,
				{
					scale: 1,
				},
				{
					scale: scaleValue,
					duration: 2,
					ease: "power1.inOut",
				}
			);
		}

		function wrapLetters(text) {
			placeholder.innerHTML = "";
			[...text].forEach((letter) => {
				const span = document.createElement("span");
				span.style.filter = "blur(8px)";
				span.textContent = letter;
				placeholder.appendChild(span);
			});
		}

		function animateBlurEffect() {
			const letters = placeholder.children;
			let index = 0;

			function clearNextLetter() {
				if (index < letters.length) {
					gsap.to(letters[index], {
						filter: "blur(0px)",
						duration: 0.5,
					});
					index++;
					if (index < letters.length) {
						setTimeout(clearNextLetter, 100);
					}
				}
			}
			setTimeout(clearNextLetter, 0);
		}

		function shuffleLetters(finalText) {
			wrapLetters("");
			wrapLetters(finalText.replace(/./g, " "));

			let textArray = finalText.split("");
			let shufflingCounter = 0;
			let intervalHandles = [];

			function shuffle(index) {
				if (shufflingCounter < 30) {
					textArray[index] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[
						Math.floor(Math.random() * 26)
					];
					placeholder.children[index].textContent = textArray[index];
				} else {
					placeholder.children[index].textContent = finalText.charAt(index);
					clearInterval(intervalHandles[index]);
				}
			}

			for (let i = 0; i < finalText.length; i++) {
				intervalHandles[i] = setInterval(shuffle, 80, i);
			}

			setTimeout(() => {
				shufflingCounter = 30;
				for (let i = 0; i < finalText.length; i++) {
					placeholder.children[i].textContent = finalText.charAt(i);
					clearInterval(intervalHandles[i]);
				}
				animateBlurEffect();
			}, 1000);
		}

		function updatePlaceholderText(event) {
			const newText = event.target.textContent.toUpperCase();
			const itemIndex = Array.from(items).indexOf(event.target);
			const newSubheaderText = subHeaders[itemIndex].toUpperCase();

			subheader.textContent = newSubheaderText;
			animateScale(placeholder, 1.25);
			shuffleLetters(newText);
		}

		function resetPlaceholderText() {
			const defaultText = "ASHDEV";
			const defaultSubheaderText = "AWWWARDS WEB ANIMATIONS";
			subheader.textContent = defaultSubheaderText;
			animateScale(placeholder, 1.25);
			shuffleLetters(defaultText);
		}

		items.forEach((item) => {
			item.addEventListener("mouseover", updatePlaceholderText);
			item.addEventListener("mouseout", resetPlaceholderText);
		});
	});

	return (
		<div className="hero-container">
			<nav className="hero-nav">
				<div id="hero-item-1">Catalog</div>
				<div id="hero-item-2">Case Studies</div>
				<div id="hero-item-3">Contact</div>
			</nav>
			<div className="hero-header">
				<div className="hero-placeholder">ASHDEV</div>
				<p id="hero-subheader"></p>
			</div>
		</div>
	);
};

export default Hero;
