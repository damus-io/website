/* find_node is a short name for document.querySelector, it also takes in a 
 * parent element to search on.
 */
function find_node(selector, parentEl) {
	const el = parentEl ? parentEl : document;
	return el.querySelector(selector)
}

/* find_nodes is a short name for document.querySelectorAll, it also takes in a
 * parent element to search on.
 */
function find_nodes(selector, parentEl) {
	const el = parentEl ? parentEl : document;
	return el.querySelectorAll(selector)
}
