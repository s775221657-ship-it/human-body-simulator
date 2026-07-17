import { describe, expect, it } from 'vitest';
import { BODY_PARTS_DEPTH_REFERENCE, DETAILED_BODY_REGISTRATION, PROCEDURAL_VESSEL_DEPTH_ORIGIN, depthOffset, detailedSkeletonTransform, detailedSourceTranslation } from '../src/anatomy/alignment.js';
describe('measured detailed-body registration',()=>{
 const skeleton={min:{x:-.16,y:-.89,z:-.117},max:{x:.16,y:.835,z:.137}};
 it('reproduces immutable measured runtime skin bounds',()=>{expect(Object.isFrozen(DETAILED_BODY_REGISTRATION.sourceBounds.min)).toBe(true);expect(DETAILED_BODY_REGISTRATION.runtime.height).toBeCloseTo(6.718155,6);expect(DETAILED_BODY_REGISTRATION.runtime.floorY).toBe(-3.48);expect(DETAILED_BODY_REGISTRATION.runtime.topY).toBeCloseTo(3.238155,6);expect(detailedSourceTranslation().y).toBeCloseTo(.054865,6)});
 it('fails the obsolete 6.9 fit',()=>{const r=detailedSkeletonTransform(skeleton);expect(r.scale).toBeCloseTo(6.718155/1.725,8);expect(skeleton.min.y*r.scale+r.position.y).toBeCloseTo(-3.48,8);expect(skeleton.max.y*r.scale+r.position.y).toBeCloseTo(3.238155,6);expect(r.scale).not.toBeCloseTo(6.9/1.725,4)});
 it('preserves verified centering and depth',()=>{const r=detailedSkeletonTransform(skeleton);expect(r.position.x).toBeCloseTo(0,10);expect((skeleton.min.z+skeleton.max.z)*.5*r.scale+r.position.z).toBeCloseTo(BODY_PARTS_DEPTH_REFERENCE,10);expect(PROCEDURAL_VESSEL_DEPTH_ORIGIN+depthOffset(PROCEDURAL_VESSEL_DEPTH_ORIGIN)).toBeCloseTo(.4,10)});
});
