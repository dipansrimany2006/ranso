import { ReactNode } from "react";

interface ChatStartProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const ChatStart = ({ icon, title, description }: ChatStartProps) => {
  return (
    <div className="w-full p-4 rounded-xl bg-neutral-100 space-y-2 border">
      <div className="w-6 aspect-square">{icon}</div>
      <div className="text-lg font-semibold">{title}</div>
      <div className="text-sm text-neutral-600">{description}</div>
    </div>
  );
};

export default ChatStart;
