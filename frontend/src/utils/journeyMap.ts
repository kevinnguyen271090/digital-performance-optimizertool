import { AttributionJourney } from './mockAttributionJourneys';

export interface SankeyNode { id: string; }
export interface SankeyLink { source: string; target: string; value: number; }

// Hàm kiểm tra nếu thêm link mới vào graph có tạo cycle không (DFS)
function createsCycle(links: SankeyLink[], newLink: SankeyLink): boolean {
  // Xây dựng adjacency list
  const adj: Record<string, string[]> = {};
  for (const link of links) {
    if (!adj[link.source]) adj[link.source] = [];
    adj[link.source].push(link.target);
  }
  // Thêm link mới
  if (!adj[newLink.source]) adj[newLink.source] = [];
  adj[newLink.source].push(newLink.target);

  // DFS kiểm tra cycle từ source
  const visited = new Set<string>();
  function dfs(node: string): boolean {
    if (visited.has(node)) return true; // cycle detected
    visited.add(node);
    const neighbors = adj[node] || [];
    for (const neighbor of neighbors) {
      if (dfs(neighbor)) return true;
    }
    visited.delete(node);
    return false;
  }
  return dfs(newLink.source);
}

export function buildSankeyData(journeys: AttributionJourney[]): { nodes: SankeyNode[]; links: SankeyLink[] } {
  const linkMap: Record<string, number> = {};
  const nodeSet = new Set<string>();

  // Build links từ journeys
  journeys.forEach(journey => {
    for (let i = 0; i < journey.steps.length - 1; i++) {
      const from = journey.steps[i];
      const to = journey.steps[i + 1];
      if (from && to && from !== to) { // Đảm bảo không có link tự lặp
        const key = `${from}__${to}`;
        linkMap[key] = (linkMap[key] || 0) + 1;
        nodeSet.add(from);
        nodeSet.add(to);
      }
    }
    // Nếu chỉ có 1 bước, vẫn add node
    if (journey.steps.length === 1 && journey.steps[0]) {
      nodeSet.add(journey.steps[0]);
    }
  });

  // Tạo nodes
  const nodes: SankeyNode[] = Array.from(nodeSet).filter(Boolean).map(id => ({ id }));

  // Tạo links, chỉ loại link tự lặp và link tạo cycle
  const allLinks: SankeyLink[] = Object.entries(linkMap)
    .map(([key, value]) => {
      const [source, target] = key.split('__');
      return { source, target, value };
    })
    .filter(link => link.source !== link.target);

  // Loại bỏ link tạo cycle
  const links: SankeyLink[] = [];
  for (const link of allLinks) {
    if (createsCycle(links, link)) {
      console.warn(`Loại bỏ link tạo vòng lặp: ${link.source} -> ${link.target}`);
      continue;
    }
    links.push(link);
  }

  // Đảm bảo mọi link đều có source và target trong nodes
  const nodeIds = new Set(nodes.map(n => n.id));
  const finalLinks = links.filter(link => 
    nodeIds.has(link.source) && nodeIds.has(link.target)
  );

  // Log để debug
  console.log('Sankey Data Debug:', {
    nodes: nodes.map(n => n.id),
    links: finalLinks.map(l => `${l.source} -> ${l.target} (${l.value})`),
    totalNodes: nodes.length,
    totalLinks: finalLinks.length
  });

  return { nodes, links: finalLinks };
} 