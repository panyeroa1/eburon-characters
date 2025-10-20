/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useSettings, useUI } from '@/lib/state';
import c from 'classnames';
import { ALIASED_VOICES } from '@/lib/constants';
import { useLiveAPIContext } from '@/contexts/LiveAPIContext';

export default function Sidebar() {
  const { isSidebarOpen, toggleSidebar } = useUI();
  const { voice, setVoice } = useSettings();
  const { connected } = useLiveAPIContext();

  return (
    <>
      <aside className={c('sidebar', { open: isSidebarOpen })}>
        <div className="sidebar-header">
          <h3>Settings</h3>
          <button onClick={toggleSidebar} className="close-button">
            <span className="icon">close</span>
          </button>
        </div>
        <div className="sidebar-content">
          <div className="sidebar-section">
            <fieldset disabled={connected}>
              <label>
                Voice
                <select value={voice} onChange={e => setVoice(e.target.value)}>
                  {ALIASED_VOICES.map(v => (
                    <option key={v.voice} value={v.voice}>
                      {v.alias}
                    </option>
                  ))}
                </select>
              </label>
            </fieldset>
          </div>
        </div>
      </aside>
    </>
  );
}