/* This file contains utility functions related to UI manipulation. Some code
 * may be specific to areas of the UI and others are more utility based. As
 * this file grows specific UI area code should be migrated to its own file.
 */

/* toggle_cw changes the active stage of the Content Warning for a post. It is
 * relative to the element that is pressed.
 */
function toggle_cw(el) {
	el.classList.toggle("active");
    const isOn = el.classList.contains("active");
	const input = el.parentElement.querySelector("input.cw");
	input.classList.toggle("hide", !isOn);
}

/* toggle_gnav hides or shows the global navigation's additional buttons based
 * on its opened state.
 */
function toggle_gnav(el) {
	el.parentElement.classList.toggle("open");
}

/* post_input_changed checks the content of the textarea and updates the size
 * of it's element. Additionally I will toggle the enabled state of the sending
 * button.
 */
function post_input_changed(el) {
	el.style.height = `0px`;
	el.style.height = `${el.scrollHeight}px`;
	let btn = el.parentElement.querySelector("button[role=send]");
	if (btn) btn.disabled = el.value === "";
}

/* init_message_textareas finds all message textareas and updates their initial
 * height based on their content (0). This is so there is no jaring affect when
 * the page loads.
 */
function init_message_textareas() {
	const els = document.querySelectorAll(".post-input");
	for (const el of els) {
		post_input_changed(el);
	}
}
