import React, { useState, useRef, useEffect } from 'react';
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const DateRangePicker = ({ startDate, endDate, onChange, theme }) => {
  const [open, setOpen] = useState(false);
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
        onClick={() => setOpen(!open)}
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
            top: 'calc(100% + 6px)',
            left: 0,
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
            months={2}
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
