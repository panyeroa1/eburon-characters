/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { useUI } from '../lib/state';

export default function Header() {
  const { toggleSidebar } = useUI();
  return (
    <header>
      <div className="header-left">
        <h1>AI Voice Chat</h1>
        <p>Have a friendly conversation with an AI.</p>
      </div>
      <div className="header-right">
        <button
          onClick={toggleSidebar}
          className="settings-button"
          aria-label="Open settings"
        >
          <span className="icon">settings</span>
        </button>
      </div>
    </header>
  );
}