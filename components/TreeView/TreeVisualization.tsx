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
  }, [people, layout]);

  return (
    <div className="w-full overflow-auto">
      <svg ref={svgRef} className="w-full" />
    </div>
  );
};
