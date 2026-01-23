"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar, SidebarBody, SidebarLink, SidebarLogo, SidebarNewChat } from "@/components/ui/sidebar";
import { IconSettings, IconLayout, IconTool } from "@tabler/icons-react";

const CoreLayout = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleNewChat = () => {
    router.push("/chat");
  };

  const links = [
    { label: "Explore", href: "/explore", icon: <IconTool className="h-5 w-5" /> },
    { label: "Dashboard", href: "/dashboard", icon: <IconLayout className="h-5 w-5" /> },
    { label: "Settings", href: "/settings", icon: <IconSettings className="h-5 w-5" /> },
  ];

  return (
    <div className="w-full h-screen flex">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="h-full">
          <SidebarLogo />
          <SidebarNewChat className="mb-4" onClick={handleNewChat} />
          <div className="flex flex-col gap-2 mt-4">
            {links.map((link) => (
              <SidebarLink key={link.href} link={link} />
            ))}
          </div>
        </SidebarBody>
      </Sidebar>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default CoreLayout;
