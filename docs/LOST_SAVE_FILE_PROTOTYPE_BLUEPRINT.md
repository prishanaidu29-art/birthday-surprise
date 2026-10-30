# THE LOST SAVE FILE.exe — Full Story Prototype Blueprint

**Development target:** `rpg-experiment` only. **Never modify:** `master`, production deployment, existing CLAR_OS password screen, or existing birthday pages.

## Locked final 10 decisions
1. Narrative journal: Clar's notes and observations, not a checklist.
2. Progressive puzzles: environmental, logic, memory and horror challenges, with adaptive hints.
3. Deep exploration: hidden rooms, secret routes, optional quests, evolving buildings and revisits.
4. Adaptive psychological horror: balanced cosy/humorous/uncanny pacing, safe spaces, controlled Watcher encounters.
5. Mixed friend quests: major arcs for selected friends, shorter quests for others, all 18 at reunion.
6. Undertale-inspired encounters: original nonviolent ACT/TALK/DEFEND/MEMORY mechanics and optional dodging sequences.
7. Six layered endings: distinct emotional tones and different clues about the mystery; no six-ending completion requirement for birthday access.
8. Adaptive hybrid soundtrack: chiptune, lo-fi cassette and horror ambience, with recurring motifs and iPad audio-unlock.
9. Premium hybrid pixel art: layered environment, richer sprites, portrait expressions, lighting and animations.
10. Full-story prototype: all chapters and endings playable with filler dialogue/assets; iterative polish later.

## Earlier planning decisions to preserve
- Existing experimental branch, six areas, 18 named friends, six endings and player creator as a starting point.
- World: hybrid map/camera/transitions; adaptive world scale; hybrid interiors; evolving buildings; meaningful corrupted-memory transformations; environmental storytelling; stationary finale gathering.
- Watcher: mystery identity, mixed encounters, unsettling intensity, unreliable awareness, controlled fourth-wall interference, hybrid fake crash, combined corruption, silhouette appearance, mixed voice and humorous final farewell. Moderate AI adaptation; environmental chase/hiding/distraction; combined proximity cues; checkpoint recovery.
- Story: six recovered logs, seventh-record twist, gradual save-terminal personality, mixed log discovery, interactive recovered file with glitch unlock.
- Social: 18 friends, dynamic group conversations, hybrid Clar participation, selective timed optional reactions, advanced ECHOES.exe conversation archive, hybrid canonical replay + noncanonical comedy sandbox.
- Saves: mysterious terminals, chapter replay, continue alternate timeline, adaptive ending hints, explicit critical warnings, last critical-decision undo, persistent cosmetics and unlocked endings.
- Finale: comedic gathering entrance, selectable Clar reaction, all 18 friends present, stationary ambient group behaviour, simple cake and group photo with no hidden photo detail, teaser messages (full messages remain in CLAR_OS), return navigation both ways.
- Accessibility: iPad touch targets, hold-to-move without text selection, pause on overlays, optional reduced effects/timers, no essential clue permanently missable.

## Existing experimental route and cast (verified from branch)
Route: `/lost-save-file`.
Regions: Familiar Town, Last Train, Midnight Arcade, Forgotten Woods, Corrupted Wing, Lost Archive.
Cast: Naidu, Yanaal, Nesma, Trisha, Riri, Arsha, Mashriq, Shah, Aaron, Lakshay, AK, Limin, Nut, Mira, Hannah, Cem, Azrin, Mukshanna.
Existing provisional ending IDs: dawn, loop, shadow, escape, forgotten, true. Ending names, requirements and story text are **placeholder** until later detailed planning.

## Implementation milestones
1. Stabilise baseline: branch isolation, save persistence, resume/recovery, journal, ending warnings and birthday link.
2. Narrative progression: chapter objectives, six logs and seventh-record reveal, meaningful puzzles, evolving locations and checkpoint terminals.
3. Encounter engine: nonviolent choices, original dodge arena, Watcher environmental chases, iPad controls, fair recovery.
4. Social engine: 18 friend records, mixed quest arcs, dynamic group scenes, ECHOES.exe and chapter replay.
5. Finale and ending engine: all six routes, comedic gathering, cake/photo, recovered desktop, replay/return navigation.
6. Art/audio pass and verification: sprites, lighting, music hooks, performance, accessibility, mobile Safari tests.

## Save and branching invariants
- Never overwrite production files.
- Separate global unlocks from active timeline; completed endings survive New Game+.
- Previewed sandbox dialogue cannot change canonical quest or ending state.
- A critical decision needs an explicit warning and recoverable checkpoint.
- No random/timed dialogue choice silently locks an ending.
- Watcher fake crashes never erase real saves.
- Birthday reveal is accessible after a completed story without all six endings.
- Browser storage is not a permanent backup; offer export/import when implemented.

## Prototype acceptance criteria
- Navigable beginning-to-end on iPad, all six endings reachable through coherent conditions.
- All 18 friends appear and can be spoken to.
- Save/reload and checkpoint recovery work without losing unlocked endings.
- World is more than a flat single map; each chapter has distinctive art and interactions.
- Puzzles and encounters can be completed with touch controls.
- Reunion and link to existing CLAR_OS work without changing production.
- Distinguish **implemented**, **placeholder**, and **not yet implemented** features in playtest notes.
