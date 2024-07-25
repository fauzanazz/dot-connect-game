"use client"
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const DotConnectGame = () => {
    const svgRef = useRef();

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        const width = 800;
        const height = 600;

        const dots = [
            { x: 100, y: 100 },
            { x: 200, y: 200 },
            { x: 300, y: 100 },
            { x: 400, y: 300 },
            { x: 500, y: 200 }
        ];

        let selectedDots = [];

        svg.attr('width', width).attr('height', height);

        svg.selectAll('circle')
            .data(dots)
            .enter().append('circle')
            .attr('class', 'dot')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('r', 10)
            .attr('fill', 'steelblue')
            .style('cursor', 'pointer')
            .on('click', function(event, d) {
                if (selectedDots.length < 2) {
                    selectedDots.push(d);
                    d3.select(this).attr('fill', 'red');
                }
                if (selectedDots.length === 2) {
                    drawLine(selectedDots[0], selectedDots[1]);
                    selectedDots = [];
                    d3.selectAll('circle').attr('fill', 'steelblue');
                }
            });

        function drawLine(dot1, dot2) {
            svg.append('line')
                .attr('class', 'line')
                .attr('x1', dot1.x)
                .attr('y1', dot1.y)
                .attr('x2', dot2.x)
                .attr('y2', dot2.y)
                .attr('stroke', 'black')
                .attr('stroke-width', 2);
        }
    }, []);

    return <svg ref={svgRef}></svg>;
};

export default DotConnectGame;
