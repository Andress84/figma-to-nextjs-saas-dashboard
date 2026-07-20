"use client";

import { CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, Info } from "lucide-react";
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import {
  REPORTING_CALENDAR_MONTHS,
  REPORTING_PERIOD,
  REPORTING_PERIOD_PRESET,
} from "@/data/mock/reporting";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

interface PopoverPosition {
  readonly bottom?: number;
  readonly left: number;
  readonly maxHeight: number;
  readonly top?: number;
}

type ReportingCalendarMonth = (typeof REPORTING_CALENDAR_MONTHS)[number];

function cssPixelValue(propertyName: string, fallback: number) {
  const value = Number.parseFloat(
    window.getComputedStyle(document.documentElement).getPropertyValue(propertyName),
  );

  return Number.isFinite(value) ? value : fallback;
}

function isDateSelected(month: ReportingCalendarMonth, day: number) {
  return month.monthNumber === "06" ? day >= 15 : day <= 14;
}

function selectedDateDescription(month: ReportingCalendarMonth, day: number) {
  if (month.monthNumber === "06" && day === 15) {
    return ", start of selected reporting period";
  }

  if (month.monthNumber === "07" && day === 14) {
    return ", end of selected reporting period";
  }

  return isDateSelected(month, day) ? ", within selected reporting period" : "";
}

function ReportingCalendar({
  isMobileActive,
  month,
}: Readonly<{ isMobileActive: boolean; month: ReportingCalendarMonth }>) {
  const monthHeadingId = `${month.id}-heading`;
  const emptyDays = Array.from({ length: month.leadingEmptyDays }, (_, index) => index);
  const monthDays = Array.from({ length: month.daysInMonth }, (_, index) => index + 1);

  return (
    <section
      className="reporting-calendar-month"
      data-mobile-active={isMobileActive}
      aria-labelledby={monthHeadingId}
    >
      <h3 id={monthHeadingId}>{month.label}</h3>
      <div className="reporting-calendar-weekdays" aria-hidden="true">
        {WEEKDAY_LABELS.map((weekday) => (
          <span key={weekday}>{weekday}</span>
        ))}
      </div>
      <ol className="reporting-calendar-days" aria-label={`${month.label} dates`}>
        {emptyDays.map((emptyDay) => (
          <li
            key={`empty-${emptyDay}`}
            className="reporting-calendar-empty-day"
            aria-hidden="true"
          />
        ))}
        {monthDays.map((day) => {
          const isSelected = isDateSelected(month, day);
          const isRangeStart = month.monthNumber === "06" && day === 15;
          const isRangeEnd = month.monthNumber === "07" && day === 14;
          const paddedDay = String(day).padStart(2, "0");

          return (
            <li key={day}>
              <time
                className="reporting-calendar-day"
                dateTime={`2026-${month.monthNumber}-${paddedDay}`}
                data-selected={isSelected || undefined}
                data-range-start={isRangeStart || undefined}
                data-range-end={isRangeEnd || undefined}
                aria-label={`${month.monthName} ${day}, 2026${selectedDateDescription(month, day)}`}
              >
                {day}
              </time>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export function ReportingPeriodPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileMonthIndex, setMobileMonthIndex] = useState(0);
  const [popoverPosition, setPopoverPosition] = useState<PopoverPosition | null>(null);
  const generatedId = useId();
  const popoverId = `${generatedId}-reporting-period`;
  const headingId = `${generatedId}-heading`;
  const summaryId = `${generatedId}-summary`;
  const noteId = `${generatedId}-note`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    triggerRef.current?.setAttribute("data-reporting-period-ready", "true");
  }, []);

  const closeAndRestoreFocus = useCallback(() => {
    setIsOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    function updatePopoverPosition() {
      const trigger = triggerRef.current;
      const popover = popoverRef.current;

      if (!trigger || !popover) {
        return;
      }

      const anchorGap = cssPixelValue("--space-2", 8);
      const viewportMargin = cssPixelValue("--space-4", 16);
      const triggerBounds = trigger.getBoundingClientRect();
      const popoverWidth = popover.getBoundingClientRect().width;
      const fullPopoverHeight = popover.scrollHeight;
      const availableBelow = Math.max(
        0,
        window.innerHeight - triggerBounds.bottom - anchorGap - viewportMargin,
      );
      const availableAbove = Math.max(0, triggerBounds.top - anchorGap - viewportMargin);
      const opensAbove = availableBelow < fullPopoverHeight && availableAbove > availableBelow;
      const availableHeight = opensAbove ? availableAbove : availableBelow;
      const maximumLeft = Math.max(
        viewportMargin,
        window.innerWidth - popoverWidth - viewportMargin,
      );
      const left = Math.min(
        Math.max(triggerBounds.right - popoverWidth, viewportMargin),
        maximumLeft,
      );

      setPopoverPosition({
        bottom: opensAbove ? window.innerHeight - triggerBounds.top + anchorGap : undefined,
        left,
        maxHeight: availableHeight,
        top: opensAbove ? undefined : triggerBounds.bottom + anchorGap,
      });
    }

    updatePopoverPosition();
    window.addEventListener("resize", updatePopoverPosition);
    window.addEventListener("scroll", updatePopoverPosition, true);

    return () => {
      window.removeEventListener("resize", updatePopoverPosition);
      window.removeEventListener("scroll", updatePopoverPosition, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    headingRef.current?.focus();

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;

      if (
        target instanceof Node &&
        !popoverRef.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        closeAndRestoreFocus();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeAndRestoreFocus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeAndRestoreFocus, isOpen]);

  function togglePopover() {
    setIsOpen((currentIsOpen) => {
      if (!currentIsOpen) {
        setMobileMonthIndex(0);
        setPopoverPosition(null);
      }

      return !currentIsOpen;
    });
  }

  const positionStyle: CSSProperties = {
    bottom: popoverPosition?.bottom,
    left: popoverPosition?.left,
    maxHeight: popoverPosition?.maxHeight,
    top: popoverPosition?.top,
    visibility: popoverPosition ? "visible" : "hidden",
  };

  return (
    <div className="reporting-period-control">
      <button
        ref={triggerRef}
        className="reporting-period-trigger"
        type="button"
        aria-label={`Reporting period: ${REPORTING_PERIOD.displayLabel}`}
        aria-controls={popoverId}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={togglePopover}
      >
        <CalendarDays size={17} strokeWidth={1.8} aria-hidden="true" />
        <span>{REPORTING_PERIOD.displayLabel}</span>
        <ChevronDown
          className="reporting-period-trigger-chevron"
          size={16}
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </button>

      {isOpen ? (
        <div
          ref={popoverRef}
          className="reporting-period-popover"
          id={popoverId}
          role="dialog"
          aria-labelledby={headingId}
          aria-describedby={`${summaryId} ${noteId}`}
          style={positionStyle}
        >
          <header className="reporting-period-popover-header">
            <div>
              <h2 ref={headingRef} id={headingId} tabIndex={-1}>
                Reporting period
              </h2>
              <p id={summaryId}>Current approved range: {REPORTING_PERIOD.displayLabel}</p>
            </div>
            <span
              className="reporting-period-preset"
              aria-label={`${REPORTING_PERIOD_PRESET} preset, active`}
            >
              <Check size={14} strokeWidth={2} aria-hidden="true" />
              <span>{REPORTING_PERIOD_PRESET}</span>
              <strong>Active</strong>
            </span>
          </header>

          <div
            className="reporting-period-mobile-navigation"
            aria-label="Calendar month navigation"
          >
            <IconButton
              label="Show previous month"
              size="compact"
              variant="ghost"
              disabled={mobileMonthIndex === 0}
              onClick={() => setMobileMonthIndex(0)}
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </IconButton>
            <span className="sr-only" aria-live="polite">
              Showing {REPORTING_CALENDAR_MONTHS[mobileMonthIndex].label}
            </span>
            <IconButton
              label="Show next month"
              size="compact"
              variant="ghost"
              disabled={mobileMonthIndex === REPORTING_CALENDAR_MONTHS.length - 1}
              onClick={() => setMobileMonthIndex(1)}
            >
              <ChevronRight size={18} aria-hidden="true" />
            </IconButton>
          </div>

          <div className="reporting-period-calendars">
            {REPORTING_CALENDAR_MONTHS.map((month, index) => (
              <ReportingCalendar
                key={month.id}
                month={month}
                isMobileActive={index === mobileMonthIndex}
              />
            ))}
          </div>

          <p className="reporting-period-selection">
            <span aria-hidden="true" />
            Selected range: {REPORTING_PERIOD.displayLabel}
          </p>

          <footer className="reporting-period-popover-footer">
            <p id={noteId}>
              <Info size={16} aria-hidden="true" />
              <span>
                <strong>Static demo snapshot</strong>
                Dashboard totals stay fixed to the approved reporting period.
              </span>
            </p>
            <Button variant="secondary" onClick={closeAndRestoreFocus}>
              Done
            </Button>
          </footer>
        </div>
      ) : null}
    </div>
  );
}
