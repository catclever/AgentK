import React from 'react';
import { Renderer } from '@agent-k/core';
import { CanvasEngine } from '@agent-k/atoms';
import { PaperNode } from './PaperNode';

const MOCK_BOARD_SPEC = {
  id: "dynamic-board-1",
  components: [
    {
      id: "paper-1",
      type: "PaperNode",
      props: {
        title: "Attention Is All You Need",
        author: "Vaswani et al.",
        year: "2017",
        citationCount: 78000,
        isExpanded: true,
        isPinned: true
      },
      canvas: { cx: 800, cy: 120, width: 400, height: 200, rotation: 0, zIndex: 9000 },
      tendrils: ["paper-2", "paper-3"]
    },
    {
      id: "paper-2",
      type: "PaperNode",
      props: { title: "BERT: Pre-training of Deep Bidirectional Transformers", author: "Devlin et al.", year: "2018", citationCount: 65000 },
      canvas: { cx: 1000, cy: 450, width: 300, height: 60, rotation: 0, zIndex: 9000 }
    },
    {
      id: "paper-3",
      type: "PaperNode",
      props: { title: "GPT-3: Language Models are Few-Shot Learners", author: "Brown et al.", year: "2020", citationCount: 25000 },
      canvas: { cx: 450, cy: 400, width: 300, height: 60, rotation: 0, zIndex: 9000 }
    }
  ]
};

export const InfiniteBoard = ({ context: globalContext }: any) => {
  return (
    <CanvasEngine initialPage={MOCK_BOARD_SPEC} context={globalContext}>
      {({ page, context }) => (
        <Renderer 
          page={page} 
          components={{ PaperNode }} 
          context={context} 
        />
      )}
    </CanvasEngine>
  );
};
