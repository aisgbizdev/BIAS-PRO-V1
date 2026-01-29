import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/languageContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Brain, 
  Check, 
  X, 
  Edit, 
  Trash2, 
  RefreshCcw, 
  Search,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  BookOpen,
  Clock
} from 'lucide-react';

interface Knowledge {
  id: string;
  topic: string;
  narrative: string;
  keywords: string[];
  category: string;
  subcategory: string;
  sourceQuestion: string | null;
  sourceSession: string | null;
  confidenceScore: number;
  status: string;
  useCount: number;
  helpfulCount: number;
  notHelpfulCount: number;
  approvedBy: string | null;
  rejectionReason: string | null;
  createdAt: string;
  approvedAt: string | null;
  lastUsedAt: string | null;
}

export function KnowledgeBasePanel() {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [knowledge, setKnowledge] = useState<Knowledge[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ topic: '', narrative: '', keywords: '' });

  useEffect(() => {
    loadKnowledge();
  }, [activeTab]);

  const loadKnowledge = async () => {
    setLoading(true);
    try {
      const status = activeTab === 'all' ? '' : activeTab;
      const res = await fetch(`/api/knowledge${status ? `?status=${status}` : ''}`, { 
        credentials: 'include' 
      });
      if (!res.ok) throw new Error('Failed to load knowledge');
      const data = await res.json();
      setKnowledge(data);
    } catch (error) {
      console.error('Error loading knowledge:', error);
      toast({
        title: t('Error', 'Error'),
        description: t('Failed to load knowledge base', 'Gagal memuat knowledge base'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string, editedNarrative?: string) => {
    try {
      const res = await fetch(`/api/knowledge/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ narrative: editedNarrative }),
      });
      if (!res.ok) throw new Error('Failed to approve');
      
      setKnowledge(knowledge.filter(k => k.id !== id));
      toast({
        title: t('Approved!', 'Disetujui!'),
        description: t('Knowledge added to library', 'Knowledge ditambahkan ke library'),
      });
    } catch (error) {
      toast({
        title: t('Error', 'Error'),
        description: t('Failed to approve', 'Gagal menyetujui'),
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt(t('Reason for rejection (optional):', 'Alasan penolakan (opsional):'));
    
    try {
      const res = await fetch(`/api/knowledge/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) throw new Error('Failed to reject');
      
      setKnowledge(knowledge.filter(k => k.id !== id));
      toast({
        title: t('Rejected', 'Ditolak'),
        description: t('Knowledge rejected', 'Knowledge ditolak'),
      });
    } catch (error) {
      toast({
        title: t('Error', 'Error'),
        description: t('Failed to reject', 'Gagal menolak'),
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('Delete this knowledge?', 'Hapus knowledge ini?'))) return;
    
    try {
      const res = await fetch(`/api/knowledge/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete');
      
      setKnowledge(knowledge.filter(k => k.id !== id));
      toast({
        title: t('Deleted', 'Dihapus'),
        description: t('Knowledge deleted', 'Knowledge dihapus'),
      });
    } catch (error) {
      toast({
        title: t('Error', 'Error'),
        description: t('Failed to delete', 'Gagal menghapus'),
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (kb: Knowledge) => {
    setEditingId(kb.id);
    setEditData({
      topic: kb.topic,
      narrative: kb.narrative,
      keywords: kb.keywords.join(', '),
    });
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    
    try {
      const res = await fetch(`/api/knowledge/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          topic: editData.topic,
          narrative: editData.narrative,
          keywords: editData.keywords.split(',').map(k => k.trim()).filter(k => k),
        }),
      });
      if (!res.ok) throw new Error('Failed to update');
      
      setKnowledge(knowledge.map(k => 
        k.id === editingId 
          ? { ...k, topic: editData.topic, narrative: editData.narrative, keywords: editData.keywords.split(',').map(kw => kw.trim()) }
          : k
      ));
      setEditingId(null);
      toast({
        title: t('Updated', 'Diperbarui'),
        description: t('Knowledge updated', 'Knowledge diperbarui'),
      });
    } catch (error) {
      toast({
        title: t('Error', 'Error'),
        description: t('Failed to update', 'Gagal memperbarui'),
        variant: 'destructive',
      });
    }
  };

  const filteredKnowledge = knowledge.filter(k => 
    k.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.narrative.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.keywords.some(kw => kw.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const pendingCount = knowledge.filter(k => k.status === 'pending').length;

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-muted-foreground">{t('Loading...', 'Memuat...')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            {t('Knowledge Base', 'Knowledge Base')}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t('AI-extracted knowledge from conversations', 'Pengetahuan yang diekstrak AI dari percakapan')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <Badge className="bg-orange-500/20 text-orange-400">
              {pendingCount} {t('pending', 'menunggu')}
            </Badge>
          )}
          <Badge variant="outline" className="text-xs">
            {knowledge.length} {t('total', 'total')}
          </Badge>
          <Button variant="outline" size="sm" onClick={loadKnowledge}>
            <RefreshCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="pending" className="relative">
            {t('Pending', 'Menunggu')}
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full text-[10px] text-white flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">{t('Approved', 'Disetujui')}</TabsTrigger>
          <TabsTrigger value="rejected">{t('Rejected', 'Ditolak')}</TabsTrigger>
          <TabsTrigger value="all">{t('All', 'Semua')}</TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder={t('Search by topic, keywords...', 'Cari berdasarkan topik, keywords...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <TabsContent value={activeTab} className="mt-4">
          {filteredKnowledge.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-muted-foreground">
                  {t('No knowledge found', 'Tidak ada knowledge ditemukan')}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredKnowledge.map((kb) => (
                <Card key={kb.id} className={`
                  ${kb.status === 'pending' ? 'border-orange-500/30' : ''}
                  ${kb.status === 'approved' ? 'border-green-500/30' : ''}
                  ${kb.status === 'rejected' ? 'border-red-500/30' : ''}
                `}>
                  <CardContent className="p-4">
                    {editingId === kb.id ? (
                      <div className="space-y-3">
                        <Input
                          value={editData.topic}
                          onChange={(e) => setEditData({ ...editData, topic: e.target.value })}
                          placeholder={t('Topic', 'Topik')}
                        />
                        <Textarea
                          value={editData.narrative}
                          onChange={(e) => setEditData({ ...editData, narrative: e.target.value })}
                          placeholder={t('Narrative', 'Narasi')}
                          rows={4}
                        />
                        <Input
                          value={editData.keywords}
                          onChange={(e) => setEditData({ ...editData, keywords: e.target.value })}
                          placeholder={t('Keywords (comma separated)', 'Keywords (pisahkan dengan koma)')}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSaveEdit}>
                            <Check className="w-4 h-4 mr-1" />
                            {t('Save', 'Simpan')}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                            {t('Cancel', 'Batal')}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Sparkles className="w-4 h-4 text-purple-400" />
                              <h3 className="font-semibold">{kb.topic}</h3>
                              <Badge variant="outline" className="text-xs">
                                {kb.category}/{kb.subcategory}
                              </Badge>
                              {kb.confidenceScore && (
                                <Badge className={`text-xs ${kb.confidenceScore >= 0.8 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                  {Math.round(kb.confidenceScore * 100)}%
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-sm text-gray-300 mb-3">{kb.narrative}</p>
                            
                            <div className="flex flex-wrap gap-1 mb-3">
                              {kb.keywords.map((kw, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {kw}
                                </Badge>
                              ))}
                            </div>

                            <button
                              onClick={() => setExpandedId(expandedId === kb.id ? null : kb.id)}
                              className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
                            >
                              {expandedId === kb.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              {t('Source question', 'Pertanyaan sumber')}
                            </button>
                          </div>

                          <div className="flex flex-col gap-2">
                            {kb.status === 'pending' && (
                              <>
                                <Button 
                                  size="sm" 
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleApprove(kb.id)}
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleReject(kb.id)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            <Button size="sm" variant="outline" onClick={() => handleEdit(kb)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-400" onClick={() => handleDelete(kb.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {expandedId === kb.id && kb.sourceQuestion && (
                          <div className="mt-3 p-3 bg-gray-800/50 rounded-lg">
                            <p className="text-xs text-gray-400 mb-1">{t('Original question:', 'Pertanyaan asli:')}</p>
                            <p className="text-sm text-gray-300">{kb.sourceQuestion}</p>
                          </div>
                        )}

                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(kb.createdAt).toLocaleDateString('id-ID')}
                          </span>
                          {kb.useCount > 0 && (
                            <span>{kb.useCount}x {t('used', 'dipakai')}</span>
                          )}
                          {(kb.helpfulCount > 0 || kb.notHelpfulCount > 0) && (
                            <span className="flex items-center gap-2">
                              <span className="flex items-center gap-1 text-green-400">
                                <ThumbsUp className="w-3 h-3" /> {kb.helpfulCount}
                              </span>
                              <span className="flex items-center gap-1 text-red-400">
                                <ThumbsDown className="w-3 h-3" /> {kb.notHelpfulCount}
                              </span>
                            </span>
                          )}
                          {kb.rejectionReason && (
                            <span className="text-red-400">
                              {t('Reason:', 'Alasan:')} {kb.rejectionReason}
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
