import React, {
  HTMLProps,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import CustomOption from "./option";

export type OptionType<T> = {
  value: T;
  label: string;
  disabled: boolean;
};

type CustomSelectProps<T> = {
  /**
   * The value of the select.
   */
  value: T;
  /**
   * A callback triggered whenever the value of the select changes.
   */
  onChange: (value: T) => void;
  /**
   * The options to display in the select.
   *
   * Format - [{value: [value, label], disabled: boolean}, ...]
   */
  options: OptionType<T>[];
  /**
   * If this input element is disabled
   */
  disabled?: boolean;
  /**
   * How to format the display value
   */
  formatValue?: (value: T) => string;
} & Omit<
  PropsWithChildren<HTMLProps<HTMLDivElement>>,
  "onChange" | "value" | "disabled"
>;

/**
 * A custom select component.
 *
 */
function CustomSelect<T>({
  value,
  options,
  onChange,
  className,
  disabled,
  formatValue,
}: CustomSelectProps<T>): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openOptionsDropdown = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  const closeOptionsDropdown = () => {
    setIsOpen(false);
  };

  const handleOptionSelect = (v: any) => {
    onChange(v);
    closeOptionsDropdown();
  };

  const showDropDown = useMemo(() => isOpen && !disabled, [isOpen, disabled]);

  const displayValue = useMemo(
    () => <>{formatValue?.(value) ?? value}</>,
    [formatValue, value]
  );

  useEffect(() => {
    const clickListener = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        closeOptionsDropdown();
      }
    };

    const focusOutListener = (e: FocusEvent) => {
      // if (!ref.current?.contains(e.relatedTarget as Node)) {
      //   closeOptionsDropdown();
      // }
    };

    document.addEventListener("click", clickListener);
    ref.current?.addEventListener("focusout", focusOutListener);

    return () => {
      document.removeEventListener("click", clickListener);
      ref.current?.removeEventListener("focusout", focusOutListener);
    };
  }, [closeOptionsDropdown, ref.current]); //

  return (
    <div
      tabIndex={-1}
      className={`sassy--select__container ${className ?? ""}`}
      ref={ref}
    >
      <p
        className={`sassy--select ${disabled ? "sassy--select__disabled" : ""}`}
        tabIndex={disabled ? -1 : 0}
        style={{
          cursor: "pointer !important"
        }}
        onClick={openOptionsDropdown}
        //onFocus={openOptionsDropdown}
      >
        {displayValue}
      </p>
      {showDropDown && (
        <div className="sassy--select__dropdown">
          {options.map(({ value: currValue, label, disabled }) => (
            <CustomOption
              key={label}
              label={label}
              selected={value === currValue}
              value={currValue}
              disabled={disabled}
              onClick={handleOptionSelect}
              aria-label={`Select ${label}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomSelect;
