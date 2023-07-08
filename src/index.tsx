import { closeMainWindow } from "@raycast/api";
import { useEffect } from "react";
import { runAppleScript } from 'run-applescript'

export default function Command() {
  const openChrome = async () => {
    try {
      runAppleScript(`
      tell application "Google Chrome"
        activate
        set currentTabIndex to active tab index of front window
        set numberOfTabs to count tabs of front window
        set targetURL to "https://chat.openai.com/"

        repeat with i from 1 to numberOfTabs
          if URL of tab i of front window is targetURL then
            set active tab index of front window to i
            delay 2
            set active tab index of front window to currentTabIndex
            exit repeat
          end if
        end repeat
      end tell

      delay 1 -- wait a moment for Google Chrome to activate

      tell application "System Events"
          keystroke "g" using {command down, shift down}
      end tell
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
