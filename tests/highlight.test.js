import { describe, expect, it, vi } from 'vitest';
import { HumanModel } from '../src/anatomy/HumanModel.js';

describe('organ highlighting', () => {
  it('highlights every compound part and preserves selection across hover', () => {
    const human=new HumanModel();
    const lungs=human.pickables.filter(mesh=>mesh.userData.organId==='lungs');
    const intestines=human.pickables.filter(mesh=>mesh.userData.organId==='intestines');
    const baseLung=lungs[0].material.emissive.clone();

    human.setSelected('lungs');
    expect(lungs).toHaveLength(2);
    lungs.forEach(mesh=>expect(mesh.material.emissiveIntensity).toBe(.65));

    human.setHovered('intestines');
    intestines.forEach(mesh=>expect(mesh.material.emissiveIntensity).toBe(.48));
    lungs.forEach(mesh=>expect(mesh.material.emissiveIntensity).toBe(.65));

    human.setHovered(null);
    intestines.forEach(mesh=>expect(mesh.material.emissiveIntensity).toBe(1));
    lungs.forEach(mesh=>expect(mesh.material.emissiveIntensity).toBe(.65));

    human.setSelected(null);
    lungs.forEach(mesh=>{
      expect(mesh.material.emissiveIntensity).toBe(1);
      expect(mesh.material.emissive.equals(baseLung)).toBe(true);
    });
  });

  it('isolates the selected organ at both structure and layer level', () => {
    const human=new HumanModel();
    human.isolate('heart');
    expect(human.layers.organs.visible).toBe(true);
    expect(human.layers.skin.visible).toBe(false);
    expect(human.layers.skeleton.visible).toBe(false);
    expect(human.layers.circulatory.visible).toBe(false);
    human.pickables.forEach(mesh=>expect(mesh.visible).toBe(mesh.userData.organId==='heart'));
  });
  it('fades non-pickable skin/vessels and restores current UI opacity',()=>{const human=new HumanModel();human.setOpacity('skin',.3);human.setOpacity('circulatory',.6);human.fadeOthers('heart');for(const key of ['skin','circulatory'])human.layers[key].traverse(n=>{if(n.isMesh)expect(n.material.opacity).toBeLessThanOrEqual(.08)});human.restoreAll();expect(human.layers.skin.visible).toBe(true);expect(human.layers.circulatory.visible).toBe(true);expect(human.fallbackSkin.children[0].material.opacity).toBeCloseTo(.3);expect(human.layers.circulatory.children[0].material.opacity).toBeCloseTo(.6);});
  it('preserves opacity changes made while X-ray mode is active',()=>{const human=new HumanModel();human.fadeOthers('heart');human.setOpacity('skin',.5);human.setOpacity('circulatory',.6);for(const key of ['skin','circulatory'])human.layers[key].traverse(n=>{if(n.isMesh)expect(n.material.opacity).toBeLessThanOrEqual(.08)});human.restoreAll();expect(human.layerOpacity.skin).toBe(.5);expect(human.layerOpacity.circulatory).toBe(.6);expect(human.fallbackSkin.children[0].material.opacity).toBeCloseTo(.5);expect(human.layers.circulatory.children[0].material.opacity).toBeCloseTo(.6);});
  it('keeps bone highlight at the current skeleton opacity and disposes clones',()=>{const human=new HumanModel(),mesh={material:null,userData:{baseMaterial:human.highlightMaterial},isMesh:true};human.structureMeshes.set('bone:test',mesh);human.setOpacity('skeleton',.4);human.setStructureSelected('bone:test');expect(mesh.material.opacity).toBe(.4);const clone=mesh.material,spy=vi.spyOn(clone,'dispose');human.setStructureSelected(null);expect(spy).toHaveBeenCalledOnce();expect(mesh.material).toBe(mesh.userData.baseMaterial);});
});
