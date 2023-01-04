import { Icon } from "@avsync.live/formation";
import type { SidebarButtons } from "components/system/StartMenu/Sidebar/SidebarButton";
import SidebarButton from "components/system/StartMenu/Sidebar/SidebarButton";
import {
  AllApps,
  Documents,
  Pictures,
  Power,
  SideMenu,
  Videos,
} from "components/system/StartMenu/Sidebar/SidebarIcons";
import StyledSidebar from "components/system/StartMenu/Sidebar/StyledSidebar";
import { useFileSystem } from "contexts/fileSystem";
import { resetStorage } from "contexts/fileSystem/functions";
import { useProcesses } from "contexts/process";
import { useSession } from "contexts/session";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "styled-components";
import { HOME, TASKBAR_HEIGHT } from "utils/constants";
import { haltEvent, viewHeight } from "utils/functions";

type SidebarGroupProps = {
  sidebarButtons: SidebarButtons;
};

const SidebarGroup: FC<SidebarGroupProps> = ({ sidebarButtons }) => (
  <ol>
    {sidebarButtons.map((button) => (
      <SidebarButton key={button.name} {...button} />
    ))}
  </ol>
);

type SidebarProps = {
  height?: string;
};

const Sidebar: FC<SidebarProps> = ({ height }) => {
  const { rootFs } = useFileSystem();
  const { open } = useProcesses();
  const { setHaltSession } = useSession();
  const [collapsed, setCollapsed] = useState(true);
  const expandTimer = useRef<number>();
  const clearTimer = (): void => {
    if (expandTimer.current) clearTimeout(expandTimer.current);
  };
  const topButtons: SidebarButtons = [
    // {
    //   action: () =>
    //     document.body.requestFullscreen(),
    //   icon: <Icon icon='expand' iconPrefix='fas' />,
    //   name: "Fullscreen",
    //   ...(collapsed && { tooltip: "Enter fullscreen" }),
    // },
  ];
  const { sizes } = useTheme();
  const vh = viewHeight();
  const buttonAreaCount = useMemo(
    () => Math.floor((vh - TASKBAR_HEIGHT) / sizes.startMenu.sideBar.width),
    [sizes.startMenu.sideBar.width, vh]
  );

  const bottomButtons = [
    buttonAreaCount > 3
      ? {
          action: () =>
            open(
              "FileExplorer",
              { url: `${HOME}/Documents` },
              "/System/Icons/documents.webp"
            ),
          icon: <Icon icon='file' iconPrefix='far' />,
          name: "Documents",
          ...(collapsed && { tooltip: "Documents" }),
        }
      : undefined,
    buttonAreaCount > 4
      ? {
          action: () =>
            open(
              "FileExplorer",
              { url: `${HOME}/Music` },
              "/System/Icons/music.webp"
            ),
          icon: <Icon icon='music' iconPrefix='fas' />,
          name: "Music",
          ...(collapsed && { tooltip: "Music" }),
        }
      : undefined,
    buttonAreaCount > 5
      ? {
          action: () =>
            open(
              "FileExplorer",
              { url: `${HOME}/Pictures` },
              "/System/Icons/pictures.webp"
            ),
          icon: <Icon icon='image' iconPrefix='far' />,
          name: "Pictures",
          ...(collapsed && { tooltip: "Pictures" }),
        }
      : undefined,
    buttonAreaCount > 6
      ? {
          action: () =>
            open(
              "FileExplorer",
              { url: `${HOME}/Videos` },
              "/System/Icons/videos.webp"
            ),
          icon: <Icon icon='film' iconPrefix='fas' />,
          name: "Videos",
          ...(collapsed && { tooltip: "Videos" }),
        }
      : undefined,
    buttonAreaCount > 7
    ? {
        action: () =>
          open(
            "FileExplorer",
            { url: `${HOME}/Videos` },
            "/System/Icons/videos.webp"
          ),
        icon: <Icon icon='gear' iconPrefix='fas' />,
        name: "Videos",
        ...(collapsed && { tooltip: "Videos" }),
      }
    : undefined,
    // {
    //   action: () => {
    //     setHaltSession(true);
    //     resetStorage(rootFs).finally(() => window.location.reload());
    //   },
    //   icon: <Power />,
    //   name: "Power",
    //   tooltip: "Clears session data and reloads the page.",
    // },
  ].filter(Boolean) as SidebarButtons;

  useEffect(() => clearTimer, []);

  return (
    <StyledSidebar
      className={collapsed ? "collapsed" : undefined}
      onClick={() => {
        clearTimer();
        setCollapsed((collapsedState) => !collapsedState);
      }}
      onContextMenu={haltEvent}
      onMouseEnter={() => {
        expandTimer.current = window.setTimeout(() => setCollapsed(false), 700);
      }}
      onMouseLeave={() => {
        clearTimer();
        setCollapsed(true);
      }}
      style={{ height }}
    >
      <SidebarGroup sidebarButtons={topButtons} />
      <SidebarGroup sidebarButtons={bottomButtons} />
    </StyledSidebar>
  );
};

export default Sidebar;
