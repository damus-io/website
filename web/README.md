# Damus Web 

Here lies the code for the Damus web app, a client for the Nostr protocol. The
goal of this client is to be a better version of Twitter, but not to reproduce
all of it's functionality.

## Contribution Guide

There are rules to contributing to this client. Please ensure you read them 
before making changes and supplying patch notes.

 - No transpilers. All source code should work out of the box.
 - Keep source code organised. Refer to the folder structure. If you have a
   question, ask it.
 - Do not include your personal tools in the source code. Use your own scripts
 - outside of the project. This does not include build tools such as Make.
 - Use tabs.
 - Write methods in snake_case.
 - Do not include binary files.
 - No NPM (and kin) environments. If you need a file from an external resource
   mark the location in the "sources" file and add it to the repo.
 - No frameworks. Learn the browser tools and write good code. 
 - No experimental browser APIs.
 - Do not write animations in JavaScript, CSS only. Keep them short and snappy.
   Animations should not be a forefront, but an enjoyable addition.
 - All new & modified code should be properly documented.
 - Source code should be readable in the browser.

These rules are subject to discussion.

## Style Guide

TODO Write about the style guide.

## Terminology

 * Sign Out - Not "log out", "logout", "log off", etc.
 * Sign In  - Not "login", "log in", "signin", "sign-in", etc.

