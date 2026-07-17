import { describe,expect,it } from 'vitest';
import { transformedPositionBounds } from '../src/anatomy/gltfBounds.js';
describe('GLB world-space validation bounds',()=>{it('honors parent and node transforms',()=>{const json={nodes:[{translation:[10,0,0],children:[1]},{mesh:0,translation:[0,2,0],scale:[2,1,1],name:'part'}],meshes:[{primitives:[{attributes:{POSITION:0}}]}],accessors:[{min:[-1,-1,-1],max:[1,1,1]}]};expect(transformedPositionBounds(json,1)).toEqual({min:[8,1,-1],max:[12,3,1]});});});
