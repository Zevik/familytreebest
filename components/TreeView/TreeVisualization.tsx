'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Person } from '@/types/family';

interface TreeVisualizationProps {
  people: Person[];
  layout: 'vertical' | 'horizontal' | 'network';
  onPersonClick: (person: Person) => void;
}

export const TreeVisualization = ({ people, layout, onPersonClick }: TreeVisualizationProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || people.length === 0) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove();

    const width = 1000;
    const height = 800;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},50)`);

    // Build tree structure based on relationships
    const treeData = buildTreeData(people);
    
    // Different layouts based on selection
    const treeLayout = layout === 'vertical' ? d3.tree().size([width - 100, height - 100]) :
                      layout === 'horizontal' ? d3.tree().size([height - 100, width - 100]) :
                      d3.forceSimulation().force('link', d3.forceLink());

    // Render tree based on layout
    renderTree(svg, treeData, treeLayout, layout, onPersonClick);
  }, [people, layout, onPersonClick]);

  return (
    <div className="w-full overflow-auto">
      <svg ref={svgRef} className="w-full" />
    </div>
  );
};

// הוספת פונקציית buildTreeData
function buildTreeData(people: Person[]) {
  // מצא את האדם הראשון (זאב אבינר)
  const root = people.find(p => p.id === 'zeev-aviner');
  if (!root) return null;

  function buildNode(person: Person): any {
    const node = {
      id: person.id,
      name: person.fullName,
      children: [] as any[],
      data: person
    };

    // מצא את כל הילדים
    const children = people.filter(p => 
      p.relationships.some(r => 
        r.relatedPersonId === person.id && r.type === 'parent'
      )
    );

    // הוסף את הילדים לעץ
    node.children = children.map(child => buildNode(child));

    return node;
  }

  return buildNode(root);
}

// הוספת פונקציית renderTree
function renderTree(
  svg: d3.Selection<SVGGElement, unknown, null, undefined>,
  data: any,
  layout: any,
  type: string,
  onPersonClick: (person: Person) => void
) {
  if (type === 'network') {
    renderNetworkLayout(svg, data, onPersonClick);
  } else {
    renderHierarchicalLayout(svg, data, layout, type === 'horizontal', onPersonClick);
  }
}

function renderHierarchicalLayout(
  svg: d3.Selection<SVGGElement, unknown, null, undefined>,
  data: any,
  layout: any,
  isHorizontal: boolean,
  onPersonClick: (person: Person) => void
) {
  const root = d3.hierarchy(data);
  const links = root.links();
  const nodes = root.descendants();

  layout(root);

  // Add links
  svg.selectAll('path.link')
    .data(links)
    .join('path')
    .attr('class', 'link')
    .attr('fill', 'none')
    .attr('stroke', '#999')
    .attr('d', d3.linkVertical()
      .x((d: any) => isHorizontal ? d.y : d.x)
      .y((d: any) => isHorizontal ? d.x : d.y)
    );

  // Add nodes
  const node = svg.selectAll('g.node')
    .data(nodes)
    .join('g')
    .attr('class', 'node')
    .attr('transform', d => 
      isHorizontal 
        ? `translate(${d.y},${d.x})` 
        : `translate(${d.x},${d.y})`
    )
    .on('click', (event, d) => onPersonClick(d.data.data));

  node.append('circle')
    .attr('r', 5)
    .attr('fill', '#4299e1');

  node.append('text')
    .attr('dy', '0.31em')
    .attr('x', d => d.children ? -6 : 6)
    .attr('text-anchor', d => d.children ? 'end' : 'start')
    .text(d => d.data.name)
    .clone(true).lower()
    .attr('stroke', 'white')
    .attr('stroke-width', 3);
}

// הוספת פונקציית renderNetworkLayout החסרה
function renderNetworkLayout(
  svg: d3.Selection<SVGGElement, unknown, null, undefined>,
  data: any,
  onClick: (person: Person) => void
) {
  const simulation = d3.forceSimulation()
    .force('charge', d3.forceManyBody().strength(-300))
    .force('center', d3.forceCenter(0, 0))
    .force('collision', d3.forceCollide().radius(50));

  // Convert tree data to nodes and links
  const nodes = flatten(data);
  const links = nodes.slice(1).map(node => ({
    source: findParent(node, nodes),
    target: node
  }));

  simulation
    .nodes(nodes)
    .force('link', d3.forceLink(links).distance(100));

  // Draw links
  svg.selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke', '#999')
    .attr('stroke-width', 1);

  // Draw nodes
  const node = svg.selectAll('g')
    .data(nodes)
    .join('g')
    .call(d3.drag<SVGGElement, any>()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));

  node.append('circle')
    .attr('r', 5)
    .attr('fill', '#4299e1');

  node.append('text')
    .attr('x', 8)
    .attr('y', '0.31em')
    .text(d => d.name);

  // Update positions on tick
  simulation.on('tick', () => {
    svg.selectAll('line')
      .attr('x1', d => (d.source as any).x)
      .attr('y1', d => (d.source as any).y)
      .attr('x2', d => (d.target as any).x)
      .attr('y2', d => (d.target as any).y);

    svg.selectAll('g')
      .attr('transform', d => `translate(${d.x},${d.y})`);
  });

  // Helper functions for drag behavior
  function dragstarted(event: any) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event: any) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event: any) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }
}

// Helper functions
function flatten(node: any): any[] {
  const nodes = [node];
  if (node.children) {
    node.children.forEach((child: any) => {
      nodes.push(...flatten(child));
    });
  }
  return nodes;
}

function findParent(node: any, nodes: any[]): any {
  return nodes.find(n => 
    n.children && n.children.some((child: any) => child === node)
  );
}
