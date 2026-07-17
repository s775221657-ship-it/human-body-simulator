import { describe, expect, it } from 'vitest';
import { groupSemanticNodes, parseSemanticNode, validateStagedOrganGroups } from '../src/anatomy/assetSemantics.js';

describe('semantic anatomy nodes', () => {
  it('parses organ and FMA identity without accepting container nodes', () => {
    expect(parseSemanticNode('lungs__FMA7333')).toEqual({ organId: 'lungs', fmaId: 'FMA7333' });
    expect(parseSemanticNode('world')).toBeNull();
    expect(parseSemanticNode('lungs')).toBeNull();
  });

  it('keeps every lobe or segment in one actionable organ group', () => {
    const nodes=['lungs__FMA7333','lungs__FMA7337','heart__FMA7274','intestines__FMA7206','intestines__FMA7207'].map(name=>({name}));
    const groups=groupSemanticNodes(nodes);
    expect(groups.get('lungs')).toHaveLength(2);
    expect(groups.get('intestines').map(x=>x.fmaId)).toEqual(['FMA7206','FMA7207']);
    expect(groups.get('heart')[0].node).toBe(nodes[2]);
  });
  it('rejects missing compound groups using only staged data',()=>{const groups=new Map([['stomach',[1]],['liver',[1]],['kidneys',[1]],['lungs',[1,2]],['heart',[1]],['intestines',[1]],['brain',[1]]]);expect(()=>validateStagedOrganGroups(groups)).toThrow(/kidneys/);groups.set('kidneys',[1,2]);groups.delete('lungs');expect(()=>validateStagedOrganGroups(groups)).toThrow(/lungs/);});
});
