import {Component, ElementRef, ViewChild} from '@angular/core';
import * as d3 from 'd3';
import datas from '../../../assets/datas.json';
import data2 from '../../../assets/data2.json';

@Component({
  selector: 'app-collapsible-radial-tree',
  templateUrl: './collapsible-radial-tree.component.html',
  styleUrls: ['./collapsible-radial-tree.component.scss']
})
export class CollapsibleRadialTreeComponent {
  // @ViewChild('treeContainer') treeContainer: ElementRef;

  constructor(private treeContainer: ElementRef) {
    // this.treeContainer = elementRef;
  }

  ngOnInit(): void {
    this.drawRadialTree();
  }

  drawRadialTree() {
    const width = this.treeContainer.nativeElement.offsetWidth; // Adjust width based on container size
    const height = this.treeContainer.nativeElement.offsetHeight; // Adjust height based on container size
    const radius = Math.min(width, height) / 2;

    let loadtest = true;


    const tree = (data: any) => d3.tree()
      .size([2 * Math.PI, radius])
      .separation((a, b) => (a.parent == b.parent ? 1 : 3) / a.depth)
      (d3.hierarchy(data));

    const svg = d3.select(this.treeContainer.nativeElement).select('div')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('overflow','visible')
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`)
      .attr("preserveAspectRatio", "xMidYMid meet");


    const g = svg.append('g');

    const linkgroup = g.append('g').attr('fill', 'none').attr('stroke', '#555').attr('stroke-opacity', 0.4).attr('stroke-width', 3.5);

    const nodegroup = g.append('g');

    const trans = (animate: boolean) => d3.transition()
      .duration(animate ? 400 : 0)
      .ease(d3.easeLinear)
      .on('end', function () {
        const box = g.node()?.getBBox();
        const defaultBox = { x: 0, y: 0, width: 0, height: 0 };
        const viewBox = box ? `${box.x} ${box.y} ${box.width} ${box.height}` : `${defaultBox.x} ${defaultBox.y} ${defaultBox.width} ${defaultBox.height}`;
        svg.transition().duration(1000).attr('viewBox', viewBox);
      });

    // (re)render the tree
    function reRenderTree(animate = true, thedata = datas) {
      let root = tree(thedata);
      let links_data = root.links();

      let links = linkgroup
        .selectAll('path')
        .data(links_data, (d: any) => d.source.data.name + '_' + d.target.data.name);

      links.exit().remove();

      links.enter()
        .append('path')
        .attr('d', (d: any) => {
          const radialLink = d3.linkRadial()
            .angle((d: any) => d.x)
            .radius((d: any) => d.y);
          return radialLink(d);
        });


      linkgroup.selectAll('path')
        .transition()
        .duration(animate ? 400 : 0)
        .ease(d3.easeLinear)
        .on('end', function () {
          const box = g.node()?.getBBox();
          if (box) {
            svg.transition().duration(1000).attr("viewBox", `${box.x} ${box.y} ${box.width} ${box.height}`);
          }
        })// tslint:disable-next-line: no-unused-expression
        .attr('d', (d: any) => {
          return d3.linkRadial()
            .angle((d: any) => d.x)
            .radius((d: any) => d.y)(d);
        });

      let nodes_data = root.descendants().reverse();

      let nodes = nodegroup
        .selectAll('g')
        .data(nodes_data, (d: any) => d.parent ? d.parent.data.name + d.data.name : d.data.name);

      nodes.exit().remove();

      let newnodes = nodes.enter().append('g');

      newnodes.on('click', function (event: any, d: any) {
        d3.select(this).select('g').remove();
        let altChildren = d.data.altChildren || [];
        let children = d.data.children;
        const hasChildren = d.children || (children && (children.length > 0 || altChildren.length > 0)) ? true : false;
        d.data.children = altChildren;
        d.data.altChildren = children;
        if (loadtest) {
          if (hasChildren) {
            reRenderTree();
          } else {
            reRenderTree(true, data2);
            loadtest = false;
          }
        } else {
          if (hasChildren) {
            reRenderTree(true, data2);
          } else {
            reRenderTree();
            loadtest = true;
          }
        }
      });

      newnodes.on('mouseenter', function (event: any, d: any) {
        d3.select(this).raise();
        d3.select(this)
          .append('g').attr('transform', (d: any) => `rotate(${-(d.x * 180 / Math.PI - 90)})`);
        d3.select(this)
          .select('g')
          .append('rect')
          .style('fill', 'lightblue')
          .attr('width', 120)
          .attr('height', 120);
        const fo = d3.select(this).select('g').append('foreignObject')
          .attr('x', '10')
          .attr('y', '10')
          .attr('width', '100')
          .attr('height', '100')
          .attr('class', 'svg-tooltip');
        const div = fo.append('xhtml:div')
          .append('div')
          .attr('class', 'tooltip')
          .append('p')
          .attr('class', 'lead')
          .html('Holmes was certainly not a difficult man to live with.')
          .append('p')
          .attr('class', 'link')
          .html('<a href="https://www.google.com">google</a>');
      });

      newnodes.on('mouseleave', function (event: any, d: any) {
        d3.select(this).select('g').remove();
      });

      let allnodes = animate ? nodegroup.selectAll('g').transition().duration(animate ? 400 : 0).ease(d3.easeLinear).on('end', function () {
        const gNode = g.node();
        if (gNode) {
          const box = gNode.getBBox();
          if (box) { // Add null check for box
            svg.transition().duration(1000).attr('viewBox', `${box.x} ${box.y} ${box.width} ${box.height}`);
          }
        }
      }) : nodegroup.selectAll('g');

      allnodes.attr('transform', (d: any) => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`);

      newnodes.append('circle').attr('r', 12).style('fill', (d: any) => d.data.color ? d.data.color : 'grey');

      newnodes.append('text').attr('dy', '0.31em').text((d: any) => d.data.color ? d.data.color : d.data.name);

      newnodes.append('foreignObject').attr('x', '10').attr('y', '10').attr('width', '100').attr('height', '100').attr('class', 'svg-foreignObject');

      nodegroup.selectAll('g text').attr('dx', (d: any) => d.x < Math.PI === !d.children ? 16 : -16)
        .attr('text-anchor', (d: any) => d.x < Math.PI === !d.children ? 'start' : 'end')
        .attr('transform', (d: any) => d.x >= Math.PI ? 'rotate(180)' : null);
    }

    reRenderTree(false, datas);
  }


}
