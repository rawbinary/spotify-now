import type { MouseEventHandler, PropsWithChildren } from "react";

type ButtonProps = PropsWithChildren & {
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export default function Button({
  className = "",
  onClick,
  children,
}: ButtonProps) {
  return (
    <button
      className={`${className} rounded-md bg-zinc-800 px-2 py-2 outline-none duration-200 ease-in-out hover:text-gray-300 hover:transition focus:ring-1 focus:ring-gray-500 focus:ring-offset-1 focus:ring-offset-stone-800`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
