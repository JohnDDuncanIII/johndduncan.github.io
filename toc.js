// https://stackoverflow.com/a/37033774/6201291
const expandDetailsOnHash = (event) => {
	const hash = (
		event.target.tagName === "A"
			? event.target.hash.substring(1)
			: window.location.hash.substring(1)
	)

	if (hash) {
		const target = document.getElementById(hash)
		const details = target.closest("details")

		if (document.getElementById("expand").textContent !== "collapse all") {
			document.querySelectorAll("details").forEach(detail => {
				// close all of the other details elements
				if (detail.id !== hash) {
					detail.open = false
				}
			})

			if (!details.open) {
				details.open = !details.open
			}

			// uncomment if you want to close the related details element
			// when it's already open and you click it in the Table of Contents
			// if (!details.open) {
			//	// clear URI hash
			//	history.replaceState(null, null, " ")
			//	event.preventDefault()
			// }
		} else {
			if (!details.open) {
				details.open = !details.open
			}
		}
	}
}
// run on initial page load
document.addEventListener("DOMContentLoaded", expandDetailsOnHash)
// also run when the hash changes
window.addEventListener("hashchange", expandDetailsOnHash)

// run when we click an anchor inside of the Table of Contents
const toc = document.getElementById("toc")
if (toc) {
	Array.from(toc.children).forEach(child => {
		child.addEventListener("click", expandDetailsOnHash)
	})
}

const expandClick = () => {
	if (document.getElementById("expand").textContent === "expand all") {
		document.querySelectorAll("details").forEach(details => details.open = "open")
		document.getElementById("expand").textContent = "collapse all"
	} else {
		document.querySelectorAll("details").forEach(details => details.open = "")
		document.getElementById("expand").textContent = "expand all"
		history.replaceState(null, null, " ")
	}
}
document.getElementById("expand").addEventListener("click", expandClick)
