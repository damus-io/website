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

// update_notification_markers will find all markers and hide or show them
// based on the passed in state of 'active'.
function update_notification_markers(active) {
	let els = document.querySelectorAll(".new-notifications")
	for (const el of els) {
		el.classList.toggle("hide", !active)
	}
}

/* show_profile updates the current view to the profile display and updates the
 * information to the relevant profile based on the public key passed.
 * TODO handle async waiting for relay not yet connected
 */
function show_profile(pk) {
	switch_view("profile");
	const profile = DAMUS.profiles[pk];
	const el = find_node("#profile-view");
	// TODO show loading indicator then render
	
	find_node("[role='profile-image']", el).src = get_picture(pk, profile); 
	find_nodes("[role='profile-name']", el).forEach(el => {
		el.innerText = render_name_plain(profile);
	});
	
	const el_nip5 = find_node("[role='profile-nip5']", el)
	el_nip5.innerText = profile.nip05;
	el_nip5.classList.toggle("hide", !profile.nip05);
	
	const el_desc = find_node("[role='profile-desc']", el)
	el_desc.innerHTML = newlines_to_br(profile.about);
	el_desc.classList.toggle("hide", !profile.about);
	
	find_node("button[role='copy-pk']", el).dataset.pk = pk;
	
	const btn_follow = find_node("button[role='follow-user']", el)
	btn_follow.dataset.pk = pk;
	// TODO check follow status
	btn_follow.innerText = 1 == 1 ? "Follow" : "Unfollow";
	btn_follow.classList.toggle("hide", pk == DAMUS.pubkey);
}

/* newlines_to_br takes a string and converts all newlines to HTML 'br' tags.
 */
function newlines_to_br(str="") {
	return str.split("\n").reduce((acc, part, index) => {
		return acc + part + "<br/>";
	}, "");
}

/* click_copy_pk writes the element's dataset.pk field to the users OS'
 * clipboard. No we don't use fallback APIs, use a recent browser.
 */
function click_copy_pk(el) {
	// TODO show toast
	navigator.clipboard.writeText(el.dataset.pk);
}

/* click_follow_user sends the event to the relay to subscribe the active user
 * to the target public key of the element's dataset.pk field.
 */
function click_toggle_follow_user(el) {
	alert("sorry not implemented");
}

/* click_event opens the thread view from the element's specified element id
 * "dataset.eid".
 */
function click_event(el) {
	console.info(`thread to open: ${el.dataset.eid}`);
	switch_view("thread");
}
