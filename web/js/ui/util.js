// This file contains utility functions related to UI manipulation. Some code
// may be specific to areas of the UI and others are more utility based. As
// this file grows specific UI area code should be migrated to its own file.

// toggle_cw changes the active stage of the Content Warning for a post. It is
// relative to the element that is pressed.
function toggle_cw(el) {
	el.classList.toggle("active");
    const isOn = el.classList.contains("active");
	const input = el.parentElement.querySelector("input.cw");
	input.classList.toggle("hide", !isOn);
}

// toggle_gnav hides or shows the global navigation's additional buttons based
// on its opened state.
function toggle_gnav(el) {
	el.parentElement.classList.toggle("open");
}
