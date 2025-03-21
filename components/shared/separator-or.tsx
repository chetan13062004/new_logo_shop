import { ReactNode } from 'react';

const SeparatorWithOr = ({ children }: { children?: ReactNode }) => {
  return (
    <div className="relative flex items-center my-5 w-full">
      <div className="flex-grow border-t border-gray-300"></div>
      <span className="px-2 bg-white text-gray-500">{children ?? 'or'}</span>
      <div className="flex-grow border-t border-gray-300"></div>
    </div>
  );
};

export default SeparatorWithOr;
