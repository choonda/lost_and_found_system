import React from "react";
type InputFieldProps = React.HTMLAttributes<HTMLInputElement> & {
  label: string;
  placeholder: string;
  error?: string;
};
const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, placeholder, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        <div>
          <label className="text-md font-bold text-[#969DA3]">{label}</label>
        </div>
        <div className="w-full  bg-[#E6F6F4] rounded-md">
          <input
            ref={ref}
            {...props}
            className={`w-full h-fit px-4 py-2 focus:ring-[#b0e4dd] focus:ring-2 focus:outline-none transition-all duration-200 `}
            placeholder={`Enter ${placeholder}`}
          />
        </div>
        {error && <p className="ml-2 text-red-500 text-sm">{error}</p>}
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;
