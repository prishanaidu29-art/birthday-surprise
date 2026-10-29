# CLAR.exe — Three-chapter connected RPG (experimental)

Branch: `rpg-experiment`. **Production/master unchanged.**

## Play order
1. `/lost-save-file/chapter-one` — THE GLITCHED TOWN. Talk to Jack, Jay, Sherlock, Will and House. Investigate the frozen clock, collect the letter and key, read the mirror, solve the exit riddle. The 4-second WATCH OUT CLAR glitch now leads to Chapter Two.
2. `/lost-save-file/chapter-two` — PLATFORM ZERO. Speak with BBC Dr John Watson, Kiyoomi Sakusa and Rintarou Suna. Restore medical, signal and photograph clues (any order). Answer the departure question, experience the glitch, board the last train.
3. `/lost-save-file/chapter-three` — THE UNWRITTEN ROOM. Meet Hannibal Lecter, Nightwing and Azusa. Recover the banquet invitation, skybridge and repair-core memories. Open the final save slot, meet ghost Naidu and open the complete letter. Return to CLAR_OS.

## Creative reveal
The Watcher is not an antagonist; it is the unsent message's ghostly delivery system. Every frightening intrusion (clock, handprint, recording, shadow) eventually points toward the sender. The ghost loses its menacing silhouette and becomes a small embarrassed apparition carrying a huge envelope. The completed letter is stored in `app/lost-save-file/act/actData.js` under `GHOST_LETTER` for future personalised editing.

## Gameplay
- Procedural hand-drawn 2D pixel maps, camera following Clar, unique station and ballroom locations.
- Interactive dialogue with original lines and stylised illustrated portraits.
- Three optional-order puzzles per new chapter, retryable answers, dialogue hints, clue journal, map help, visible objective and fragment counter.
- D-pad touch hold, keyboard WASD/arrows, E/space interaction, tap nearby objects.
- Per-chapter localStorage autosaves and explicit restart, no soft locks for wrong choices.
- Music toggle (generated chiptune melody), reduced-effects button, recoverable glitches.
- Final readable full letter and post-letter return to `/birthday`.

## QA checklist (requires device playthrough)
- [ ] On iPad, hold all four D-pad directions repeatedly; no stuck movement after overlay.
- [ ] On laptop, test WASD, arrows, E, space, interaction distance, scene scrolling.
- [ ] Solve the three Chapter Two clues in differing orders; gate stays locked before all three.
- [ ] After Chapter Two gate, see the four-second glitch before the next conversation.
- [ ] Follow the link to Chapter Three and solve each memory.
- [ ] Check final ghost reveal, entire letter scroll, local save and return to CLAR_OS.
- [ ] Refresh each chapter mid-quest, verify local save; test restart warning.
- [ ] Check narrow mobile dimensions, low-motion mode, all CSS and portrait clipping.
- [ ] Confirm no impact on production deployment or existing six-zone prototype.

This is fan-made private-story fiction: characters are cameos, and the user's sender ghost is an intentionally fictional story avatar. The requested 'Azusa' is kept under that name without attributing unverified canon details.

**Build status:** Vercel preview build is automatically deployed after branch commits. Passing build status does not mean the user has completed iPad manual playtesting.
