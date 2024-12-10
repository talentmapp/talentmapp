## Changelog

### Commit 108
**Changes:**
- Changed file structure to now include a cleaner solution for displaying search results and profiles.
- Added *SearchBar.jsx* and *SearchResults.jsx* to `/components`, simplifying the `/search` screen.
- Added a **Similar Profiles** section to the **Profile Details** screen, and a new API call `/api/similarProfiles`.
- Made the **Profile Details** screen match with the MVP UI design for the most part (small tweaks will be made).
- Button to LinkedIn profile works.
- Hitting enter on the Search Bar triggers search (previously only the search button worked).
- The search bar on the Landing screen works, and clicking on the scrolling prompt options also works.

**In Progress:**
- The pronouns feature is currently hardcoded; need to add this to the database schema.
- Location filter needs to be implemented.
- View Analysis needs to be implemented.
- Infinite Scroll has to be added to the Search screen

