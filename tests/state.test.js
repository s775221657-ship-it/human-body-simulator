import { describe, expect, it } from 'vitest';
import { animationScales, clampSpeed, createInitialState, selectOrgan, setLayerOpacity, toggleSystem } from '../src/utils/state.js';
import { DEFAULT_SKIN_OPACITY } from '../src/data/anatomy.js';
import { HumanModel } from '../src/anatomy/HumanModel.js';
import { renderLayerControls } from '../src/ui.js';

describe('application state', () => {
  it('creates independent initial visibility objects', () => { const a=createInitialState(),b=createInitialState();a.visibility.skin=false;expect(b.visibility.skin).toBe(true); });
  it('toggles known systems without mutating input', () => { const state=createInitialState(),next=toggleSystem(state,'skeleton');expect(next.visibility.skeleton).toBe(false);expect(state.visibility.skeleton).toBe(true);expect(toggleSystem(state,'unknown')).toBe(state); });
  it('accepts known organs and clears invalid selections', () => { const state=createInitialState();expect(selectOrgan(state,'heart').selectedOrgan).toBe('heart');expect(selectOrgan(state,'appendix').selectedOrgan).toBeNull(); });
  it('clamps layer opacity and synchronizes visibility immutably',()=>{const state=createInitialState(),hidden=setLayerOpacity(state,'skin',-2),shown=setLayerOpacity(hidden,'skin',.65);expect(hidden.opacity.skin).toBe(0);expect(hidden.visibility.skin).toBe(false);expect(shown.opacity.skin).toBe(.65);expect(shown.visibility.skin).toBe(true);expect(state.opacity.skin).toBe(DEFAULT_SKIN_OPACITY);expect(setLayerOpacity(state,'unknown',.5)).toBe(state)});
  it('shares the skin default across DOM, state, and model materials',()=>{const model=new HumanModel(),skinInput=renderLayerControls().match(/<input[^>]*data-system="skin"[^>]*value="([^"]+)"/);expect(Number(skinInput?.[1])).toBe(DEFAULT_SKIN_OPACITY);expect(createInitialState().opacity.skin).toBe(DEFAULT_SKIN_OPACITY);expect(model.fallbackSkin.children[0].material.opacity).toBe(DEFAULT_SKIN_OPACITY)});
  it.each(['skeleton','organs'])('restores shared %s materials exactly after 1 → .4 → 1',key=>{const model=new HumanModel(),materials=new Set();model.layers[key].traverse(n=>{if(n.isMesh&&n.material)materials.add(n.material)});model.setOpacity(key,.4);materials.forEach(mat=>expect(mat.opacity).toBeCloseTo(.4));model.setOpacity(key,1);materials.forEach(mat=>expect(mat.opacity).toBe(1));});
});

describe('animation math', () => {
  it('clamps speed to the supported range', () => { expect(clampSpeed(-5)).toBe(.25);expect(clampSpeed(9)).toBe(2);expect(clampSpeed('1.5')).toBe(1.5);expect(clampSpeed('bad')).toBe(1); });
  it('returns neutral scales while paused', () => { expect(animationScales(10,2,true)).toEqual({breath:1,heartbeat:1,pulse:0}); });
  it('keeps animation values within safe visual bounds', () => { for(let t=0;t<10;t+=.031){const x=animationScales(t,2);expect(x.breath).toBeGreaterThanOrEqual(.965);expect(x.breath).toBeLessThanOrEqual(1.035);expect(x.heartbeat).toBeGreaterThanOrEqual(1);expect(x.heartbeat).toBeLessThan(1.2);expect(x.pulse).toBeGreaterThanOrEqual(0);expect(x.pulse).toBeLessThanOrEqual(1);} });
});
