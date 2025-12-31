import { forwardRef, InputHTMLAttributes, useState } from 'react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, type = 'text', className = '', ...props }, ref) => {
        const [isPasswordVisible, setIsPasswordVisible] = useState(false);

        const isPassword = type === 'password';
        const inputType = isPassword ? (isPasswordVisible ? 'text' : 'password') : type;

        return (
            <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
                <div className="relative">
                    <input
                        ref={ref}
                        type={inputType}
                        className={`w-full px-4 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200
            ${error ? 'border-red-500 ring-red-500/20' : 'border-gray-300 focus:border-indigo-500'}
            ${className} ${isPassword ? 'pr-10' : ''}`}
                        {...props}
                    />
                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-indigo-600 cursor-pointer"
                        >
                            {isPasswordVisible ? (
                                <MdVisibilityOff size={20} />
                            ) : (
                                <MdVisibility size={20} />
                            )}
                        </button>
                    )}
                </div>
                {error && (
                    <span className="text-xs text-red-500 mt-1">{error}</span>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
