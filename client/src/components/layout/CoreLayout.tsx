"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
  SidebarLogo,
  SidebarNewChat,
  SidebarWalletConnect,
  useSidebar,
} from "@/components/ui/sidebar";
import { IconLayout, IconTool, IconMessage } from "@tabler/icons-react";
import { useAppKitAccount } from "@reown/appkit/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface ChatPreview {
  threadId: string;
  title: string;
}

const RecentChats = () => {
  const { open } = useSidebar();
  const { address, isConnected } = useAppKitAccount();
  const [recentChats, setRecentChats] = useState<ChatPreview[]>([]);

  const fetchChats = () => {
    if (isConnected && address) {
      fetch(`${API_URL}/chats/${address}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setRecentChats(data.slice(0, 5));
          }
        })
        .catch(console.error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [address, isConnected]);

  // Listen for chat updates
  useEffect(() => {
    const handleChatUpdate = () => fetchChats();
    window.addEventListener("chat-updated", handleChatUpdate);
    return () => window.removeEventListener("chat-updated", handleChatUpdate);
  }, [address, isConnected]);

  // Hide when collapsed or no chats
  if (!open || !isConnected || recentChats.length === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t border-neutral-200">
      <p className="text-xs text-neutral-500 px-2 mb-2">Recent Chats</p>
      <div className="flex flex-col gap-1">
        {recentChats.map((chat) => (
          <Link
            key={chat.threadId}
            href={`/chat/${chat.threadId}`}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-700 text-sm truncate"
          >
            <IconMessage className="h-4 w-4 shrink-0 text-neutral-400" />
            <span className="truncate">{chat.title || "New Chat"}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

const CoreLayout = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleNewChat = () => {
    router.push("/");
  };

  const links = [
    {
      label: "Explore",
      href: "/explore",
      icon: <IconTool className="h-5 w-5" />,
    },
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <IconLayout className="h-5 w-5" />,
    },
    {
      label: "Chats",
      href: "/chats",
      icon: <IconMessage className="h-5 w-5" />,
    },
  ];

  return (
    <div className="w-full h-screen flex">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="h-full justify-between">
          <div className="flex flex-col flex-1 overflow-hidden">
            <SidebarLogo />
            <SidebarNewChat className="" onClick={handleNewChat} />
            <div className="flex flex-col gap-2 mt-4">
              {links.map((link) => (
                <SidebarLink key={link.href} link={link} />
              ))}
            </div>
            <RecentChats />
          </div>
          <SidebarWalletConnect />
        </SidebarBody>
      </Sidebar>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
};

export default CoreLayout;
