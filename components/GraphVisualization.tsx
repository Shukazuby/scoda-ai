"use client";

import { useCallback, useMemo, useEffect } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import type { IdeaGraph } from "@/types";

interface GraphVisualizationProps {
  graphData: IdeaGraph;
}

/**
 * GraphVisualization component renders ideas as an interactive graph
 * Uses ReactFlow for visualization with LangGraph-compatible data structure
 */
export default function GraphVisualization({
  graphData,
}: GraphVisualizationProps) {
  // Transform idea graph data into ReactFlow format
  const initialNodes: Node[] = useMemo(() => {
    return graphData.nodes.map((node) => {
      // Determine node styling based on type
      const nodeStyles = {
        main: {
          backgroundColor: "#9333ea",
          color: "#ffffff",
          borderColor: "#a855f7",
          borderWidth: 2,
        },
        sub: {
          backgroundColor: "#7e22ce",
          color: "#ffffff",
          borderColor: "#9333ea",
          borderWidth: 2,
        },
        related: {
          backgroundColor: "#581c87",
          color: "#ffffff",
          borderColor: "#7e22ce",
          borderWidth: 1,
        },
      };

      const style = nodeStyles[node.type] || nodeStyles.related;

      return {
        id: node.id,
        type: "default",
        position: {
          x: Math.random() * 800,
          y: Math.random() * 600,
        },
        data: {
          label: (
            <div className="p-3">
              <div className="font-semibold text-sm mb-1">{node.label}</div>
              {node.platform && node.format && (
                <div className="text-xs mb-1 opacity-70">
                  {node.platform} • {node.format}
                </div>
              )}
              {node.description && (
                <div className="text-xs mt-1 opacity-80 max-w-[280px] line-clamp-2">
                  {node.description}
                </div>
              )}
              {node.hook && (
                <div className="text-xs mt-2 pt-2 border-t border-white/10 italic opacity-75 max-w-[280px]">
                  &quot;{node.hook}&quot;
                </div>
              )}
              {node.category && (
                <div className="text-xs mt-1 opacity-60">{node.category}</div>
              )}
              {node.postingTime && (
                <div className="text-xs mt-1 opacity-60">
                  📅 {node.postingTime}
                </div>
              )}
            </div>
          ),
        },
        style: {
          ...style,
          borderRadius: "12px",
          padding: 0,
          minWidth: "200px",
          maxWidth: "320px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
        },
      };
    });
  }, [graphData.nodes]);

  const initialEdges: Edge[] = useMemo(() => {
    return graphData.edges.map((edge) => {
      const edgeStyles = {
        hierarchical: {
          color: "#a855f7",
          strokeWidth: 2,
        },
        related: {
          color: "#7e22ce",
          strokeWidth: 1.5,
        },
        suggested: {
          color: "#581c87",
          strokeWidth: 1,
          strokeDasharray: "5,5",
        },
      };

      const style = edgeStyles[edge.type] || edgeStyles.related;

      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: "smoothstep",
        animated: true,
        style: style,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: style.color,
        },
        label: edge.type === "hierarchical" ? "→" : "",
        labelStyle: {
          fill: style.color,
          fontWeight: 600,
        },
      };
    });
  }, [graphData.edges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  // Layout nodes in a hierarchical structure
  const layoutNodes = useCallback(() => {
    const mainNodes = nodes.filter((n) => {
      const nodeData = graphData.nodes.find((nd) => nd.id === n.id);
      return nodeData?.type === "main";
    });

    const subNodes = nodes.filter((n) => {
      const nodeData = graphData.nodes.find((nd) => nd.id === n.id);
      return nodeData?.type === "sub";
    });

    const relatedNodes = nodes.filter((n) => {
      const nodeData = graphData.nodes.find((nd) => nd.id === n.id);
      return nodeData?.type === "related";
    });

    const newNodes = [...nodes];
    const spacing = 300;
    const centerX = 400;
    const centerY = 300;

    // Position main nodes in center
    mainNodes.forEach((node, index) => {
      const angle = (index * 2 * Math.PI) / mainNodes.length;
      const x = centerX + Math.cos(angle) * 150;
      const y = centerY + Math.sin(angle) * 150;
      const nodeIndex = newNodes.findIndex((n) => n.id === node.id);
      if (nodeIndex !== -1) {
        newNodes[nodeIndex] = { ...newNodes[nodeIndex], position: { x, y } };
      }
    });

    // Position sub nodes around their main nodes
    subNodes.forEach((node, index) => {
      const connectedEdge = edges.find((e) => e.target === node.id);
      if (connectedEdge) {
        const sourceNode = newNodes.find((n) => n.id === connectedEdge.source);
        if (sourceNode) {
          const angle = (index * 2 * Math.PI) / 8;
          const x = sourceNode.position.x + Math.cos(angle) * 200;
          const y = sourceNode.position.y + Math.sin(angle) * 200;
          const nodeIndex = newNodes.findIndex((n) => n.id === node.id);
          if (nodeIndex !== -1) {
            newNodes[nodeIndex] = {
              ...newNodes[nodeIndex],
              position: { x, y },
            };
          }
        }
      }
    });

    // Position related nodes around the periphery
    relatedNodes.forEach((node, index) => {
      const angle = (index * 2 * Math.PI) / relatedNodes.length;
      const x = centerX + Math.cos(angle) * 400;
      const y = centerY + Math.sin(angle) * 400;
      const nodeIndex = newNodes.findIndex((n) => n.id === node.id);
      if (nodeIndex !== -1) {
        newNodes[nodeIndex] = { ...newNodes[nodeIndex], position: { x, y } };
      }
    });

    setNodes(newNodes);
  }, [nodes, edges, graphData.nodes, setNodes]);

  // Auto-layout on mount and when graphData changes
  useEffect(() => {
    const timer = setTimeout(() => {
      layoutNodes();
    }, 100);
    return () => clearTimeout(timer);
  }, [graphData, layoutNodes]);

  return (
    <div className="relative w-full h-[600px] bg-gray-900/30 rounded-lg border border-gray-800 overflow-hidden">
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          className="bg-transparent"
        >
          <Background color="#4c1d95" gap={16} />
          <Controls className="bg-gray-800 border-gray-700" />
          <MiniMap
            className="bg-gray-800 border-gray-700"
            nodeColor={(node) => {
              const nodeData = graphData.nodes.find((n) => n.id === node.id);
              if (nodeData?.type === "main") return "#9333ea";
              if (nodeData?.type === "sub") return "#7e22ce";
              return "#581c87";
            }}
          />
        </ReactFlow>
      </ReactFlowProvider>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur-sm rounded-lg p-3 border border-gray-700 text-xs z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-primary-600 rounded"></div>
          <span className="text-gray-300">Content Pillars</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-primary-700 rounded"></div>
          <span className="text-gray-300">Content Plans</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary-800 rounded"></div>
          <span className="text-gray-300">Related Ideas</span>
        </div>
      </div>
    </div>
  );
}
