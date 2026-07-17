import { describe, expect, it } from 'vitest';
import { ARM_VESSEL_CONTROL_POINTS, createArmVesselCurve } from '../src/anatomy/HumanModel.js';

describe('procedural arm-vessel containment',()=>{
  it('keeps controls and the centripetal path inside the hanging-arm envelope',()=>{
    expect(ARM_VESSEL_CONTROL_POINTS.at(-1)[0]).toBeLessThanOrEqual(.96);
    for(const sign of [-1,1]) for(const point of createArmVesselCurve(sign).getPoints(200)){
      expect(Math.abs(point.x)).toBeLessThanOrEqual(.961);
      expect(point.z).toBeGreaterThanOrEqual(.029);
      expect(point.z).toBeLessThanOrEqual(.201);
    }
  });
});
