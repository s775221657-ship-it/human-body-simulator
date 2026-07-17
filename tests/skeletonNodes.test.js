import { describe,expect,it } from 'vitest';
import { displayAnatomyName, filterStructures, isRightSideNode, mirroredNodeName, searchableStructures } from '../src/anatomy/skeletonNodes.js';

describe('skeleton mirroring classification',()=>{
  it.each(['Femur.r','Scapula.r.','Rib (1st).r'])('mirrors explicit right-side node %s',name=>expect(isRightSideNode(name)).toBe(true));
  it.each(['Sacrum','Parietal bone right','Parietal bone left','Atlas (C1)','Bones_right'])('leaves midline or already bilateral node %s alone',name=>expect(isRightSideNode(name)).toBe(false));
  it('creates stable left names without changing source names',()=>{expect(mirroredNodeName('Scapula.r.')).toBe('Scapula.l');expect(mirroredNodeName('Femur.r')).toBe('Femur.l');expect(mirroredNodeName('Sacrum')).toBe('Sacrum')});
});

describe('anatomy search',()=>{
  const items=searchableStructures({heart:{name:'Heart',system:'Circulatory system'}},['Femur.r','Atlas (C1)']);
  it('searches display names, systems, and types case-insensitively',()=>{expect(filterStructures(items,'RIGHT femur').map(x=>x.id)).toEqual(['bone:Femur.r']);expect(filterStructures(items,'circulatory').map(x=>x.id)).toEqual(['heart']);expect(filterStructures(items,'bone').map(x=>x.id)).toEqual(['bone:Femur.r','bone:Atlas (C1)'])});
  it('returns all structures for blank search and formats laterality',()=>{expect(filterStructures(items,' ')).toBe(items);expect(displayAnatomyName('Femur.r')).toBe('Femur — right')});
});
