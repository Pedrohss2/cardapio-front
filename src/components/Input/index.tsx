import { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
                <input
                    ref={ref}
                    className={`w-full px-4 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200
            ${error ? 'border-error ring-error/20' : 'border-border focus:border-primary'}
            ${className}`}
                    {...props}
                />
                {error && (
                    <span className="text-xs text-error mt-1">{error}</span>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
