"use client";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  className?: string;
  children: React.ReactNode;
};

export default function SubmitButton({
  children,
  className,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className={className}>
      {pending ? (
        <span className="font-bold text-sm text-white animate-pulse">
          Loading...
        </span>
      ) : (
        <>{children}</>
      )}
    </button>
  );
}
