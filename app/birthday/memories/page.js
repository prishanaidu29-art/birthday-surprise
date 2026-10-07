"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

import {
  ArrowLeft,
  Camera,
  ChevronLeft,
  ChevronRight,
  Clock,
  Database,
  Disc3,
  Film,
  FastForward,
  Gamepad2,
  Heart,
  Pause,
  Play,
  Radio,
  RotateCcw,
  ScanLine,
  Search,
  Shuffle,
  SkipBack,
  SkipForward,
  Sparkles,
  Star,
  Video,
  Volume2,
  VolumeX,
  X,
  Zap,
} from "lucide-react";

import EasterEgg from "@/components/EasterEgg";
import { useAuth } from "@/hooks/useAuth";

const Enhanced3DViewer = dynamic(
  () => import("./components/Enhanced3DViewer"),
  { ssr: false }
);

/* -------------------------------------------------------------------------- */
/* TIMELINE                                                                    */
/* -------------------------------------------------------------------------- */

const TIMELINE = [
  { tape: "01", year: 2010, age: 6, label: "THE BEGINNING" },
  { tape: "02", year: 2011, age: 7, label: "FIRST SIGNAL" },
  { tape: "03", year: 2012, age: 8, label: "CHAOS ERA I" },
  { tape: "04", year: 2013, age: 9, label: "SIDE QUEST" },
  { tape: "05", year: 2014, age: 10, label: "LOST FOOTAGE" },
  { tape: "06", year: 2015, age: 11, label: "CHARACTER ARC" },
  { tape: "07", year: 2016, age: 12, label: "NEW SEASON" },
  { tape: "08", year: 2017, age: 13, label: "PLOT THICKENS" },
  { tape: "09", year: 2018, age: 14, label: "THE GOOD YEARS" },
  { tape: "10", year: 2019, age: 15, label: "BEFORE EVERYTHING" },
  { tape: "11", year: 2020, age: 16, label: "THE GLITCH" },
  { tape: "12", year: 2020, age: 16, label: "LOCKED FILE" },
  { tape: "13", year: 2021, age: 17, label: "REBOOT" },
  { tape: "14", year: 2022, age: 18, label: "NEW LEVEL" },
  { tape: "15", year: 2023, age: 19, label: "CHARACTER DEVELOPMENT" },
  { tape: "16", year: 2023, age: 19, label: "BONUS FOOTAGE" },
  { tape: "17", year: 2024, age: 20, label: "THE LORE" },
  { tape: "18", year: 2024, age: 20, label: "UNRELEASED" },
  { tape: "19", year: 2025, age: 21, label: "RECENTLY RECOVERED" },
  { tape: "20", year: 2025, age: 21, label: "B-SIDE" },
  { tape: "21", year: 2026, age: 22, label: "CURRENT FILE" },
  { tape: "22", year: 2026, age: 22, label: "THE NEXT CHAPTER" },
];

const FALLBACK_MEMORIES = [
  {
    id: "fallback-1",
    title: "SIGNAL FOUND",
    description: "A memory is waiting to be loaded.",
    date_taken: "2010-01-01",
    photo_url: "",
  },
  {
    id: "fallback-2",
    title: "LOST FOOTAGE",
    description:
      "This section of the tape has been partially recovered.",
    date_taken: "2014-01-01",
    photo_url: "",
  },
  {
    id: "fallback-3",
    title: "CURRENT FILE",
    description: "The archive is still being written.",
    date_taken: "2026-01-01",
    photo_url: "",
  },
];

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                     */
/* -------------------------------------------------------------------------- */

function formatDate(date) {
  if (!date) return "DATE UNKNOWN";

  try {
    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "DATE UNKNOWN";
    }

    return parsed.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "DATE UNKNOWN";
  }
}

function getMemoryYear(memory) {
  if (!memory?.date_taken) return null;

  const date = new Date(memory.date_taken);

  if (Number.isNaN(date.getTime())) return null;

  return date.getFullYear();
}

/* -------------------------------------------------------------------------- */
/* PAGE                                                                        */
/* -------------------------------------------------------------------------- */

export default function MemoriesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  /* ------------------------------- DATA ---------------------------------- */

  const [memories, setMemories] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  /* ------------------------------ BOOT ----------------------------------- */

  const [bootProgress, setBootProgress] = useState(0);
  const [bootFinished, setBootFinished] = useState(false);

  /* ----------------------------- MEMORY ---------------------------------- */

  const [selectedMemory, setSelectedMemory] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  /* ------------------------------- UI ------------------------------------ */

  const [viewMode, setViewMode] = useState("timeline");
  const [search, setSearch] = useState("");

  /* ------------------------------ PLAYER --------------------------------- */

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  /* ---------------------------- EFFECTS ---------------------------------- */

  const [showScanlines, setShowScanlines] = useState(true);
  const [showGlitch, setShowGlitch] = useState(true);
  const [tracking, setTracking] = useState(false);

  /* ---------------------------- OTHER ------------------------------------ */

  const [favoriteIds, setFavoriteIds] = useState([]);
  const [currentTimeline, setCurrentTimeline] = useState(0);

  /* ------------------------------------------------------------------------ */
  /* AUTH                                                                      */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [authLoading, user, router]);

  /* ------------------------------------------------------------------------ */
  /* LOAD MEMORIES                                                             */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    let cancelled = false;

    async function loadMemories() {
      if (!user) {
        setDataLoading(false);
        return;
      }

      setDataLoading(true);

      try {
        const { data, error } = await supabase
          .from("memories")
          .select("*")
          .order("date_taken", {
            ascending: true,
          });

        if (cancelled) return;

        if (error) {
          console.error("Memory loading error:", error);
          setMemories(FALLBACK_MEMORIES);
        } else {
          setMemories(
            data?.length
              ? data
              : FALLBACK_MEMORIES
          );
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Memory loading error:", error);
          setMemories(FALLBACK_MEMORIES);
        }
      } finally {
        if (!cancelled) {
          setDataLoading(false);
        }
      }
    }

    loadMemories();

    return () => {
      cancelled = true;
    };
  }, [user]);

  /* ------------------------------------------------------------------------ */
  /* REAL BOOT SEQUENCE                                                       */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (authLoading) return;

    let cancelled = false;
    let progress = 0;

    const interval = setInterval(() => {
      if (cancelled) return;

      progress += Math.floor(Math.random() * 7) + 4;

      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        setBootProgress(100);

        setTimeout(() => {
          if (!cancelled) {
            setBootFinished(true);
          }
        }, 700);

        return;
      }

      setBootProgress(progress);
    }, 90);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [authLoading]);

  /* ------------------------------------------------------------------------ */
  /* FINAL BOOT CONDITION                                                     */
  /* ------------------------------------------------------------------------ */

  const pageLoading =
    authLoading ||
    dataLoading ||
    !bootFinished;

  /* ------------------------------------------------------------------------ */
  /* SEARCH                                                                    */
  /* ------------------------------------------------------------------------ */

  const filteredMemories = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return memories;
    }

    return memories.filter((memory) => {
      return (
        memory?.title
          ?.toLowerCase()
          .includes(query) ||
        memory?.description
          ?.toLowerCase()
          .includes(query) ||
        formatDate(memory?.date_taken)
          .toLowerCase()
          .includes(query)
      );
    });
  }, [memories, search]);

  /* ------------------------------------------------------------------------ */
  /* TIMELINE                                                                  */
  /* ------------------------------------------------------------------------ */

  const timelineData = useMemo(() => {
    return TIMELINE.map((slot, index) => {
      const matchingMemory = memories.find(
        (memory) =>
          getMemoryYear(memory) === slot.year
      );

      return {
        ...slot,
        memory:
          matchingMemory ||
          memories[index] ||
          null,
      };
    });
  }, [memories]);

  /* ------------------------------------------------------------------------ */
  /* PLAYER FUNCTIONS                                                          */
  /* ------------------------------------------------------------------------ */

  const togglePlayback = useCallback(() => {
    setIsPlaying((current) => !current);
  }, []);

  const nextMemory = useCallback(() => {
    if (!memories.length) return;

    setSelectedIndex((currentIndex) => {
      const nextIndex =
        (currentIndex + 1) % memories.length;

      setSelectedMemory(memories[nextIndex]);

      return nextIndex;
    });
  }, [memories]);

  const previousMemory = useCallback(() => {
    if (!memories.length) return;

    setSelectedIndex((currentIndex) => {
      const previousIndex =
        (currentIndex - 1 + memories.length) %
        memories.length;

      setSelectedMemory(memories[previousIndex]);

      return previousIndex;
    });
  }, [memories]);

  const randomMemory = useCallback(() => {
    if (!memories.length) return;

    const randomIndex = Math.floor(
      Math.random() * memories.length
    );

    setSelectedIndex(randomIndex);
    setSelectedMemory(memories[randomIndex]);
    setIsPlaying(true);
  }, [memories]);

  const openMemory = useCallback(
    (memory) => {
      if (!memory) return;

      const memoryIndex = memories.findIndex(
        (item) => item.id === memory.id
      );

      setSelectedMemory(memory);

      if (memoryIndex >= 0) {
        setSelectedIndex(memoryIndex);
      }

      setIsPlaying(true);
    },
    [memories]
  );

  /* ------------------------------------------------------------------------ */
  /* FAVORITES                                                                 */
  /* ------------------------------------------------------------------------ */

  function toggleFavorite(id) {
    setFavoriteIds((current) => {
      if (current.includes(id)) {
        return current.filter(
          (item) => item !== id
        );
      }

      return [...current, id];
    });
  }

  /* ------------------------------------------------------------------------ */
  /* TIMELINE NAVIGATION                                                       */
  /* ------------------------------------------------------------------------ */

  function jumpToTimeline(index) {
    setCurrentTimeline(index);

    const element = document.getElementById(
      `timeline-${index}`
    );

    element?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    const memory = timelineData[index]?.memory;

    if (memory) {
      const memoryIndex = memories.findIndex(
        (item) => item.id === memory.id
      );

      if (memoryIndex >= 0) {
        setSelectedIndex(memoryIndex);
      }
    }
  }

  /* ------------------------------------------------------------------------ */
  /* KEYBOARD CONTROLS                                                         */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    function handleKeyDown(event) {
      const target = event.target;

      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target?.isContentEditable;

      if (isTyping) return;

      if (event.key === "Escape") {
        setSelectedMemory(null);
        setIsPlaying(false);
        return;
      }

      if (
        event.key === "ArrowRight" ||
        event.key === "ArrowDown"
      ) {
        event.preventDefault();
        nextMemory();
        return;
      }

      if (
        event.key === "ArrowLeft" ||
        event.key === "ArrowUp"
      ) {
        event.preventDefault();
        previousMemory();
        return;
      }

      if (event.key === " ") {
        event.preventDefault();
        togglePlayback();
        return;
      }

      if (event.key.toLowerCase() === "r") {
        event.preventDefault();
        randomMemory();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    nextMemory,
    previousMemory,
    randomMemory,
    togglePlayback,
  ]);

  /* ------------------------------------------------------------------------ */
  /* LOADING SCREEN                                                            */
  /* ------------------------------------------------------------------------ */

  if (pageLoading) {
    return (
      <>
        <div className="vhs-boot">
          <div className="boot-noise" />

          <div className="boot-terminal">
            <div className="boot-top">
              <span>ARCHIVE SYSTEM</span>

              <span className="boot-rec">
                <span className="boot-rec-dot" />
                REC
              </span>
            </div>

            <div
              className="boot-logo"
              data-text="MEMORY ARCHIVE"
            >
              MEMORY
              <br />
              ARCHIVE
            </div>

            <div className="boot-sub">
              INSERTING TAPE...
            </div>

            <div className="boot-bar">
              <div
                className="boot-bar-fill"
                style={{
                  width: `${bootProgress}%`,
                }}
              />
            </div>

            <div className="boot-percent">
              {String(bootProgress).padStart(
                3,
                "0"
              )}
              % LOADED
            </div>

            <div className="boot-status">
              {bootProgress < 20 &&
                "CHECKING SIGNAL..."}

              {bootProgress >= 20 &&
                bootProgress < 45 &&
                "LOCATING OLD FOOTAGE..."}

              {bootProgress >= 45 &&
                bootProgress < 70 &&
                "REWINDING MEMORIES..."}

              {bootProgress >= 70 &&
                bootProgress < 99 &&
                "RESTORING CORRUPTED FILES..."}

              {bootProgress >= 99 &&
                "PLAYBACK READY."}
            </div>

            <div className="boot-mini-status">
              AUTH:
              {authLoading
                ? " VERIFYING"
                : user
                ? " OK"
                : " WAITING"}
              <br />
              DATABASE:
              {dataLoading
                ? " CONNECTING"
                : " READY"}
            </div>
          </div>

          <div className="boot-corner boot-corner-left">
            CH-03
          </div>

          <div className="boot-corner boot-corner-right">
            SP LP
          </div>
        </div>

        <style jsx global>
          {BOOT_CSS}
        </style>
      </>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* MAIN PAGE                                                                 */
  /* ------------------------------------------------------------------------ */

  return (
    <main
      className={`archive-page ${
        showGlitch ? "glitch-enabled" : ""
      } ${tracking ? "tracking-active" : ""} ${
        isPlaying ? "is-playing" : ""
      }`}
    >
      {/* VHS OVERLAYS */}

      {showScanlines && (
        <div className="scanlines" />
      )}

      <div className="vignette" />
      <div className="noise" />
      <div className="tracking-lines" />

      {/* ------------------------------------------------------------------ */}
      {/* HEADER                                                             */}
      {/* ------------------------------------------------------------------ */}

      <header className="vhs-header">
        <div className="header-left">
          <Link
            href="/birthday"
            className="back-button"
          >
            <ArrowLeft size={15} />
            EXIT
          </Link>

          <div className="channel">
            <Radio size={14} />
            CH-03
          </div>

          <div className="rec-status">
            <span className="rec-dot" />
            REC
          </div>
        </div>

        <div className="header-title">
          <span>
            CLAR // MEMORY ARCHIVE
          </span>

          <small>
            PERSONAL VHS DATABASE
          </small>
        </div>

        <div className="header-right">
          <span>SP</span>
          <span>NTSC</span>
          <span>2026</span>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* SHELL                                                              */}
      {/* ------------------------------------------------------------------ */}

      <div className="archive-shell">
        {/* HERO */}

        <section className="archive-hero">
          <div className="hero-copy">
            <div className="tiny-label">
              <span className="blink-dot" />
              TAPE DATABASE // ACCESS GRANTED
            </div>

            <h1
              className="glitch-title"
              data-text="MEMORY ARCHIVE"
            >
              MEMORY ARCHIVE
            </h1>

            <p className="hero-description">
              16 YEARS.
              <br />
              22 TIMELINE CHAPTERS.
              <br />
              WAY TOO MUCH LORE.
            </p>

            <div className="hero-controls">
              <button
                className="vcr-button play-button"
                onClick={togglePlayback}
              >
                {isPlaying ? (
                  <Pause size={15} />
                ) : (
                  <Play size={15} />
                )}

                {isPlaying
                  ? "PAUSE"
                  : "PLAY TAPE"}
              </button>

              <button
                className="vcr-button"
                onClick={randomMemory}
              >
                <Shuffle size={15} />
                RANDOM
              </button>

              <button
                className="vcr-button"
                onClick={() => {
                  setSearch("");
                  setViewMode("timeline");
                  setCurrentTimeline(0);
                  setSelectedMemory(null);
                  setSelectedIndex(0);
                  setIsPlaying(false);

                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
              >
                <RotateCcw size={15} />
                RESET
              </button>
            </div>
          </div>

          {/* VHS PLAYER */}

          <div className="vhs-player">
            <div className="player-screen">
              <div className="screen-grid" />

              <div className="player-time">
                00:
                {String(
                  Math.min(
                    selectedIndex + 1,
                    99
                  )
                ).padStart(2, "0")}
                :22
              </div>

              <div
                className={`player-play ${
                  isPlaying ? "playing" : ""
                }`}
              >
                {isPlaying
                  ? "▶ PLAY"
                  : "▮▮ PAUSE"}
              </div>

              <div className="player-label">
                CLAR_ARCHIVE_22
              </div>

              <div className="player-corner">
                <span>
                  {isPlaying ? "PLAY" : "STOP"}
                </span>

                <span>SP</span>
              </div>
            </div>

            <div className="player-deck">
              {/* IMPORTANT:
                  The reels now ONLY spin while isPlaying.
                  They are controlled by the parent .is-playing class.
              */}

              <div className="reel reel-left">
                <div className="reel-spokes">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>

                <div className="reel-hole" />
              </div>

              <div className="deck-center">
                <div className="deck-label">
                  MEMORY
                  <br />
                  TAPE
                </div>

                <div className="deck-status">
                  {isPlaying
                    ? "PLAYING"
                    : "PAUSED"}
                </div>
              </div>

              <div className="reel reel-right">
                <div className="reel-spokes">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>

                <div className="reel-hole" />
              </div>
            </div>

            <div className="deck-buttons">
              <button
                onClick={previousMemory}
                title="Previous memory"
              >
                <SkipBack size={13} />
              </button>

              <button
                onClick={togglePlayback}
                title={
                  isPlaying
                    ? "Pause"
                    : "Play"
                }
              >
                {isPlaying ? (
                  <Pause size={13} />
                ) : (
                  <Play size={13} />
                )}
              </button>

              <button
                onClick={nextMemory}
                title="Next memory"
              >
                <SkipForward size={13} />
              </button>

              <button
                onClick={() =>
                  setIsMuted(
                    (current) => !current
                  )
                }
                title={
                  isMuted
                    ? "Unmute"
                    : "Mute"
                }
              >
                {isMuted ? (
                  <VolumeX size={13} />
                ) : (
                  <Volume2 size={13} />
                )}
              </button>
            </div>
          </div>
        </section>

        {/* CONTROL CONSOLE */}

        <section className="control-console">
          <div className="console-left">
            <div className="console-title">
              <Gamepad2 size={16} />
              ARCHIVE CONTROL
            </div>

            <div className="view-buttons">
              <button
                className={
                  viewMode === "timeline"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setViewMode("timeline")
                }
              >
                <Clock size={14} />
                TIMELINE
              </button>

              <button
                className={
                  viewMode === "grid"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setViewMode("grid")
                }
              >
                <Camera size={14} />
                CONTACT SHEET
              </button>

              <button
                className={
                  viewMode === "3d"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setViewMode("3d")
                }
              >
                <Disc3 size={14} />
                3D TAPE
              </button>
            </div>
          </div>

          <div className="console-right">
            <button
              className={
                showScanlines
                  ? "toggle active"
                  : "toggle"
              }
              onClick={() =>
                setShowScanlines(
                  (current) => !current
                )
              }
            >
              <ScanLine size={14} />
              CRT
            </button>

            <button
              className={
                showGlitch
                  ? "toggle active"
                  : "toggle"
              }
              onClick={() =>
                setShowGlitch(
                  (current) => !current
                )
              }
            >
              <Zap size={14} />
              GLITCH
            </button>

            <button
              className={
                tracking
                  ? "toggle active danger"
                  : "toggle"
              }
              onClick={() =>
                setTracking(
                  (current) => !current
                )
              }
            >
              <Video size={14} />
              TRACKING
            </button>
          </div>
        </section>

        {/* SEARCH */}

        <section className="archive-search">
          <Search size={16} />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="SEARCH THE ARCHIVE..."
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}

          <span>
            {filteredMemories.length} FILE
            {filteredMemories.length === 1
              ? ""
              : "S"}
          </span>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* TIMELINE                                                         */}
        {/* ---------------------------------------------------------------- */}

        {viewMode === "timeline" && (
          <section className="timeline-section">
            <div className="section-heading">
              <div>
                <div className="tiny-label">
                  CHAPTER SELECT
                </div>

                <h2>
                  THE LAST 16 YEARS
                  <span>
                    // 22 TAPES
                  </span>
                </h2>
              </div>

              <div className="timeline-counter">
                {String(
                  currentTimeline + 1
                ).padStart(2, "0")}
                /22
              </div>
            </div>

            <div className="timeline">
              <div className="timeline-line" />

              {timelineData.map(
                (slot, index) => {
                  const memory =
                    slot.memory;

                  const hasMemory =
                    Boolean(memory);

                  return (
                    <article
                      key={`${slot.tape}-${index}`}
                      id={`timeline-${index}`}
                      className={`timeline-node ${
                        index % 2 === 0
                          ? "node-left"
                          : "node-right"
                      } ${
                        currentTimeline ===
                        index
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => {
                        jumpToTimeline(
                          index
                        );

                        if (memory) {
                          openMemory(
                            memory
                          );
                        }
                      }}
                    >
                      <div className="timeline-dot">
                        {hasMemory ? (
                          <Play size={10} />
                        ) : (
                          <span>?</span>
                        )}
                      </div>

                      <div className="timeline-card">
                        <div className="tape-number">
                          TAPE {slot.tape}
                        </div>

                        <div className="timeline-year">
                          {slot.year}
                        </div>

                        <div className="timeline-age">
                          AGE {slot.age}
                        </div>

                        <div className="timeline-card-title">
                          {memory?.title ||
                            slot.label}
                        </div>

                        <div className="timeline-card-status">
                          {hasMemory
                            ? "● FOOTAGE AVAILABLE"
                            : "○ SIGNAL LOST"}
                        </div>

                        <div className="timeline-preview">
                          {memory?.photo_url ? (
                            <img
                              src={
                                memory.photo_url
                              }
                              alt=""
                            />
                          ) : (
                            <div className="lost-footage">
                              NO IMAGE
                            </div>
                          )}
                        </div>

                        <div className="timeline-open">
                          {hasMemory
                            ? "CLICK TO PLAY →"
                            : "FILE EMPTY"}
                        </div>
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          </section>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* CONTACT SHEET                                                    */}
        {/* ---------------------------------------------------------------- */}

        {viewMode === "grid" && (
          <section className="contact-section">
            <div className="section-heading">
              <div>
                <div className="tiny-label">
                  RECOVERED MEDIA
                </div>

                <h2>
                  CONTACT SHEET
                  <span>
                    // RAW FOOTAGE
                  </span>
                </h2>
              </div>
            </div>

            {filteredMemories.length === 0 ? (
              <div className="empty-archive">
                NO FOOTAGE MATCHES YOUR SEARCH.
              </div>
            ) : (
              <div className="contact-grid">
                {filteredMemories.map(
                  (memory, index) => {
                    const favorite =
                      favoriteIds.includes(
                        memory.id
                      );

                    return (
                      <article
                        key={
                          memory.id ||
                          index
                        }
                        className="memory-tape"
                        onClick={() =>
                          openMemory(
                            memory
                          )
                        }
                      >
                        <div className="tape-sticker">
                          VHS-
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </div>

                        <div className="memory-image">
                          {memory.photo_url ? (
                            <img
                              src={
                                memory.photo_url
                              }
                              alt={
                                memory.title ||
                                ""
                              }
                            />
                          ) : (
                            <div className="image-static">
                              <Film
                                size={30}
                              />

                              <span>
                                NO FOOTAGE
                              </span>
                            </div>
                          )}

                          <div className="image-overlay">
                            <Play size={30} />
                          </div>
                        </div>

                        <div className="memory-info">
                          <div className="memory-date">
                            {formatDate(
                              memory.date_taken
                            )}
                          </div>

                          <h3>
                            {memory.title ||
                              "UNTITLED FOOTAGE"}
                          </h3>

                          <p>
                            {memory.description ||
                              "No description recorded."}
                          </p>

                          <div className="memory-bottom">
                            <span>
                              FILE{" "}
                              {String(
                                index + 1
                              ).padStart(
                                3,
                                "0"
                              )}
                            </span>

                            <button
                              onClick={(
                                event
                              ) => {
                                event.stopPropagation();

                                toggleFavorite(
                                  memory.id
                                );
                              }}
                              className={
                                favorite
                                  ? "heart active"
                                  : "heart"
                              }
                            >
                              <Heart
                                size={14}
                              />
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  }
                )}
              </div>
            )}
          </section>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* 3D                                                                */}
        {/* ---------------------------------------------------------------- */}

        {viewMode === "3d" && (
          <section className="three-d-section">
            <Enhanced3DViewer
              memories={
                filteredMemories
              }
              onSelectMemory={
                openMemory
              }
            />
          </section>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* FOOTER                                                            */}
        {/* ---------------------------------------------------------------- */}

        <section className="archive-footer-panel">
          <div className="footer-stat">
            <Database size={17} />

            <div>
              <strong>
                {memories.length}
              </strong>

              <span>
                FILES RECOVERED
              </span>
            </div>
          </div>

          <div className="footer-stat">
            <Star size={17} />

            <div>
              <strong>
                {favoriteIds.length}
              </strong>

              <span>
                FAVOURITES
              </span>
            </div>
          </div>

          <div className="footer-stat">
            <Sparkles size={17} />

            <div>
              <strong>22</strong>

              <span>
                TAPE CHAPTERS
              </span>
            </div>
          </div>

          <div className="footer-stat">
            <Gamepad2 size={17} />

            <div>
              <strong>∞</strong>

              <span>LORE</span>
            </div>
          </div>
        </section>

        {/* NAVIGATION */}

        <div className="bottom-navigation">
          <Link href="/birthday">
            ← BACK TO ARCHIVE DESKTOP
          </Link>

          <button
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
          >
            ↑ REWIND TO TOP
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* EASTER EGGS                                                        */}
      {/* ------------------------------------------------------------------ */}

      <EasterEgg
        id="memories-egg-1"
        position="top-egg"
        message="CONGRATS. YOU FOUND A CORRUPTED MEMORY SIGNAL."
        onFound={() =>
          console.log(
            "Memory Easter Egg 1 found"
          )
        }
      />

      <EasterEgg
        id="memories-egg-2"
        position="bottom-egg"
        message="YOU WEREN'T SUPPOSED TO LOOK THERE 👀"
        onFound={() =>
          console.log(
            "Memory Easter Egg 2 found"
          )
        }
      />

      {/* ------------------------------------------------------------------ */}
      {/* MEMORY MODAL                                                       */}
      {/* ------------------------------------------------------------------ */}

      {selectedMemory && (
        <div
          className="memory-modal-backdrop"
          onClick={() => {
            setSelectedMemory(null);
            setIsPlaying(false);
          }}
        >
          <div
            className="memory-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-topbar">
              <span>
                ● PLAYBACK // FILE{" "}
                {String(
                  selectedIndex + 1
                ).padStart(3, "0")}
              </span>

              <button
                onClick={() => {
                  setSelectedMemory(null);
                  setIsPlaying(false);
                }}
                aria-label="Close memory"
              >
                <X size={17} />
              </button>
            </div>

            <div className="modal-screen">
              {selectedMemory.photo_url ? (
                <img
                  src={
                    selectedMemory.photo_url
                  }
                  alt={
                    selectedMemory.title ||
                    ""
                  }
                />
              ) : (
                <div className="modal-no-signal">
                  <Film size={55} />

                  <span>
                    NO SIGNAL
                  </span>

                  <small>
                    THIS FILE HAS NO IMAGE
                  </small>
                </div>
              )}

              <div className="modal-scan" />

              <div className="modal-timecode">
                {isPlaying
                  ? "PLAY"
                  : "PAUSE"}{" "}
                00:
                {String(
                  selectedIndex + 1
                ).padStart(2, "0")}
                :22
              </div>
            </div>

            <div className="modal-details">
              <div className="modal-tape">
                <span>
                  TAPE{" "}
                  {String(
                    selectedIndex + 1
                  ).padStart(2, "0")}
                </span>

                <span>
                  {formatDate(
                    selectedMemory.date_taken
                  )}
                </span>
              </div>

              <h2>
                {selectedMemory.title ||
                  "UNTITLED FOOTAGE"}
              </h2>

              <p>
                {selectedMemory.description ||
                  "There is no description for this file."}
              </p>

              <div className="modal-controls">
                <button
                  onClick={
                    previousMemory
                  }
                >
                  <SkipBack size={15} />
                  PREV
                </button>

                <button
                  className="modal-play"
                  onClick={
                    togglePlayback
                  }
                >
                  {isPlaying ? (
                    <Pause size={15} />
                  ) : (
                    <Play size={15} />
                  )}

                  {isPlaying
                    ? "PAUSE"
                    : "PLAY"}
                </button>

                <button
                  onClick={nextMemory}
                >
                  NEXT
                  <SkipForward
                    size={15}
                  />
                </button>

                <button
                  onClick={() =>
                    toggleFavorite(
                      selectedMemory.id
                    )
                  }
                >
                  <Heart
                    size={15}
                    fill={
                      favoriteIds.includes(
                        selectedMemory.id
                      )
                        ? "currentColor"
                        : "none"
                    }
                  />
                </button>
              </div>

              {selectedMemory.audio_url && (
                <audio
                  controls
                  src={
                    selectedMemory.audio_url
                  }
                  muted={isMuted}
                  className="memory-audio"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* KEYBOARD HINT */}

      <div className="keyboard-hint">
        ← → CHANGE TAPE&nbsp;&nbsp;
        SPACE PLAY&nbsp;&nbsp;
        R RANDOM&nbsp;&nbsp;
        ESC CLOSE
      </div>

      <style jsx global>
        {ARCHIVE_CSS}
      </style>
    </main>
  );
}

/* ==========================================================================
   BOOT CSS
   ========================================================================== */

const BOOT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Press+Start+2P&family=Share+Tech+Mono&family=VT323&display=swap');

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  background: #05030a;
}

.vhs-boot {
  min-height: 100vh;
  width: 100%;
  background:
    radial-gradient(
      circle at 50% 45%,
      #22134b 0%,
      #0b0717 42%,
      #030207 100%
    );
  color: #dffcff;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  font-family: "Share Tech Mono", monospace;
}

.vhs-boot::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    repeating-linear-gradient(
      0deg,
      rgba(255,255,255,.025) 0px,
      rgba(255,255,255,.025) 1px,
      transparent 1px,
      transparent 4px
    );
  z-index: 5;
}

.boot-noise {
  position: absolute;
  inset: 0;
  opacity: .12;
  pointer-events: none;
  background-image:
    repeating-linear-gradient(
      0deg,
      rgba(255,255,255,.08) 0px,
      rgba(255,255,255,.08) 1px,
      transparent 1px,
      transparent 4px
    );
  animation: bootNoise .18s steps(2) infinite;
}

.boot-terminal {
  width: min(680px, 88vw);
  border: 1px solid #a75cff;
  background: rgba(6, 4, 18, .94);
  box-shadow:
    0 0 25px rgba(155,92,255,.45),
    0 0 80px rgba(255,0,190,.15);
  padding: 28px;
  position: relative;
  z-index: 10;
}

.boot-top {
  display: flex;
  justify-content: space-between;
  color: #61f7ff;
  font-size: 13px;
  letter-spacing: 2px;
  border-bottom: 1px solid rgba(97,247,255,.25);
  padding-bottom: 12px;
}

.boot-rec {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #ff536c;
}

.boot-rec-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #ff365e;
  box-shadow: 0 0 9px #ff365e;
  animation: bootBlink .9s steps(2) infinite;
}

.boot-logo {
  font-family: "Press Start 2P", monospace;
  font-size: clamp(30px, 7vw, 72px);
  line-height: 1.2;
  margin: 55px 0 25px;
  color: #fff;
  position: relative;
  text-shadow:
    3px 0 #ff3cac,
    -3px 0 #61f7ff,
    0 0 30px rgba(155,92,255,.8);
}

.boot-logo::before,
.boot-logo::after {
  content: attr(data-text);
  position: absolute;
  left: 0;
  opacity: .25;
  pointer-events: none;
}

.boot-logo::before {
  color: #61f7ff;
  transform: translateX(-2px);
  clip-path: inset(0 0 55% 0);
  animation: bootGlitchA 3s infinite steps(1);
}

.boot-logo::after {
  color: #ff3cac;
  transform: translateX(3px);
  clip-path: inset(60% 0 0 0);
  animation: bootGlitchB 2.6s infinite steps(1);
}

.boot-sub {
  color: #ff3cac;
  font-size: 18px;
  margin-bottom: 18px;
}

.boot-bar {
  height: 14px;
  border: 1px solid #61f7ff;
  padding: 2px;
  overflow: hidden;
}

.boot-bar-fill {
  height: 100%;
  background:
    repeating-linear-gradient(
      90deg,
      #61f7ff 0px,
      #61f7ff 8px,
      #a75cff 8px,
      #a75cff 16px
    );
  box-shadow: 0 0 15px rgba(97,247,255,.6);
  transition: width .09s linear;
}

.boot-percent {
  text-align: right;
  color: #61f7ff;
  margin-top: 8px;
  font-size: 13px;
}

.boot-status {
  margin-top: 35px;
  color: #c7ff4f;
  font-size: 16px;
}

.boot-mini-status {
  margin-top: 24px;
  padding-top: 14px;
  border-top: 1px solid rgba(255,255,255,.08);
  color: #625c72;
  font-size: 10px;
  line-height: 1.8;
  letter-spacing: 1px;
}

.boot-corner {
  position: absolute;
  bottom: 20px;
  z-index: 10;
  font-family: "Press Start 2P", monospace;
  font-size: 8px;
  color: rgba(255,255,255,.5);
}

.boot-corner-left {
  left: 20px;
}

.boot-corner-right {
  right: 20px;
}

@keyframes bootNoise {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(2px);
  }

  100% {
    transform: translateY(-2px);
  }
}

@keyframes bootBlink {
  50% {
    opacity: .25;
  }
}

@keyframes bootGlitchA {
  0%, 88%, 100% {
    clip-path: inset(0 0 55% 0);
  }

  89% {
    clip-path: inset(15% 0 60% 0);
    transform: translateX(-8px);
  }

  90% {
    clip-path: inset(0 0 80% 0);
    transform: translateX(5px);
  }
}

@keyframes bootGlitchB {
  0%, 91%, 100% {
    clip-path: inset(60% 0 0 0);
  }

  92% {
    clip-path: inset(72% 0 0 0);
    transform: translateX(7px);
  }

  93% {
    clip-path: inset(55% 0 15% 0);
    transform: translateX(-4px);
  }
}

@media (max-width: 600px) {
  .boot-terminal {
    padding: 20px;
  }

  .boot-logo {
    margin-top: 40px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .boot-noise,
  .boot-rec-dot,
  .boot-logo::before,
  .boot-logo::after {
    animation: none;
  }
}
`;

/* ==========================================================================
   ARCHIVE CSS
   ========================================================================== */

const ARCHIVE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Press+Start+2P&family=Share+Tech+Mono&family=VT323&display=swap');

:root {
  --black: #05030a;
  --black2: #0b0716;
  --purple: #9b5cff;
  --purple2: #5c2cff;
  --pink: #ff3cac;
  --cyan: #61f7ff;
  --green: #c7ff4f;
  --yellow: #ffe66d;
  --white: #efffff;
  --muted: #8f8aa9;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--black);
  color: var(--white);
}

button,
input {
  font: inherit;
}

button {
  cursor: pointer;
}

.archive-page {
  min-height: 100vh;
  background:
    radial-gradient(
      circle at 15% 15%,
      rgba(103,45,170,.22),
      transparent 25%
    ),
    radial-gradient(
      circle at 85% 20%,
      rgba(255,60,172,.13),
      transparent 22%
    ),
    radial-gradient(
      circle at 50% 100%,
      rgba(53,84,255,.18),
      transparent 35%
    ),
    #05030a;
  position: relative;
  overflow-x: hidden;
  font-family: "Share Tech Mono", monospace;
}

.archive-page::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9998;
  background:
    linear-gradient(
      90deg,
      rgba(255,0,60,.035),
      transparent 25%,
      rgba(0,255,255,.035)
    );
  mix-blend-mode: screen;
}

/* -------------------------------------------------------------------------- */
/* CRT / VHS                                                                  */
/* -------------------------------------------------------------------------- */

.scanlines {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  background:
    repeating-linear-gradient(
      0deg,
      rgba(255,255,255,.045) 0px,
      rgba(255,255,255,.045) 1px,
      transparent 1px,
      transparent 4px
    );
}

.vignette {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9997;
  background:
    radial-gradient(
      ellipse at center,
      transparent 48%,
      rgba(0,0,0,.32) 100%
    );
}

.noise {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9996;
  opacity: .045;
  background-image:
    repeating-radial-gradient(
      circle at 17% 23%,
      white 0,
      white 1px,
      transparent 1px,
      transparent 4px
    );
  background-size: 9px 9px;
  animation: noiseMove .25s steps(2) infinite;
}

.tracking-lines {
  position: fixed;
  left: 0;
  right: 0;
  top: -10%;
  height: 70px;
  pointer-events: none;
  z-index: 9995;
  opacity: 0;
  background:
    linear-gradient(
      180deg,
      transparent,
      rgba(255,255,255,.13),
      rgba(97,247,255,.08),
      transparent
    );
}

.tracking-active .tracking-lines {
  opacity: 1;
  animation: tracking 2.4s linear infinite;
}

.tracking-active .archive-shell {
  animation: tapeJitter .18s steps(2) infinite;
}

@keyframes noiseMove {
  0% {
    transform: translate(0,0);
  }

  25% {
    transform: translate(-2%,1%);
  }

  50% {
    transform: translate(1%,-2%);
  }

  75% {
    transform: translate(2%,2%);
  }

  100% {
    transform: translate(0,0);
  }
}

@keyframes tracking {
  from {
    transform: translateY(-10vh);
  }

  to {
    transform: translateY(110vh);
  }
}

@keyframes tapeJitter {
  0% {
    transform: translateX(0);
  }

  50% {
    transform: translateX(1px);
  }

  100% {
    transform: translateX(-1px);
  }
}

/* -------------------------------------------------------------------------- */
/* HEADER                                                                     */
/* -------------------------------------------------------------------------- */

.vhs-header {
  min-height: 62px;
  padding: 10px 18px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  border-bottom: 1px solid rgba(155,92,255,.35);
  background: rgba(4,2,10,.88);
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(8px);
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
  gap: 13px;
}

.header-right {
  justify-content: flex-end;
  font-family: "Orbitron", monospace;
  font-size: 9px;
  color: #737087;
}

.back-button,
.channel,
.rec-status {
  color: var(--cyan);
  font-size: 11px;
  letter-spacing: 1px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  color: var(--white);
  border: 1px solid rgba(255,255,255,.15);
  padding: 7px 9px;
}

.back-button:hover {
  border-color: var(--cyan);
  color: var(--cyan);
}

.channel {
  display: flex;
  gap: 5px;
  align-items: center;
}

.rec-status {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #ff4d71;
}

.rec-dot,
.blink-dot {
  width: 7px;
  height: 7px;
  background: #ff365e;
  border-radius: 50%;
  box-shadow: 0 0 9px #ff365e;
  animation: blink 1.1s steps(2) infinite;
}

.header-title {
  text-align: center;
  font-family: "Orbitron", monospace;
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 2px;
}

.header-title small {
  display: block;
  margin-top: 4px;
  color: #6d6686;
  font-size: 7px;
  letter-spacing: 2px;
}

@keyframes blink {
  50% {
    opacity: .25;
  }
}

/* -------------------------------------------------------------------------- */
/* SHELL                                                                      */
/* -------------------------------------------------------------------------- */

.archive-shell {
  width: min(1420px, calc(100% - 28px));
  margin: 0 auto;
  padding: 30px 0 80px;
}

/* -------------------------------------------------------------------------- */
/* HERO                                                                       */
/* -------------------------------------------------------------------------- */

.archive-hero {
  min-height: 510px;
  display: grid;
  grid-template-columns: 1.15fr .85fr;
  gap: 35px;
  align-items: center;
  border: 1px solid rgba(155,92,255,.28);
  padding: clamp(25px, 5vw, 70px);
  background:
    linear-gradient(
      135deg,
      rgba(29,15,63,.82),
      rgba(6,5,15,.94)
    );
  position: relative;
  overflow: hidden;
}

.archive-hero::before {
  content: "";
  position: absolute;
  width: 500px;
  height: 500px;
  right: -180px;
  top: -250px;
  border-radius: 50%;
  background: #a75cff;
  filter: blur(150px);
  opacity: .13;
}

.hero-copy {
  position: relative;
  z-index: 2;
}

.tiny-label {
  color: var(--cyan);
  font-size: 10px;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  gap: 7px;
}

.glitch-title {
  font-family: "Press Start 2P", monospace;
  font-size: clamp(29px, 5.4vw, 75px);
  line-height: 1.18;
  margin: 24px 0;
  color: white;
  position: relative;
  text-shadow:
    3px 0 var(--pink),
    -3px 0 var(--cyan),
    0 0 35px rgba(155,92,255,.45);
}

.glitch-enabled .glitch-title {
  animation: titleGlitch 4.5s infinite steps(1);
}

@keyframes titleGlitch {
  0%, 86%, 100% {
    transform: translateX(0);
  }

  87% {
    transform: translateX(-4px);
  }

  88% {
    transform: translateX(5px);
  }

  89% {
    transform: translateX(-2px);
  }
}

.hero-description {
  color: #aaa4bd;
  font-size: 18px;
  line-height: 1.6;
  letter-spacing: 1px;
}

.hero-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  margin-top: 28px;
}

.vcr-button {
  display: flex;
  align-items: center;
  gap: 7px;
  border: 1px solid rgba(97,247,255,.4);
  background: rgba(8,6,19,.8);
  color: var(--cyan);
  padding: 11px 13px;
  font-family: "Orbitron", monospace;
  font-size: 8px;
  letter-spacing: 1px;
  transition: .15s;
}

.vcr-button:hover {
  background: var(--cyan);
  color: #02070a;
  box-shadow: 0 0 22px rgba(97,247,255,.45);
  transform: translateY(-2px);
}

.play-button {
  border-color: var(--pink);
  color: var(--pink);
}

.play-button:hover {
  background: var(--pink);
  color: #10000b;
}

/* -------------------------------------------------------------------------- */
/* VHS PLAYER                                                                 */
/* -------------------------------------------------------------------------- */

.vhs-player {
  width: min(430px, 100%);
  margin: auto;
  background: #14101e;
  border: 2px solid #3b324f;
  padding: 12px;
  box-shadow:
    0 25px 70px rgba(0,0,0,.5),
    0 0 30px rgba(155,92,255,.13);
  transform: rotate(1.2deg);
}

.player-screen {
  height: 260px;
  position: relative;
  overflow: hidden;
  border: 5px solid #09070d;
  background:
    radial-gradient(
      circle at center,
      #23134b,
      #090612 70%
    );
  box-shadow:
    inset 0 0 35px rgba(0,0,0,.9);
}

.screen-grid {
  position: absolute;
  inset: 0;
  opacity: .25;
  background:
    linear-gradient(
      rgba(97,247,255,.1) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(255,60,172,.08) 1px,
      transparent 1px
    );
  background-size: 25px 25px;
}

.player-time {
  position: absolute;
  top: 14px;
  left: 15px;
  color: white;
  font-family: "VT323", monospace;
  font-size: 20px;
  text-shadow: 0 0 8px white;
}

.player-play {
  position: absolute;
  top: 15px;
  right: 15px;
  color: #777;
  font-size: 10px;
  font-family: "Orbitron", monospace;
}

.player-play.playing {
  color: #ff536c;
  text-shadow: 0 0 8px rgba(255,83,108,.7);
}

.player-label {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Press Start 2P", monospace;
  font-size: 18px;
  text-align: center;
  line-height: 1.5;
  color: white;
  text-shadow:
    2px 0 var(--pink),
    -2px 0 var(--cyan),
    0 0 20px rgba(255,255,255,.35);
}

.player-corner {
  position: absolute;
  bottom: 12px;
  left: 15px;
  right: 15px;
  display: flex;
  justify-content: space-between;
  font-family: "Orbitron", monospace;
  font-size: 8px;
  color: var(--cyan);
}

.player-deck {
  height: 90px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background:
    linear-gradient(
      180deg,
      #24202d,
      #0d0b11
    );
  border: 1px solid #37303f;
}

/* FIXED REELS
   They are children of .is-playing, so they spin ONLY while playback is on.
*/

.reel {
  width: 58px;
  height: 58px;
  border: 6px dotted #71657e;
  border-radius: 50%;
  display: grid;
  place-items: center;
  position: relative;
}

.is-playing .reel {
  animation: reelSpin .8s linear infinite;
}

.reel-spokes {
  position: absolute;
  inset: 8px;
  border-radius: 50%;
}

.reel-spokes span {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 2px;
  height: 18px;
  background: #8d8099;
  transform-origin: 50% 100%;
}

.reel-spokes span:nth-child(1) {
  transform: translate(-50%, -100%) rotate(0deg);
}

.reel-spokes span:nth-child(2) {
  transform: translate(-50%, -100%) rotate(90deg);
}

.reel-spokes span:nth-child(3) {
  transform: translate(-50%, -100%) rotate(180deg);
}

.reel-spokes span:nth-child(4) {
  transform: translate(-50%, -100%) rotate(270deg);
}

.reel-hole {
  width: 18px;
  height: 18px;
  background: #09070d;
  border-radius: 50%;
  border: 3px solid #6c6077;
  position: relative;
  z-index: 2;
}

@keyframes reelSpin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.deck-center {
  width: 100px;
  height: 48px;
  border: 1px solid #4b4054;
  display: grid;
  place-items: center;
  text-align: center;
}

.deck-label {
  font-family: "Orbitron", monospace;
  font-size: 7px;
  line-height: 1.5;
  color: #ffb5ea;
}

.deck-status {
  color: #5d536b;
  font-size: 7px;
}

.is-playing .deck-status {
  color: var(--green);
}

.deck-buttons {
  display: flex;
  justify-content: center;
  gap: 7px;
  margin-top: 10px;
}

.deck-buttons button {
  width: 38px;
  height: 28px;
  border: 1px solid #40364d;
  background: #09070d;
  color: #bcb3ca;
}

.deck-buttons button:hover {
  border-color: var(--cyan);
  color: var(--cyan);
}

/* -------------------------------------------------------------------------- */
/* CONTROL CONSOLE                                                            */
/* -------------------------------------------------------------------------- */

.control-console {
  margin-top: 20px;
  padding: 17px;
  border: 1px solid rgba(255,255,255,.12);
  background: rgba(11,7,22,.82);
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
}

.console-left,
.console-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.console-title {
  display: flex;
  align-items: center;
  gap: 7px;
  color: var(--pink);
  font-family: "Orbitron", monospace;
  font-size: 9px;
  margin-right: 10px;
}

.view-buttons,
.console-right {
  display: flex;
  gap: 5px;
}

.view-buttons button,
.toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid rgba(255,255,255,.12);
  background: #0a0711;
  color: #81798f;
  padding: 9px 10px;
  font-family: "Orbitron", monospace;
  font-size: 7px;
  letter-spacing: .5px;
}

.view-buttons button:hover,
.view-buttons button.active,
.toggle:hover,
.toggle.active {
  border-color: var(--purple);
  color: var(--white);
  background: rgba(155,92,255,.13);
}

.toggle.danger.active {
  border-color: #ff365e;
  color: #ff5472;
}

/* -------------------------------------------------------------------------- */
/* SEARCH                                                                     */
/* -------------------------------------------------------------------------- */

.archive-search {
  margin: 18px 0;
  min-height: 47px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(97,247,255,.25);
  background: rgba(3,3,9,.8);
  padding: 0 14px;
  color: var(--cyan);
}

.archive-search input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: white;
  font-family: "Share Tech Mono", monospace;
  font-size: 15px;
}

.archive-search input::placeholder {
  color: #565066;
}

.archive-search button {
  border: 0;
  background: transparent;
  color: #777;
}

.archive-search > span {
  font-size: 8px;
  color: #71687e;
}

/* -------------------------------------------------------------------------- */
/* HEADINGS                                                                   */
/* -------------------------------------------------------------------------- */

.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: end;
  margin: 65px 0 30px;
}

.section-heading h2 {
  font-family: "Orbitron", monospace;
  font-size: clamp(20px, 4vw, 38px);
  margin: 10px 0 0;
  letter-spacing: 1px;
}

.section-heading h2 span {
  color: var(--purple);
  font-size: .45em;
  margin-left: 10px;
}

.timeline-counter {
  font-family: "Press Start 2P", monospace;
  color: var(--cyan);
  font-size: 13px;
}

/* -------------------------------------------------------------------------- */
/* TIMELINE                                                                   */
/* -------------------------------------------------------------------------- */

.timeline {
  position: relative;
  padding: 20px 0 80px;
}

.timeline-line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  background:
    linear-gradient(
      180deg,
      transparent,
      var(--purple),
      var(--pink),
      var(--cyan),
      transparent
    );
  box-shadow: 0 0 15px rgba(155,92,255,.7);
}

.timeline-node {
  width: 50%;
  padding: 25px 55px;
  position: relative;
  cursor: pointer;
}

.node-left {
  left: 0;
  text-align: right;
}

.node-right {
  left: 50%;
}

.timeline-dot {
  position: absolute;
  top: 48px;
  width: 23px;
  height: 23px;
  border: 2px solid var(--purple);
  background: #080511;
  color: var(--cyan);
  display: grid;
  place-items: center;
  border-radius: 50%;
  z-index: 2;
  box-shadow: 0 0 15px rgba(155,92,255,.65);
}

.node-left .timeline-dot {
  right: -12px;
}

.node-right .timeline-dot {
  left: -12px;
}

.timeline-node:hover .timeline-dot,
.timeline-node.selected .timeline-dot {
  background: var(--cyan);
  color: #05030a;
  border-color: white;
  box-shadow: 0 0 25px var(--cyan);
}

.timeline-card {
  background:
    linear-gradient(
      135deg,
      rgba(24,14,43,.92),
      rgba(8,6,15,.95)
    );
  border: 1px solid rgba(155,92,255,.35);
  padding: 18px;
  position: relative;
  overflow: hidden;
  transition: .18s;
}

.timeline-card::after {
  content: "VHS";
  position: absolute;
  right: -18px;
  bottom: 8px;
  font-family: "Press Start 2P", monospace;
  font-size: 38px;
  color: rgba(255,255,255,.025);
  transform: rotate(-10deg);
}

.timeline-node:hover .timeline-card,
.timeline-node.selected .timeline-card {
  border-color: var(--cyan);
  box-shadow:
    0 0 25px rgba(97,247,255,.11),
    inset 0 0 25px rgba(155,92,255,.05);
  transform: translateY(-3px);
}

.tape-number {
  color: var(--pink);
  font-family: "Press Start 2P", monospace;
  font-size: 7px;
}

.timeline-year {
  font-family: "Orbitron", monospace;
  color: var(--cyan);
  font-size: 26px;
  font-weight: 800;
  margin-top: 12px;
}

.timeline-age {
  color: #70687c;
  font-size: 10px;
}

.timeline-card-title {
  color: white;
  font-family: "Orbitron", monospace;
  font-size: 13px;
  margin-top: 12px;
}

.timeline-card-status {
  color: var(--green);
  font-size: 9px;
  margin: 9px 0;
}

.timeline-preview {
  height: 150px;
  background: #08060e;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,.1);
}

.timeline-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(.85) contrast(1.08);
  transition: .25s;
}

.timeline-node:hover .timeline-preview img {
  transform: scale(1.04);
  filter:
    saturate(1.2)
    contrast(1.12);
}

.lost-footage {
  height: 100%;
  display: grid;
  place-items: center;
  color: #393344;
  font-family: "Press Start 2P", monospace;
  font-size: 8px;
  background:
    repeating-linear-gradient(
      0deg,
      #111 0px,
      #111 2px,
      #080808 2px,
      #080808 5px
    );
}

.timeline-open {
  color: var(--cyan);
  font-family: "Orbitron", monospace;
  font-size: 7px;
  margin-top: 12px;
}

/* -------------------------------------------------------------------------- */
/* CONTACT SHEET                                                              */
/* -------------------------------------------------------------------------- */

.contact-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.memory-tape {
  background: #0d0917;
  border: 1px solid rgba(155,92,255,.3);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: .18s;
}

.memory-tape:hover {
  transform: translateY(-5px) rotate(.4deg);
  border-color: var(--cyan);
  box-shadow:
    0 18px 40px rgba(0,0,0,.45),
    0 0 25px rgba(97,247,255,.1);
}

.tape-sticker {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 3;
  background: #f3e8c8;
  color: #171016;
  padding: 6px 8px;
  transform: rotate(-3deg);
  font-family: "Press Start 2P", monospace;
  font-size: 6px;
  box-shadow: 3px 4px 0 rgba(0,0,0,.4);
}

.memory-image {
  height: 260px;
  background: #08060e;
  position: relative;
  overflow: hidden;
}

.memory-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: .3s;
}

.memory-tape:hover .memory-image img {
  transform: scale(1.07);
  filter: saturate(1.15) contrast(1.08);
}

.image-static {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
  color: #4c4356;
}

.image-static span {
  font-family: "Press Start 2P", monospace;
  font-size: 7px;
}

.image-overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: white;
  background: rgba(0,0,0,.45);
  opacity: 0;
  transition: .15s;
}

.memory-tape:hover .image-overlay {
  opacity: 1;
}

.memory-info {
  padding: 15px;
}

.memory-date {
  color: var(--cyan);
  font-size: 9px;
}

.memory-info h3 {
  font-family: "Orbitron", monospace;
  font-size: 14px;
  margin: 8px 0;
}

.memory-info p {
  color: #898199;
  font-size: 13px;
  line-height: 1.4;
  margin: 0;
}

.memory-bottom {
  margin-top: 15px;
  padding-top: 11px;
  border-top: 1px solid rgba(255,255,255,.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #5e566c;
  font-size: 8px;
}

.heart {
  border: 0;
  background: transparent;
  color: #777;
}

.heart.active {
  color: var(--pink);
}

.empty-archive {
  min-height: 200px;
  border: 1px dashed rgba(97,247,255,.2);
  display: grid;
  place-items: center;
  color: #575064;
  font-family: "Press Start 2P", monospace;
  font-size: 9px;
  text-align: center;
}

/* -------------------------------------------------------------------------- */
/* 3D                                                                          */
/* -------------------------------------------------------------------------- */

.three-d-section {
  min-height: 600px;
}

/* -------------------------------------------------------------------------- */
/* FOOTER                                                                      */
/* -------------------------------------------------------------------------- */

.archive-footer-panel {
  margin-top: 70px;
  padding: 18px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 1px solid rgba(155,92,255,.25);
  background: rgba(9,6,18,.8);
}

.footer-stat {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  border-right: 1px solid rgba(255,255,255,.08);
}

.footer-stat:last-child {
  border-right: 0;
}

.footer-stat svg {
  color: var(--purple);
}

.footer-stat strong,
.footer-stat span {
  display: block;
}

.footer-stat strong {
  font-family: "Orbitron", monospace;
  color: white;
}

.footer-stat span {
  color: #676075;
  font-size: 7px;
  margin-top: 4px;
}

/* -------------------------------------------------------------------------- */
/* NAV                                                                         */
/* -------------------------------------------------------------------------- */

.bottom-navigation {
  margin-top: 25px;
  display: flex;
  justify-content: space-between;
  font-family: "Orbitron", monospace;
  font-size: 8px;
}

.bottom-navigation a,
.bottom-navigation button {
  color: #6d657c;
  text-decoration: none;
  background: transparent;
  border: 0;
}

.bottom-navigation a:hover,
.bottom-navigation button:hover {
  color: var(--cyan);
}

/* -------------------------------------------------------------------------- */
/* MODAL                                                                       */
/* -------------------------------------------------------------------------- */

.memory-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 5000;
  background: rgba(0,0,0,.82);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  backdrop-filter: blur(5px);
}

.memory-modal {
  width: min(900px, 100%);
  max-height: 94vh;
  overflow-y: auto;
  background: #090611;
  border: 1px solid var(--purple);
  box-shadow:
    0 0 40px rgba(155,92,255,.25),
    0 30px 100px black;
}

.modal-topbar {
  min-height: 45px;
  padding: 0 13px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--cyan);
  border-bottom: 1px solid rgba(155,92,255,.25);
  font-family: "Orbitron", monospace;
  font-size: 8px;
}

.modal-topbar button {
  color: #aaa;
  background: transparent;
  border: 0;
}

.modal-topbar button:hover {
  color: var(--pink);
}

.modal-screen {
  height: min(62vh, 560px);
  background: #030207;
  position: relative;
  overflow: hidden;
}

.modal-screen img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #030207;
}

.modal-scan {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    repeating-linear-gradient(
      0deg,
      transparent 0,
      transparent 4px,
      rgba(255,255,255,.05) 5px
    );
}

.modal-timecode {
  position: absolute;
  top: 15px;
  left: 15px;
  color: white;
  font-family: "VT323", monospace;
  font-size: 19px;
  text-shadow: 0 0 10px black;
}

.modal-no-signal {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 12px;
  color: #5d536a;
  font-family: "Press Start 2P", monospace;
  font-size: 10px;
}

.modal-no-signal small {
  color: #37313e;
  font-family: "Share Tech Mono", monospace;
}

.modal-details {
  padding: 22px;
}

.modal-tape {
  display: flex;
  justify-content: space-between;
  color: var(--pink);
  font-family: "Orbitron", monospace;
  font-size: 8px;
}

.modal-details h2 {
  font-family: "Orbitron", monospace;
  margin: 13px 0 7px;
  font-size: 24px;
}

.modal-details p {
  color: #938b9f;
  line-height: 1.5;
}

.modal-controls {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
  margin-top: 18px;
}

.modal-controls button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  border: 1px solid #3a3047;
  background: #0d0915;
  color: #aaa0b5;
  font-family: "Orbitron", monospace;
  font-size: 8px;
}

.modal-controls button:hover,
.modal-controls .modal-play {
  border-color: var(--cyan);
  color: var(--cyan);
}

.memory-audio {
  width: 100%;
  margin-top: 18px;
}

/* -------------------------------------------------------------------------- */
/* KEYBOARD                                                                    */
/* -------------------------------------------------------------------------- */

.keyboard-hint {
  position: fixed;
  bottom: 9px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 60;
  color: #494252;
  font-family: "Orbitron", monospace;
  font-size: 7px;
  pointer-events: none;
}

/* -------------------------------------------------------------------------- */
/* RESPONSIVE                                                                  */
/* -------------------------------------------------------------------------- */

@media (max-width: 900px) {
  .vhs-header {
    grid-template-columns: 1fr auto;
  }

  .header-title {
    display: none;
  }

  .archive-hero {
    grid-template-columns: 1fr;
  }

  .vhs-player {
    transform: none;
  }

  .control-console {
    flex-direction: column;
    align-items: stretch;
  }

  .console-left,
  .console-right {
    justify-content: center;
  }

  .contact-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .timeline-node {
    width: 100%;
    left: 0 !important;
    text-align: left;
    padding-left: 55px;
    padding-right: 10px;
  }

  .timeline-line {
    left: 15px;
  }

  .node-left .timeline-dot,
  .node-right .timeline-dot {
    left: 4px;
    right: auto;
  }

  .archive-footer-panel {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .footer-stat:nth-child(2) {
    border-right: 0;
  }
}

@media (max-width: 600px) {
  .archive-shell {
    width: min(100% - 16px, 1420px);
    padding-top: 12px;
  }

  .archive-hero {
    padding: 25px 17px;
  }

  .glitch-title {
    font-size: 26px;
  }

  .hero-description {
    font-size: 15px;
  }

  .contact-grid {
    grid-template-columns: 1fr;
  }

  .timeline-card {
    padding: 14px;
  }

  .timeline-preview {
    height: 180px;
  }

  .archive-footer-panel {
    grid-template-columns: 1fr;
  }

  .footer-stat {
    border-right: 0;
    border-bottom: 1px solid rgba(255,255,255,.08);
    padding: 12px;
  }

  .footer-stat:last-child {
    border-bottom: 0;
  }

  .header-right {
    display: none;
  }

  .keyboard-hint {
    display: none;
  }

  .deck-center {
    width: 75px;
  }

  .reel {
    width: 50px;
    height: 50px;
  }

  .reel-spokes {
    inset: 6px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: .01ms !important;
  }
}
`;
