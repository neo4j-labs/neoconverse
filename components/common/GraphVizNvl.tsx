import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { NextPage } from 'next';

const BasicNvlWrapper = dynamic(() => import("@neo4j-nvl/react/lib/basic-wrapper/BasicNvlWrapper").then((a) => a.BasicNvlWrapper), {ssr: false });
const InteractiveNvlWrapper = dynamic(() => import("@neo4j-nvl/react/lib/interactive-nvl-wrapper/InteractiveNvlWrapper").then((a) => a.InteractiveNvlWrapper), {ssr: false});
import type { HitTargets, Node, Relationship } from '@neo4j-nvl/base';
import NVL, { NvlOptions } from '@neo4j-nvl/base';
import type { MouseEventCallbacks } from '@neo4j-nvl/react'
import { colors } from '../../utils/Constants';
import { getNodeCaption } from '../../utils/utils'
import { Popover, Typography } from '@mui/material';

// const Node = dynamic(() => import("@neo4j-nvl/base/dist/types/index/").then((a) => a.InteractiveNvlWrapper), {ssr: false});




  const nvlOptions: NvlOptions = {
    allowDynamicMinZoom: true,
    disableWebGL: true,
    maxZoom: 3,
    minZoom: 0.05,
    relationshipThreshold: 0.55,
    useWebGL: false,
    instanceId: 'graph-preview',
    initialZoom: 0,
  };

// useEffect(() => {    
//     //   setNodes(finalNodes);
//     //   setRelationships(finalRels);
// })

type Scheme = Record<string, string>;


const GraphNVL: NextPage = ({GraphData}) => {


    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
    const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [popoverContent, setPopoverContent] = useState("");
    // const [open, setOpen] = useState(false);

    const open = Boolean(anchorEl);
    const handlePopoverClose = () => {
        setAnchorEl(null);
        // setOpen(false);
    };
    
    // const nvlRef = useRef<NVL>(null);
    // const [nodes, setNodes] = useState();
    // const [relationships, setRelationships] = useState();
    
    const mouseEventCallbacks: MouseEventCallbacks = {
       
        onNodeClick: (element: Node | Relationship, hitTargets: HitTargets, evt: MouseEvent) => {
            if(element?.caption)
            {
                // setOpen(true);
                setAnchorEl(evt.currentTarget);
                setMousePosition({ x: evt.clientX, y: evt.clientY });
                setPopoverContent(element?.caption)
                console.log('onHover', element?.caption)
            }
            else{
                setAnchorEl(null);
                // setOpen(false);
                console.log('onHover', "remove tooltip")
            }
        },
        onHover: (element: Node | Relationship, hitTargets: HitTargets, evt: MouseEvent) => {
            if(!element?.caption)
            {
                handlePopoverClose()
                setAnchorEl(null);
                // setOpen(false);
            }
        },
        onPan: true,
        onZoom: true,
        onDrag: true,
      };
    // setNodes(GraphData.nodes);
    // setRelationships(GraphData.links);

    let iterator = 0;
    const schemeVal: Scheme = {};

    GraphData.nodes.forEach((node) => {
      const labels = node.label
    //   labels.forEach((label: any) => {
        if (schemeVal[labels] == undefined) {
          schemeVal[labels] = colors[iterator % colors.length];
          iterator += 1;
        }
    //   });
    });

    let newNodes = [];
    GraphData.nodes.forEach((node) => {
        newNodes.push({
            id: node.id,
            size: 25,
            captionAlign: 'bottom',
            iconAlign: 'bottom',
            captionHtml: <b>Test</b>,
            caption: node.caption,
            color: schemeVal[node.label],
          });
      });

    return (
        <>
            <InteractiveNvlWrapper
                nodes={newNodes}
                rels={GraphData.links}
                nvlOptions={nvlOptions}
                // ref={nvlRef}
                mouseEventCallbacks={{ ...mouseEventCallbacks }}
                interactionOptions={{
                    selectOnClick: true,
                }}
            />
            <Popover
                open={open}
                anchorReference="anchorPosition"
                anchorPosition={{ top: mousePosition.y, left: mousePosition.x }}
                onClose={handlePopoverClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
            <Typography sx={{ p: 1, fontSize:10 }}>{popoverContent}</Typography>
        </Popover>
        </>
    )
}

export default GraphNVL
