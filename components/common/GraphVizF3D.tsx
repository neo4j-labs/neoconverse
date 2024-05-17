import React, { useState, useRef } from 'react';
import { NextPage } from 'next';
import { GraphData } from 'force-graph';
import IconButton from '@mui/material/IconButton';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import Box from '@mui/material/Box'; // To provide a wrapper for styling

import dynamic from 'next/dynamic';
const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), {
    ssr: false
  });

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false
});

import { CSS2DRenderer , CSS2DObject} from 'three/addons/renderers/CSS2DRenderer.js';


// const Graph = ForceGraph3D({
//   extraRenderers: [new CSS2DRenderer()]
// })

const initialGraphData: GraphData = {
  nodes: [{ id: '1', name: 'Node 1' }, { id: '2', name: 'Node 2' }],
  links: [{ source: '1', target: '2' }]
};

const GraphViz: NextPage = ({GraphData}) => {

  let check = GraphData?.nodes;
  GraphData = check ? GraphData:initialGraphData;

  const [isFullScreen, setFullScreen] = useState(false);
  const graphRef = useRef<HTMLDivElement>(null);

  const toggleFullScreen = () => {
    if (!graphRef.current) return;

    const elem = graphRef.current;
    if (!isFullScreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(e => {
          console.error(`Error attempting to enable full-screen mode: ${e.message} (${e.name})`);
        });
      }
    } else {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(e => {
          console.error(`Error attempting to disable full-screen mode: ${e.message} (${e.name})`);
        });
      }
    }

    setFullScreen(!isFullScreen);
  };

  return (
    <Box ref={graphRef} sx={{
      position: 'relative', 
      width: isFullScreen ? '100vw' : '700px', 
      height: isFullScreen ? '100vh' : '300px',
      '&:hover': {
        cursor: 'pointer'  // Ensures cursor changes on hover over the div
      }
    }}>
      <ForceGraph2D 
        graphData={GraphData}
        width={isFullScreen ? window.innerWidth : 1200}
        height={isFullScreen ? window.innerHeight : 300}
        backgroundColor="#FFFFFF"  // White background
        nodeLabel="name"
        nodeAutoColorBy="label"
        linkCurvature={"curvature"}
        linkLabel = {"type"}
        linkOpacity ={ 0.8 }
        linkColor={() => 'rgba(50, 50, 50, 0.8)'}
        nodeCanvasObjectMode={() => "after"}
        zoomToFit={0}
        nodeThreeObjectExtend={true}
        nodeThreeObject = {(node)=> {
            const nodeEl = document.createElement('Box');
            nodeEl.textContent = node.name;
            nodeEl.style.color = node.color;
            // nodeEl.className = 'node-label';
            return new CSS2DObject(nodeEl);
          }
        }
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.name;
          const fontSize = 14 / (globalScale * 1.2)
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = node.color;
          ctx.fillText(label, node.x, node.y);

          node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
        }}
        nodePointerAreaPaint={(node, color, ctx) => {
          ctx.fillStyle = color;
          const bckgDimensions = node.__bckgDimensions;
          bckgDimensions && ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
        }}
      />
      <IconButton
        onClick={toggleFullScreen}
        sx={{ position: 'absolute', right: 0, top: 0, color: '#333' }}
        aria-label="Toggle fullscreen"
      >
        {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
      </IconButton>
    </Box>
  );
};

export default GraphViz;