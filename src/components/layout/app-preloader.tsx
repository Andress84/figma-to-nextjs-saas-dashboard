"use client";

import { useEffect, useRef, useState } from "react";

const MIN_VISIBLE_TIME_MS = 700;
const COMPLETION_DURATION_MS = 280;
const EXIT_DELAY_MS = 140;
const EXIT_DURATION_MS = 620;
const MAX_READY_WAIT_MS = 4_000;

const RING_RADIUS = 88;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

type PreloaderPhase = "loading" | "complete" | "exiting";

function waitForWindowLoad() {
  if (document.readyState === "complete") {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    window.addEventListener("load", () => resolve(), { once: true });
  });
}

async function waitForDocumentFonts() {
  if ("fonts" in document) {
    await document.fonts.ready;
  }
}

async function waitForDocumentImages() {
  const imagePromises = Array.from(document.images).map(async (image) => {
    if (!image.complete) {
      await new Promise<void>((resolve) => {
        const finish = () => resolve();

        image.addEventListener("load", finish, { once: true });
        image.addEventListener("error", finish, { once: true });
      });
    }

    if (typeof image.decode === "function") {
      await image.decode().catch(() => undefined);
    }
  });

  await Promise.all(imagePromises);
}

async function waitForPageReadiness() {
  const readiness = Promise.all([
    waitForWindowLoad(),
    waitForDocumentFonts(),
    waitForDocumentImages(),
  ]).then(() => undefined);

  const timeout = new Promise<void>((resolve) => {
    window.setTimeout(resolve, MAX_READY_WAIT_MS);
  });

  await Promise.race([readiness, timeout]);
}

function calculateLoadingProgress(elapsedTime: number) {
  const easedProgress = 8 + 84 * (1 - Math.exp(-elapsedTime / 700));

  return Math.min(92, Math.round(easedProgress));
}

function easeOutCubic(value: number) {
  return 1 - (1 - value) ** 3;
}

export function AppPreloader() {
  const [isVisible, setIsVisible] = useState(true);
  const [phase, setPhase] = useState<PreloaderPhase>("loading");
  const [progress, setProgress] = useState(0);

  const progressRef = useRef(0);

  useEffect(() => {
    let animationFrameId = 0;
    let exitTimerId = 0;
    let removalTimerId = 0;
    let isCancelled = false;
    let isPageReady = false;
    let completionStartedAt: number | null = null;
    let completionStartProgress = 0;

    const startedAt = performance.now();
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const prefersReducedMotion = reducedMotionQuery.matches;

    document.body.classList.add("app-preloader-active");
    document.body.setAttribute("aria-busy", "true");

    function updateProgress(nextProgress: number) {
      const normalizedProgress = Math.min(100, Math.max(progressRef.current, nextProgress));

      if (normalizedProgress === progressRef.current) {
        return;
      }

      progressRef.current = normalizedProgress;
      setProgress(normalizedProgress);
    }

    function finishPreloader() {
      updateProgress(100);
      setPhase("complete");

      exitTimerId = window.setTimeout(
        () => {
          setPhase("exiting");
          document.body.classList.remove("app-preloader-active");
          document.body.removeAttribute("aria-busy");

          removalTimerId = window.setTimeout(
            () => setIsVisible(false),
            prefersReducedMotion ? 0 : EXIT_DURATION_MS,
          );
        },
        prefersReducedMotion ? 0 : EXIT_DELAY_MS,
      );
    }

    function animate(currentTime: number) {
      if (isCancelled) {
        return;
      }

      const elapsedTime = currentTime - startedAt;

      if (!isPageReady || elapsedTime < MIN_VISIBLE_TIME_MS) {
        updateProgress(calculateLoadingProgress(elapsedTime));
        animationFrameId = window.requestAnimationFrame(animate);
        return;
      }

      if (prefersReducedMotion) {
        finishPreloader();
        return;
      }

      if (completionStartedAt === null) {
        completionStartedAt = currentTime;
        completionStartProgress = progressRef.current;
      }

      const completionElapsedTime = currentTime - completionStartedAt;
      const completionRatio = Math.min(1, completionElapsedTime / COMPLETION_DURATION_MS);

      const nextProgress = Math.round(
        completionStartProgress + (100 - completionStartProgress) * easeOutCubic(completionRatio),
      );

      updateProgress(nextProgress);

      if (completionRatio >= 1) {
        finishPreloader();
        return;
      }

      animationFrameId = window.requestAnimationFrame(animate);
    }

    void waitForPageReadiness().then(() => {
      isPageReady = true;
    });

    animationFrameId = window.requestAnimationFrame(animate);

    return () => {
      isCancelled = true;

      window.cancelAnimationFrame(animationFrameId);
      window.clearTimeout(exitTimerId);
      window.clearTimeout(removalTimerId);

      document.body.classList.remove("app-preloader-active");
      document.body.removeAttribute("aria-busy");
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  const strokeDashOffset = RING_CIRCUMFERENCE * (1 - progress / 100);

  return (
    <div className="app-preloader" data-phase={phase}>
      <div className="app-preloader__content">
        <div
          className="app-preloader__indicator"
          role="progressbar"
          aria-label="Loading Subtera dashboard"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <svg className="app-preloader__ring" viewBox="0 0 200 200" aria-hidden="true">
            <circle className="app-preloader__ring-track" cx="100" cy="100" r={RING_RADIUS} />

            <circle
              className="app-preloader__ring-progress"
              cx="100"
              cy="100"
              r={RING_RADIUS}
              style={{
                strokeDasharray: RING_CIRCUMFERENCE,
                strokeDashoffset: strokeDashOffset,
              }}
            />
          </svg>

          <span className="app-preloader__percentage tabular-nums" aria-hidden="true">
            {progress}%
          </span>
        </div>

        <p className="app-preloader__label">Loading</p>
      </div>
    </div>
  );
}
