import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { fitPerspectiveBox, refitPreservingView, shouldRefitForResize, viewDirection } from '../src/utils/camera.js';

describe('camera framing', () => {
  const humanBox=new THREE.Box3(new THREE.Vector3(-1.33,-3.494,-.49),new THREE.Vector3(1.33,3.85,.55));
  const framingBox=humanBox.clone();framingBox.min.y=Math.min(framingBox.min.y,-3.57);

  it('extends only the human bounds down to the floor contact', () => {
    expect(framingBox.min.toArray()).toEqual([-1.33,-3.57,-.49]);
    expect(framingBox.max.toArray()).toEqual([1.33,3.85,.55]);
    expect(framingBox.max.x).toBeLessThan(3.1);
    expect(framingBox.max.z).toBeLessThan(3.1);
  });

  it.each([994/505, .55])('fits the human with comfortable margins at aspect %s', aspect => {
    const box=framingBox;
    const direction=new THREE.Vector3(0,.02,1).normalize(), {target,distance}=fitPerspectiveBox(box,direction,34,aspect);
    const camera=new THREE.PerspectiveCamera(34,aspect,.1,100);camera.position.copy(target).addScaledVector(direction,distance);camera.lookAt(target);camera.updateMatrixWorld();
    let minY=Infinity,maxY=-Infinity;
    for(const x of [box.min.x,box.max.x]) for(const y of [box.min.y,box.max.y]) for(const z of [box.min.z,box.max.z]) {
      const projected=new THREE.Vector3(x,y,z).project(camera);
      expect(Math.abs(projected.x)).toBeLessThanOrEqual(.84);
      expect(Math.abs(projected.y)).toBeLessThanOrEqual(.84);
      minY=Math.min(minY,projected.y);maxY=Math.max(maxY,projected.y);
    }
    if(aspect===994/505)expect((maxY-minY)/2).toBeGreaterThanOrEqual(.75);
    if(aspect===994/505)expect((maxY-minY)/2).toBeLessThanOrEqual(.85);
  });
  it('provides normalized orthogonal standard views and a stable reset',()=>{expect(viewDirection('front').z).toBeGreaterThan(.99);expect(viewDirection('back').z).toBeLessThan(-.99);expect(viewDirection('left').x).toBeLessThan(-.99);expect(viewDirection('right').x).toBeGreaterThan(.99);expect(viewDirection('unknown').equals(viewDirection('reset'))).toBe(true)});
  it('refits landscape to portrait while preserving target and viewing direction',()=>{const target=new THREE.Vector3(0,.2,0),position=new THREE.Vector3(3,1,8),before=position.clone().sub(target).normalize(),result=refitPreservingView(framingBox,position,target,34,.55);expect(shouldRefitForResize(1.8,.55)).toBe(true);expect(result.target).toEqual(target);expect(result.position.clone().sub(result.target).normalize().angleTo(before)).toBeLessThan(1e-8);expect(result.distance).toBeGreaterThan(position.distanceTo(target));});
  it('does not request a reset for ordinary same-orientation resizes',()=>{expect(shouldRefitForResize(1.8,1.2)).toBe(false);expect(shouldRefitForResize(.6,.8)).toBe(false);});
});
