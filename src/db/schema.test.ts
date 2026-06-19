import { describe, it, expect } from 'vitest';
import {
  nodeSourceEnum,
  nodeStatusEnum,
  edgeKindEnum,
  aiEndpointEnum,
  users,
  maps,
  nodes,
  edges,
  usageLog,
  schema,
} from './schema';

describe('schema enums (SPEC §3.1)', () => {
  it('node source = ai|human (N1/N3 source distinction)', () => {
    expect(nodeSourceEnum.enumValues).toEqual(['ai', 'human']);
  });
  it('node status = confirmed|suggested (AI suggestion vs human)', () => {
    expect(nodeStatusEnum.enumValues).toEqual(['confirmed', 'suggested']);
  });
  it('edge kind covers tree + 4 branch kinds (N4)', () => {
    expect(edgeKindEnum.enumValues).toEqual([
      'tree',
      'relation',
      'opposition',
      'question',
      'example',
    ]);
  });
  it('ai endpoint = structure|expand (usage_log)', () => {
    expect(aiEndpointEnum.enumValues).toEqual(['structure', 'expand']);
  });
});

describe('schema tables', () => {
  it('exposes all five tables in the schema object', () => {
    expect(Object.keys(schema).sort()).toEqual(
      ['edges', 'maps', 'nodes', 'usageLog', 'users'].sort(),
    );
  });
  it('maps/nodes/edges/usageLog carry owner/map scoping columns', () => {
    expect(maps.ownerId).toBeDefined();
    expect(nodes.mapId).toBeDefined();
    expect(nodes.parentId).toBeDefined();
    expect(edges.mapId).toBeDefined();
    expect(usageLog.ownerId).toBeDefined();
    expect(users.id).toBeDefined();
  });
});
