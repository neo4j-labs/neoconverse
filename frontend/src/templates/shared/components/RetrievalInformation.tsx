import { useEffect, useRef, useState } from 'react';

import { Box, Flex, IconButton, Typography } from '@neo4j-ndl/react';
import { ClockIconOutline, FitToScreenIcon, ResetZoomIcon } from '@neo4j-ndl/react/icons';
import retrievalIllustration from '../assets/retrieval.png';

import type { NVL, HitTargets, Node, Relationship } from '@neo4j-nvl/base';
import { InteractiveNvlWrapper } from '@neo4j-nvl/react';
import type { MouseEventCallbacks } from '@neo4j-nvl/react';
// import { runRAGQuery, setDriver } from '../utils/Driver';

type RetrievalProps = {
  sources: Array<string>;
  model: string;
  timeTaken: number;
};

function RetrievalInformation(props: RetrievalProps) {
  const nvl = useRef<NVL | null>(null);

  const [nodes, setNodes] = useState<Node[]>([]);
  const [rels, setRels] = useState<Relationship[]>([]);

  const mouseEventCallbacks: MouseEventCallbacks = {
    onHover: (_element: Node | Relationship, _hitTargets: HitTargets, _evt: MouseEvent) => null,
    onRelationshipRightClick: (_rel: Relationship, _hitTargets: HitTargets, _evt: MouseEvent) => null,
    onNodeClick: (_node: Node, _hitTargets: HitTargets, _evt: MouseEvent) => null,
    onNodeRightClick: (_node: Node, _hitTargets: HitTargets, _evt: MouseEvent) => null,
    onNodeDoubleClick: (_node: Node, _hitTargets: HitTargets, _evt: MouseEvent) => null,
    onRelationshipClick: (_rel: Relationship, _hitTargets: HitTargets, _evt: MouseEvent) => null,
    onRelationshipDoubleClick: (_rel: Relationship, _hitTargets: HitTargets, _evt: MouseEvent) => null,
    onCanvasClick: (_evt: MouseEvent) => null,
    onCanvasDoubleClick: (_evt: MouseEvent) => null,
    onCanvasRightClick: (_evt: MouseEvent) => null,
    onDrag: (_nodes: Node[]) => null,
    onPan: (_panning: { x: number; y: number }, _evt: MouseEvent) => null,
    onZoom: (_zoomLevel: number) => null,
  };

  const fitNodes = () => {
    nvl.current?.fit(nodes.map((n) => n.id));
  };
  const resetZoom = () => {
    nvl.current?.resetZoom();
  };

  function retrieveSources() {
    // This is only for rendering the sources nodes. Ideally, for each of the sources, you would use your retrieval query to get the nodes and relationships
    // Example:
    // setDriver('bolt://localhost:7687', 'neo4j', 'password');
    // runRAGQuery(props.sources).then((nvlGraph) => {
    //     setNodes(nvlGraph.nodes);
    //     setRels(nvlGraph.relationships);
    // });
    const retrievedNodes = props.sources.map((source, index) => ({
      id: `${index}`,
      color: '#0A6190',
      captions: [{ value: source }],
    }));
    setNodes(retrievedNodes);
    setRels([{ id: '10', from: '0', to: '1', captions: [{ value: 'MOCKUP_DATA' }] }]);
  }

  useEffect(() => {
    retrieveSources();
  }, []);

  return (
    <Box className='n-bg-palette-neutral-bg-weak p-4'>
      <Flex flexDirection='row' className='flex flex-row p-6 items-center'>
        <img src={retrievalIllustration} alt='icon' style={{ width: 95, height: 95, marginRight: 10 }} />
        <Box className='flex flex-col'>
          <Typography variant='h2'>Retrieval information</Typography>
          <Typography className='mb-2' variant='body-medium'>
            To generate this response, we used the model <span className='font-bold italic'>{props.model}</span>.
            <Typography className='pl-1 italic' variant='body-small'>
              <ClockIconOutline className='w-4 h-4 inline-block mb-1' /> {props.timeTaken / 1000} seconds
            </Typography>
          </Typography>
        </Box>
      </Flex>
      <Box className='button-container flex justify-between mt-2'>
        <div
          style={{
            margin: 10,
            borderRadius: 25,
            border: '2px solid #2AADA5',
            height: 800,
            background: `rgb(var(--theme-palette-primary-bg-weaker))`,
            boxShadow: `2px -2px 10px grey`,
            position: 'relative',
          }}
        >
          <Flex
            flexDirection='row'
            className='flex flex-row p-6'
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              zIndex: 1000,
            }}
          >
            <IconButton className='n-size-token-7' ariaLabel='Fit to screen' onClick={fitNodes}>
              <FitToScreenIcon />
            </IconButton>
            <IconButton className='n-size-token-7' ariaLabel='Reset zoom' onClick={resetZoom}>
              <ResetZoomIcon />
            </IconButton>
          </Flex>
          <InteractiveNvlWrapper
            ref={nvl}
            nodes={nodes}
            rels={rels}
            onClick={() => null}
            mouseEventCallbacks={mouseEventCallbacks}
            nvlOptions={{
              initialZoom: 2,
              layout: 'd3Force',
              relationshipThreshold: 1,
            }}
          />
        </div>
      </Box>
    </Box>
  );
}

export default RetrievalInformation;
