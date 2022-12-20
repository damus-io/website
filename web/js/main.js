// This is our main entry.
// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event

addEventListener('DOMContentLoaded', () => {
    damus_web_init()

    bind_buttons(document.body)
})

function bind_buttons(el) {
    const actionButtons = el.querySelectorAll('[data-action]')
    actionButtons.forEach((button) => {
        button.addEventListener('click', (ev) => {
            const action = button.getAttribute('data-action')

            switch (action) {
                case 'toggle_gnav':
                    toggle_gnav(button)
                    break
                case 'switch_view':
                    switch_view(button.getAttribute('data-target'))
                    break
                case 'delete_post':
                    delete_post(button.getAttribute('data-target'))
                    break
                case 'reply_to':
                    reply_to(button.getAttribute('data-target'))
                    break
                case 'expand_thread':
                    expand_thread(button.getAttribute('data-target'))
                    break
                case 'delete_post_confirm':
                    delete_post_confirm(button.getAttribute('data-target'))
                    break
                case 'show_profile':
                    show_profile(button.getAttribute('data-target'))
                    break
                case 'press_logout':
                    press_logout()
                    break
                case 'toggle_cw':
                    toggle_cw(button)
                    break
                case 'send_post':
                    send_post(button)
                    break
                case 'click_copy_pk':
                    click_copy_pk(button)
                    break
                case 'click_toggle_follow_user':
                    click_toggle_follow_user(button)
                    break
                case 'close_reply':
                    close_reply()
                    break
                case 'do_send_reply':
                    do_send_reply()
                    break
                case 'send_reply':
                    const emoji = button.getAttribute('data-emoji')
                    const reacting_to = button.getAttribute('data-reacting-to')
                    send_reply(emoji, reacting_to)
                    break
                case 'click_event':
                    // "click_event" is not fully implemented
                    // it is used to open a thread
                    // could be renamed to "show_thread"
                    click_event(button)
                    break
            }
        })
    })

    const onInputElements = el.querySelectorAll('[data-on-input]')
    onInputElements.forEach((el) => {
        el.addEventListener('input', (ev) => {
            const action = el.getAttribute('data-on-input')

            switch (action) {
                case 'post_input_changed':
                    post_input_changed(el)
                    break
            }
        })
    })
}

