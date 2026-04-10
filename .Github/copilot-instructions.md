## JavaScript Rules

- Use clear and meaningful English names for functions and variables.
- Use let instead of const in this project.
- Never use var.
- Use template literals instead of string concatenation.
- Never use inline styles.
- Use semantic HTML tags.
- Use flexbox instead of grid.
- Prefer innerHTML-based rendering for UI updates.
- Use async/await instead of .then().
- Keep functions small and focused on one responsibility.
- Keep regular functions at a maximum of 14 lines (HTML template blocks excluded).
- Start function and variable names with a lowercase letter.
- Keep 1 or 2 empty lines between functions.
- Keep files below 400 LOC when possible.
- Document functions with JSDoc in English: https://jsdoc.app/about-getting-started.html

## Functionality

- All links and buttons must work.
- There must be no console errors.
- Do not leave console.log statements in final code.
- Status bars must update correctly.
- Collision logic must be accurate (enemies must not die when the player only jumps beside them).
- The character must be unable to move after death.
- After game over, restarting must be possible without reloading the page.

## Design

- Build the design creatively while staying consistent with the project style.
- Use a suitable local font.
- A favicon must be included.
- All buttons must use cursor: pointer.
- Avoid visible gaps between background images.
- Keep animation timing balanced (not too fast, not too slow).

## Responsiveness

- The game must work fully on desktop devices.
- On mobile devices, gameplay is landscape-only.
- In portrait mode, show a clear hint such as: Turn your device to play.
- Mobile touch buttons must only be visible on tablet and phone breakpoints.
- Touch buttons must work correctly on tablets.
- No scrollbar should appear on small resolutions.

## Technical Implementation

- File names must be descriptive, meaningful, and consistent.
- The main page file must be named index.html.
- Keep JavaScript classes in the separate classes folder.
- Keep the project structure clean with separate templates and img folders.
- Use the existing core file names consistently: index.html, game.js, style.css.
- Do not generate all static HTML through JavaScript.
- If needed, split HTML output into clearly separated functions.

## Gameplay and Audio Quality

- Enemy count must stay balanced.
- Enemy strength must stay balanced.
- Sounds must start and stop cleanly.
- The mute button must mute all sounds.
- Audio volumes must remain moderate.

## Legal

- Do not use real personal data in the imprint.
