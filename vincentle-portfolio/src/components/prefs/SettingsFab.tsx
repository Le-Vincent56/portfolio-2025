'use client';

import { useState } from 'react';
import { useUIPrefs } from './UIPrefsProvider';

export default function SettingsFab() {
    const { reducedMotion, parallaxEnabled, ringPulseEnabled, setPrefs } = useUIPrefs();
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                className="fixed z-50 bottom-24 right-6 rounded-full bg-white/10 hover:bg-white/20 px-3 py-2 text-sm"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-controls="ui-settings"
                aria-label="Open UI settings"
            >
                ⚙︎
            </button>

            {open && (
                <div
                    id="ui-settings"
                    className="fixed z-50 bottom-36 right-6 w-72 rounded-xl bg-[#0F1016] ring-1 ring-white/10 p-4 space-y-3"
                >
                    <div className="text-sm font-medium">Accessibility & Feel</div>

                    <label className="flex items-center gap-3 text-sm">
                        <input
                            type="checkbox"
                            checked={reducedMotion}
                            onChange={(e) => setPrefs({ reducedMotion: e.target.checked, parallaxEnabled: !e.target.checked })}
                        />
                        Prefer reduced motion
                    </label>

                    <label className="flex items-center gap-3 text-sm">
                        <input
                            type="checkbox"
                            checked={parallaxEnabled}
                            onChange={(e) => setPrefs({ parallaxEnabled: e.target.checked })}
                            disabled={reducedMotion}
                        />
                        Micro‑parallax on hover
                    </label>

                    <label className="flex items-center gap-3 text-sm">
                        <input
                            type="checkbox"
                            checked={ringPulseEnabled}
                            onChange={(e) => setPrefs({ ringPulseEnabled: e.target.checked })}
                        />
                        Accent ring pulse on hover
                    </label>
                </div>
            )}
        </>
    );
}
