import { closeMainWindow } from "@raycast/api";
import { useEffect } from "react";
import { runAppleScript } from 'run-applescript'

export default function Command() {
  const openChrome = async () => {
    try {
      await runAppleScript(`
      tell application "Google Chrome"
      set allWindows to every window
      set originalTab to active tab of front window
      set originalTabIndex to active tab index of front window
      set urlExists to false
      repeat with currentWindow in allWindows
          set allTabs to every tab of currentWindow
          repeat with currentTab in allTabs
              if URL of currentTab contains "chat.openai.com" then
                  set urlExists to true
                  exit repeat
              end if
          end repeat
      end repeat
      if urlExists is false then
          tell front window
              make new tab with properties {URL:"https://chat.openai.com"}
          end tell
      end if
      set active tab index of front window to originalTabIndex
  end tell

      -- delay 1 -- wait a moment for Google Chrome to activate

      -- tell application "System Events"
          -- keystroke "g" using {command down, shift down}
      -- end tell
    `)
      closeMainWindow({ clearRootSearch: true });
    } catch (error) {
      console.error(error)
    }
  };

  useEffect(() => {
    openChrome();
  }, []);

  return null;
}
