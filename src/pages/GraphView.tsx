import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useSidebar } from '@/contexts/SidebarContext';
import { GraphNode, GraphEdge, GraphData, GraphFilters } from '@/types/graph';
import { graphDataService } from '@/services/graphDataService';
import D3ForceGraph from '@/components/graph/D3ForceGraph';
import { 
  Network, 
  FileText, 
  FolderOpen, 
  Calendar,
  Filter,
  Search,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  Settings,
  Eye,
  EyeOff,
  Info,
  Code,
  Image,
  Cog
} from 'lucide-react';

const GraphView = () => {
  const { isSidebarOpen } = useSidebar();
  const graphRef = useRef<HTMLDivElement>(null);
  
  // State management
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [] });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [filters, setFilters] = useState<GraphFilters>({
    year: 'all',
    status: 'all',
    type: 'all',
    search: ''
  });
  const [viewMode, setViewMode] = useState<'full' | 'year' | 'type'>('full');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load graph data from service
  const loadGraphData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔧 Loading graph data...');
      
      // Check if we're in browser environment
      if (typeof window === 'undefined') {
        throw new Error('GraphView can only run in browser environment');
      }
      
      const data = await graphDataService.generateGraphData();
      console.log('✅ Graph data loaded:', data.nodes.length, 'nodes,', data.edges.length, 'edges');
      
      // Validate data structure
      if (!data.nodes || !Array.isArray(data.nodes)) {
        throw new Error('Invalid graph data: nodes missing or not array');
      }
      if (!data.edges || !Array.isArray(data.edges)) {
        throw new Error('Invalid graph data: edges missing or not array');
      }
      
      setGraphData(data);
    } catch (err) {
      console.error('❌ Error loading graph data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load graph data');
    } finally {
      setIsLoading(false);
    }
  };

  // Load filtered data when filters change
  const loadFilteredData = async () => {
    try {
      setIsLoading(true);
      const data = await graphDataService.getFilteredData(filters);
      setGraphData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to filter graph data');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initialize graph data
  useEffect(() => {
    loadGraphData();
  }, []);

  // Update data when filters change
  useEffect(() => {
    if (Object.values(filters).some(filter => filter !== 'all' && filter !== '')) {
      loadFilteredData();
    } else {
      loadGraphData();
    }
  }, [filters]);
  
  // Update filters
  const updateFilter = (key: keyof GraphFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Node click handler
  const handleNodeClick = async (nodeId: string) => {
    try {
      const nodeDetails = await graphDataService.getNodeDetails(nodeId);
      setSelectedNode(nodeDetails);
    } catch (err) {
      console.error('Error loading node details:', err);
    }
  };
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed': return 'bg-green-100 text-green-800 border-green-200';
      case 'processing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      case 'unprocessed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };
  
  // Get node type icon
  const getNodeIcon = (type: string, metadata?: any) => {
    switch (type) {
      case 'root': return <Network className="w-4 h-4" />;
      case 'year': return <Calendar className="w-4 h-4" />;
      case 'principle': return <FolderOpen className="w-4 h-4" />;
      case 'aspect': return <Settings className="w-4 h-4" />;
      case 'direktorat': return <Cog className="w-4 h-4" />;
      case 'document':
        // Use document type to determine icon
        switch (metadata?.documentType?.toLowerCase()) {
          case 'policy':
          case 'kebijakan': return <FileText className="w-4 h-4" />;
          case 'report':
          case 'laporan': return <FileText className="w-4 h-4" />;
          case 'minutes':
          case 'risalah': return <FileText className="w-4 h-4" />;
          case 'documentation':
          case 'dokumentasi': return <Image className="w-4 h-4" />;
          default: return <FileText className="w-4 h-4" />;
        }
      default: return <Info className="w-4 h-4" />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Topbar />
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg">
                <Network className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Data Swamp Explorer
                </h1>
                <p className="text-gray-600">
                  Navigate dan eksplorasi semua dokumen dan data dalam sistem
                </p>
              </div>
            </div>
          </div>
          
          {/* Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            {/* Filters */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center space-x-2">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Tahun</label>
                  <Select value={filters.year} onValueChange={(value) => updateFilter('year', value)}>
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Pilih tahun" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Tahun</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2020">2020</SelectItem>
                      <SelectItem value="2019">2019</SelectItem>
                      <SelectItem value="2018">2018</SelectItem>
                      <SelectItem value="2017">2017</SelectItem>
                      <SelectItem value="2016">2016</SelectItem>
                      <SelectItem value="2015">2015</SelectItem>
                      <SelectItem value="2014">2014</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Status</label>
                  <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="processed">Processed</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="unprocessed">Unprocessed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Type</label>
                  <Select value={filters.type} onValueChange={(value) => updateFilter('type', value)}>
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Pilih type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Type</SelectItem>
                      <SelectItem value="document">Dokumen</SelectItem>
                      <SelectItem value="principle">Prinsip GCG</SelectItem>
                      <SelectItem value="aspect">Aspek</SelectItem>
                      <SelectItem value="direktorat">Direktorat</SelectItem>
                      <SelectItem value="year">Tahun</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            {/* Search */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center space-x-2">
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  type="text"
                  placeholder="Cari file atau dokumen..."
                  value={filters.search || ''}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  className="w-full h-8 px-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </CardContent>
            </Card>
            
            {/* View Mode */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>View Mode</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={viewMode} onValueChange={(value: 'full' | 'year' | 'type') => setViewMode(value)}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Graph</SelectItem>
                    <SelectItem value="year">By Year</SelectItem>
                    <SelectItem value="type">By Type</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
            
            {/* Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex space-x-2">
                <Button size="sm" variant="outline" className="h-8 px-2">
                  <RotateCcw className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="outline" className="h-8 px-2">
                  <Download className="w-3 h-3" />
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Graph Area */}
            <div className="lg:col-span-3">
              <Card className="h-[600px]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Graph View</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {graphData.nodes.length} nodes
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">
                        {graphData.edges.length} edges
                      </Badge>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                          <ZoomIn className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                          <ZoomOut className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                          <Maximize2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 h-full">
                  <div 
                    ref={graphRef}
                    className="w-full h-full bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                          <p className="text-gray-600">Loading graph data...</p>
                          <p className="text-xs text-gray-500 mt-2">
                            Mapping your data swamp...
                          </p>
                        </div>
                      </div>
                    ) : error ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center text-red-600">
                          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Info className="w-8 h-8" />
                          </div>
                          <p className="text-lg font-medium mb-2">Failed to Load Data</p>
                          <p className="text-sm text-gray-600 mb-4">{error}</p>
                          <Button onClick={loadGraphData} size="sm">
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Retry
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <D3ForceGraph
                        data={graphData}
                        width={800}
                        height={550}
                        onNodeClick={(node) => setSelectedNode(node)}
                        onNodeHover={(node) => {/* Optional hover handler */}}
                        selectedNodeId={selectedNode?.id}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Info Panel */}
            <div className="space-y-4">
              {/* Node Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Node Details</CardTitle>
                  <CardDescription>
                    {selectedNode ? 'Selected node information' : 'Click a node to see details'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedNode ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        {getNodeIcon(selectedNode.type, selectedNode.metadata?.fileType)}
                        <span className="font-medium truncate">{selectedNode.label}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(selectedNode.status)}>
                          {selectedNode.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {selectedNode.type}
                        </Badge>
                      </div>

                      {selectedNode.metadata && (
                        <div className="space-y-2 text-sm">
                          {selectedNode.metadata.documentNumber && (
                            <div>
                              <span className="font-medium">Nomor Dokumen:</span>
                              <p className="text-xs text-gray-600 break-all mt-1">
                                {selectedNode.metadata.documentNumber}
                              </p>
                            </div>
                          )}
                          
                          {selectedNode.metadata.description && (
                            <div>
                              <span className="font-medium">Deskripsi:</span>
                              <p className="text-xs text-gray-600 mt-1">
                                {selectedNode.metadata.description}
                              </p>
                            </div>
                          )}
                          
                          <div className="grid grid-cols-2 gap-2">
                            {selectedNode.metadata.year && (
                              <div>
                                <span className="font-medium">Tahun:</span>
                                <p className="text-gray-600">{selectedNode.metadata.year}</p>
                              </div>
                            )}
                            {selectedNode.metadata.documentType && (
                              <div>
                                <span className="font-medium">Jenis:</span>
                                <p className="text-gray-600">{selectedNode.metadata.documentType}</p>
                              </div>
                            )}
                            {selectedNode.metadata.sizeFormatted && (
                              <div>
                                <span className="font-medium">Ukuran:</span>
                                <p className="text-gray-600">{selectedNode.metadata.sizeFormatted}</p>
                              </div>
                            )}
                            {selectedNode.metadata.direksi && (
                              <div>
                                <span className="font-medium">Direktorat:</span>
                                <p className="text-gray-600 text-xs">{selectedNode.metadata.direksi}</p>
                              </div>
                            )}
                            {selectedNode.metadata.gcgPrinciple && (
                              <div>
                                <span className="font-medium">Prinsip:</span>
                                <p className="text-gray-600">{selectedNode.metadata.gcgPrinciple}</p>
                              </div>
                            )}
                            {selectedNode.metadata.aspect && (
                              <div>
                                <span className="font-medium">Aspek:</span>
                                <p className="text-gray-600 text-xs">{selectedNode.metadata.aspect}</p>
                              </div>
                            )}
                          </div>
                          
                          {selectedNode.metadata.documentDate && (
                            <div className="bg-blue-50 p-2 rounded">
                              <span className="font-medium text-blue-800">Tanggal Dokumen:</span>
                              <p className="text-blue-700">{new Date(selectedNode.metadata.documentDate).toLocaleDateString('id-ID')}</p>
                            </div>
                          )}
                          
                          {selectedNode.metadata.confidentiality && (
                            <div className={`p-2 rounded ${
                              selectedNode.metadata.confidentiality === 'public' 
                                ? 'bg-green-50' 
                                : 'bg-yellow-50'
                            }`}>
                              <span className={`font-medium ${
                                selectedNode.metadata.confidentiality === 'public'
                                  ? 'text-green-800'
                                  : 'text-yellow-800'
                              }`}>Tingkat Akses:</span>
                              <p className={selectedNode.metadata.confidentiality === 'public'
                                ? 'text-green-700'
                                : 'text-yellow-700'
                              }>
                                {selectedNode.metadata.confidentiality === 'public' ? 'Publik' : 'Terbatas'}
                              </p>
                            </div>
                          )}
                          
                          {(selectedNode.metadata.totalDocuments !== undefined) && (
                            <div className="bg-purple-50 p-2 rounded">
                              <span className="font-medium text-purple-800">Dokumen:</span>
                              <p className="text-purple-700">
                                {selectedNode.metadata.publishedDocuments}/{selectedNode.metadata.totalDocuments} terpublikasi
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>Click a node to view details</p>
                      <p className="text-xs mt-1">
                        Jelajahi {graphData.nodes.length} node dan dokumen GCG
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Legend */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Legend</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Node Types:</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center space-x-2">
                        <Network className="w-3 h-3 text-purple-600" />
                        <span>Hub</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3 h-3 text-blue-600" />
                        <span>Tahun</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FolderOpen className="w-3 h-3 text-orange-600" />
                        <span>Prinsip GCG</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Settings className="w-3 h-3 text-green-600" />
                        <span>Aspek</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Cog className="w-3 h-3 text-indigo-600" />
                        <span>Direktorat</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-3 h-3 text-gray-600" />
                        <span>Dokumen</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Status:</h4>
                    <div className="space-y-1">
                      <Badge className="text-xs bg-green-100 text-green-800">Processed</Badge>
                      <Badge className="text-xs bg-yellow-100 text-yellow-800">Processing</Badge>
                      <Badge className="text-xs bg-red-100 text-red-800">Failed</Badge>
                      <Badge className="text-xs bg-gray-100 text-gray-800">Unprocessed</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphView;