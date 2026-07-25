import React, { useState, useRef, useEffect } from 'react';
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const DateRangePicker = ({ startDate, endDate, onChange, theme }) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ left: 0, top: 0 });
  const ref = useRef(null);
  const t = theme || {};

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const label = startDate
    ? `${format(startDate, 'MMM d, yyyy')} — ${format(endDate || startDate, 'MMM d, yyyy')}`
    : 'Select date range';

  const ranges = [{
    startDate: startDate || new Date(),
    endDate: endDate || startDate || new Date(),
    key: 'selection',
  }];

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => {
          if (!open && ref.current) {
            const btn = ref.current.querySelector('button') || ref.current;
            const rect = btn.getBoundingClientRect();
            const calW = 340;
            const spaceRight = window.innerWidth - rect.left;
            const spaceBelow = window.innerHeight - rect.bottom;
            const left = spaceRight < calW ? Math.max(4, rect.right - calW) - rect.left : 0;
            setPos({
              left,
              top: spaceBelow < 380 ? -(spaceBelow - 8) : rect.height + 6,
            });
          }
          setOpen(!open);
        }}
        style={{
          padding: "0 12px",
          borderRadius: "8px",
          border: `1.5px solid ${t.border || '#e5e7eb'}`,
          backgroundColor: t.bgPrimary || '#fff',
          color: startDate ? (t.textPrimary || '#111827') : (t.textTertiary || '#9ca3af'),
          fontSize: "12px",
          fontWeight: "500",
          height: "34px",
          cursor: "pointer",
          fontFamily: "inherit",
          whiteSpace: "nowrap",
          minWidth: "140px",
          textAlign: "left",
        }}
      >
        {label}
      </button>

      {open && (
        <div
          className="rdrDateRangeWrapper"
          style={{
            position: 'absolute',
            top: pos.top,
            left: pos.left,
            zIndex: 9999,
            borderRadius: '14px',
            overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            border: `1.5px solid ${t.border || '#e5e7eb'}`,
          }}
        >
          <DateRange
            editableDateInputs
            onChange={(item) => {
              onChange([item.selection.startDate, item.selection.endDate]);
            }}
            moveRangeOnFirstSelection={false}
            ranges={ranges}
            months={1}
            direction="horizontal"
            showDateDisplay={false}
            showMonthAndYearPickers={false}
            rangeColors={['#6366f1']}
          />
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
