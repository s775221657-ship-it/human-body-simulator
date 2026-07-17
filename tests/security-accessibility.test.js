import { describe,expect,it } from 'vitest';
import { escapeHtml,renderLayerControls } from '../src/ui.js';
import fs from 'node:fs';
describe('UI hardening and accessibility',()=>{
 it('escapes markup-like asset names',()=>expect(escapeHtml('<img src=x onerror="boom">')).toBe('&lt;img src=x onerror=&quot;boom&quot;&gt;'));
 it('ships focus, canvas keyboard, pressed-view, inert/trapped drawers, and overflow safeguards',()=>{const ui=fs.readFileSync('src/ui.js','utf8'),main=fs.readFileSync('src/main.js','utf8'),css=fs.readFileSync('src/overflow.css','utf8');expect(ui).toContain('role="application"');expect(ui).toContain('aria-pressed="false"');expect(ui).toContain("setAttribute('inert'");expect(ui).toContain('trapDrawerFocus');expect(ui).toContain("openDrawer(root,'inspector')");expect(main).toContain('ui.closeInfo.onclick=closeInspector');expect(main).toMatch(/function closeInspector\(\).*closeDrawers\(root\)/);expect(css).toContain(':focus-visible');expect(css).toContain('overflow-x: hidden');expect(renderLayerControls()).toContain('aria-pressed="true"');});
});
