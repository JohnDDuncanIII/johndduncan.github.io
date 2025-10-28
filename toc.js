// handle clicking the ul.toc li details triangles to open/close
document.querySelectorAll("#toc li:has(details)").forEach((item) => {
	item.addEventListener("click", (event) => {
		if (event.target.tagName === "A") return

		const details =
			event.target.tagName === "SUMMARY"
				? event.target.closest("details")
				: event.target.getElementsByTagName("details")[0]

		details.open = !details.open
		event.preventDefault()
		event.stopPropagation()
	})
})

// if we re-click on an achor that has already been navigated to,
// manually invoke logic to reposition anchor scroll to the correct position in relation to sticky details summary element
document.querySelectorAll("#toc li a").forEach((item) => {
	item.addEventListener("click", (event) => {
		if (event.target.hash === window.location.hash) {
			expandDetailsOnHash(event)
		}
	})
})

// https://stackoverflow.com/a/37033774/6201291
function expandDetailsOnHash(event) {
	const hash =
		event.target.tagName === "A"
			? event.target.hash.substring(1)
			: window.location.hash.substring(1)

	if (!hash) return

	const target = document.getElementById(hash)

	const details = target.closest("details")
	const isExpandAll = document.getElementById("toggle").alt !== "collapse all"

	if (isExpandAll) {
		document.querySelectorAll("details[id]").forEach((detail) => {
			// close all of the other details elements
			if (detail.id !== hash) {
				detail.open = false
			}
		})
	}

	if (!details.open) {
		details.open = true

		// wait for the browser to complete the details animation/expansion
		requestAnimationFrame(() => {
			// additional small delay to ensure full expansion
			setTimeout(() => {
				window.scrollTo({
					top:
						target.tagName === "DETAILS" && target.id
							? // scroll-padding-top css doesn't work because
								// the top level <details> should not be padded on anchor scroll
								// add 20px from .summary margin
								target.offsetTop + 20
							: // 50px sticky summary + 20px of extra padding to make the scroll look natural
								target.offsetTop - 50,
				})
			}, 250)
		})
	}
}

function expandTocOnHash(event) {
	const hash =
		event.target.tagName === "A"
			? event.target.hash.substring(1)
			: window.location.hash.substring(1)

	if (!hash) return

	const anchor = document.querySelector(`a[href='#${hash}']`)
	const anchorDetails = anchor.closest("details")
	const isExpandAll = document.getElementById("toggle").alt !== "collapse all"

	if (isExpandAll) {
		document.querySelectorAll("#toc details").forEach((details) => {
			details.open = false
		})
	}

	// some list items in the toc do not have sub-lists
	if (anchorDetails) {
		let parentDetails = anchorDetails
		while (parentDetails) {
			parentDetails.open = true
			parentDetails = parentDetails.parentElement?.closest("details")
		}

		anchorDetails.querySelectorAll("details").forEach((details) => {
			details.open = false
		})
	}
}

function debounce(func, delay = 150) {
	let timeoutId
	return (...args) => {
		clearTimeout(timeoutId)
		timeoutId = setTimeout(() => func(...args), delay)
	}
}

function getElementAndChildIds(parentElement) {
	return [
		parentElement.id,
		...Array.from(parentElement.querySelectorAll("*"))
			.map((child) => child.id)
			.filter(Boolean),
	]
}

window.addEventListener("hashchange", expandDetailsOnHash)
window.addEventListener("hashchange", expandTocOnHash)

document.addEventListener("DOMContentLoaded", () => {
	expandDetailsOnHash({ target: document.body })
	expandTocOnHash({ target: document.body })

	const body = document.body
	const toggleImage = document.getElementById("toggle")

	// body.dataset.originalMargin = window.getComputedStyle(body).marginLeft;
	toggleImage.addEventListener("click", () => {
		// clears URI hash
		history.replaceState(null, null, " ")
		const isExpanding = toggleImage.alt === "expand all"

		document.querySelectorAll("details").forEach((details) => {
			details.open = isExpanding
		})

		if (isExpanding) {
			toggleImage.alt = "collapse all"
			toggleImage.title = "collapse all"
			toggleImage.src = "css/img/toggle1.xbm.gif"
		} else {
			toggleImage.alt = "expand all"
			toggleImage.title = "expand all"
			toggleImage.src = "css/img/toggle3.xbm.gif"
		}

		toggleImage.prevSrc = toggleImage.src
	})

	toggleImage.addEventListener("mouseenter", (event) => {
		toggleImage.prevSrc = toggleImage.src
		if (
			event.pageX !== Number(body.dataset.pageX) &&
			event.pageY !== Number(body.dataset.pageY)
		) {
			toggleImage.src = "css/img/toggle2.xbm.gif"
		}
		event.preventDefault()
	})

	toggleImage.addEventListener("mouseleave", (event) => {
		toggleImage.src = toggleImage.prevSrc
		event.preventDefault()
	})

	toggleImage.addEventListener("mousedown", (event) => {
		toggleImage.src = toggleImage.src.replace(/(\.xbm\.gif)$/, "-pressed$1")
		event.preventDefault()
	})

	toggleImage.addEventListener("mouseup", (event) => {
		body.dataset.pageX = event.pageX
		body.dataset.pageY = event.pageY
		toggleImage.src = toggleImage.prevSrc
		event.preventDefault()
	})

	// addEventListener(
	//	"resize",
	//	debounce(() => {
	//		body.style.marginLeft = "auto";
	//		body.dataset.originalMargin = window.getComputedStyle(body).marginLeft;
	//	}),
	// );

	document.querySelectorAll("details").forEach((details) => {
		details.addEventListener("toggle", function (event) {
			const hash =
				event.target.tagName === "A"
					? event.target.hash.substring(1)
					: window.location.hash.substring(1)

			const allIds = getElementAndChildIds(event.target)

			if (hash && allIds.includes(hash) && !this.open) {
				// clears URI hash
				history.replaceState(null, null, " ")

				const anchor = document.querySelector(`a[href='#${hash}']`)
				let parentDetails = anchor.closest("details")

				while (parentDetails) {
					parentDetails.open = false
					parentDetails =
						parentDetails.parentElement?.closest("details")
				}

				event.preventDefault()
			}

			// if (this.open) {
			//	body.style.marginLeft = body.dataset.originalMargin;
			// } else {
			//	const anyDetailsOpen = Array.from(
			//		document.querySelectorAll("details"),
			//	).some((d) => d.open);

			//	if (!anyDetailsOpen) {
			//		body.style.marginLeft = "auto";
			//		body.dataset.originalMargin =
			//			window.getComputedStyle(body).marginLeft;
			//	}
			// }

			const anyOpen = Array.from(
				document.querySelectorAll("details"),
			).some((d) => d.open)
			if (!anyOpen) {
				document.getElementById("toggle").alt = "expand all"
			}
		})
	})
})
