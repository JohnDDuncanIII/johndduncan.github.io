const toc = document.getElementById("toc")

if (toc) {
    const children = toc.children
    
    Array.from(children).forEach(child => {
        child.addEventListener("click", hashChange)
    })
}

function hashChange(event) {
    const targetId = event.target.hash.substring(1)
    const details = document.getElementById(targetId).closest("details")
    
    if (document.getElementById("expand").textContent !== "collapse all") {
	    document.querySelectorAll("details").forEach(detail => {
	        if (detail.id !== targetId) {
	            detail.open = false
	        }
	    })

	    if (!details.open) {
		    details.open = !details.open
	    }

	    if (!details.open) {
			// clear URI hash
			history.replaceState(null, null, " ")
			event.preventDefault()
	    }
    } else {
		if (!details.open) {
		    details.open = !details.open
		}
    }
}

document.getElementById("expand").addEventListener("click", function() {
	if (document.getElementById("expand").textContent === "expand all") {
		document.querySelectorAll("details").forEach(details => details.open = "open")
		document.getElementById("expand").textContent = "collapse all"
	} else {
		document.querySelectorAll("details").forEach(details => details.open = "")
		document.getElementById("expand").textContent = "expand all"
		history.replaceState(null, null, " ")
	}
})
