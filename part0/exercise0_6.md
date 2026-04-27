# Exercise 0.6: New note in Single page app diagram

```mermaid
sequenceDiagram
    participant browser
    participant server

    Note right of browser: User types a note and clicks Save

    Note right of browser: JavaScript catches the click with e.preventDefault()
    Note right of browser: Adds note to list immediately with notes.push(note)
    Note right of browser: Redraws the list with redrawNotes()

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    Note left of server: Server saves the new note
    server-->>browser: 201 Created
    deactivate server

    Note right of browser: Browser stays on the same page - no redirect
```