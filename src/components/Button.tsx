import type { PropsWithChildren } from "react";

type ButtonProps = PropsWithChildren & {
  className: string;
};

export default function Button({ className, children }: ButtonProps) {
  return (
    <button
      className={`${className} rounded-md bg-zinc-800 px-2 py-2 outline-none duration-200 ease-in-out hover:text-gray-300 hover:transition focus:ring-1 focus:ring-gray-500 focus:ring-offset-1 focus:ring-offset-stone-800`}
    >
      {children}
    </button>
  );
}
