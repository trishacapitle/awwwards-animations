import './css/Hero.css'
import gsap  from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

const Hero = () => {
  useGSAP(() => {
		const subHeaders = [
			"complete list of gsap reusable animations.",
			"explore our latest projects and case studies.",
			"get in touch with me for collaborations or inquiries.",
		];
		const items = document.querySelectorAll("#item-1, #item-2, #item-3");
		const placeholder = document.querySelector(".placeholder");
		const subheader = document.querySelector("#subheader");

		function changeColor() {
			gsap.to(".container", { backgroundColor: "#000", duration: 0.5 });
			gsap.to(".placeholder, p", { color: "#fff", duration: 0.5 });
			gsap.to("nav", {
				color: "#929292",
			});
		}

		function revertColor() {
			gsap.to(".container", { backgroundColor: "#e3e3e3", duration: 0.5 });
			gsap.to(".placeholder, nav, p", { color: "#000", duration: 0.5 });
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
			const defaultSubheaderText = "FrontEnd Developer";
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
		<div className="container">
			<nav>
				<div id="item-1">Project Catalog</div>
				<div id="item-2">Case Studies</div>
				<div id="item-3">Contact</div>
			</nav>
			<div className="header">
				<div className="placeholder"> ASHDEV</div>
				<p id="subheader"></p>
			</div>
		</div>
	);
}

export default Hero