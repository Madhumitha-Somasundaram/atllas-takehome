# Claude Code Writeup

## What I delegated vs. what I wrote myself

I used Claude Code mainly to make UI changes and test the flows. I delegated tasks like running the app, checking the backend routes, added zod validation, checked duplicate email validation, fixing lint issues,warnings and improving UI. Claude helped with frontend features like converted the table into cards for the mobile view, added sorting, implemented multi select delete functionality, updated the three dot action menu and theme based icons .

I wrote the main logics, testing, debugging and verifying each functionality. I validated API responses, created search,create,edit,delete flows and tested it, verified layouts for both desktop and mobile view and fixed issues that remained after Claude's generated changes.

## Where Claude led me wrong

Claude sometimes generated solutions that looked correct but were not fully working. Some UI changes needed multiple corrections for example mobile card alignment, spacing and when I wanted sorting in a single dropdown it had given 2 sorting dropdowns in the mobile view and while integrating the Google Places API for the address input field, it also gave an approach that did not work properly with the UI,it only captured the address predictions selected from Google instead of handling the actual text the user typed and also started using a deprecated Google Places API instead of the new one. Some generated code also introduced lint warnings though the functionality appeared to work.

I caught these problems by running the app frequently, manually testing different flows, checking responsive behavior on mobile view, and running lint/type checks. I also rechecked backend logic several times instead of assuming the generated code was correct.

I found these issues by running the app frequently,debuggint it, testing all the features manually and checking lint and type errors before finishing the project.