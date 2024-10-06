const toc = document.getElementById("toc");

if (toc) {
    const children = toc.children
    
    Array.from(children).forEach(child => {
        child.addEventListener("click", hashChange)
    })
}

function hashChange(event) {
    const targetId = event.target.hash.substring(1)
    const details = document.getElementById(targetId).closest("details")
    
    document.querySelectorAll("details").forEach(detail => {
        if (detail.id !== targetId) {
            detail.open = false
        }
    })
    
    details.open = !details.open
    if (!details.open) {
		// clear URI hash
		history.replaceState(null, null, " ")
		event.preventDefault()
    }
}
// hashChange()
// window.addEventListener("hashchange", hashChange)
// openTarget()
