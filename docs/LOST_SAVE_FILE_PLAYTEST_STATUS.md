# THE LOST SAVE FILE.exe — Playtest Status

Branch: `rpg-experiment` only. Route: `/lost-save-file`.

## Implemented in foundation milestone 006
- Six explorable existing regions and 18 existing NPCs retained.
- Existing movement, coins, character creator and six provisional endings retained.
- Browser-local autosave and resume for active timeline and appearance.
- Global ending unlocks retained after New Game+.
- Per-region recovered-log tracking (six slots, placeholder log content).
- Narrative notebook with Notes, Friends, Lost Logs and Endings tabs.
- Checkpoint recorded on region transitions; manual restore from notebook.
- Explicit confirmation before selecting a final ending.
- Link from ending screen to existing CLAR_OS `/birthday` page.

## Still planned — not yet implemented
- Six detailed chapter quests, true seventh-record story reveal and puzzle sequences.
- Meaningful choice-based ending requirements and alternate chapter timelines.
- Undertale-inspired encounter engine and dodge arena.
- Environmental Watcher AI/chases, hiding and capture recovery.
- Richer world art for all regions, building interiors and map fast travel.
- Dynamic 18-friend quests, portraits, group scenes and ECHOES.exe archive.
- Final gathering, cake, group photo, and full interactive recovered desktop.
- Soundtrack playback, adaptive audio and user volume controls.
- Export/import save, robust migration and accessibility settings.

## Important
The existing endings are **provisional placeholders** and currently selectable from the final terminal, subject to existing basic checks. This is **not yet** the promised complete story prototype. This milestone establishes a safer foundation for further development. Production and `master` are unchanged by these branch-only commits.

## iPad testing
1. Open the preview deployment's `/lost-save-file` route.
2. Start, move, meet a friend, inspect an object, open Journal.
3. Reload the page; confirm the player resumes.
4. Travel to the next region; test Restore Checkpoint.
5. Reach the final terminal; confirm ending warning and CLAR_OS link.
6. Report unexpected behaviour; do not delete Safari website data during the test.
