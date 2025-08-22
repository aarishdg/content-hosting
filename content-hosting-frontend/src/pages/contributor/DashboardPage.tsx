// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';
// import { Content, ContentFilter } from '../../types';
// import { ContentService } from '../../utils/mockData';
// import ContentFilterComponent from '../../components/ui/ContentFilter';
// import { formatDate, formatRelativeTime } from '../../utils/helpers';
// import {
//   PlusIcon,
//   BookOpenIcon,
//   MicrophoneIcon,
//   PencilIcon,
//   TrashIcon,
//   EyeIcon,
//   ChartBarIcon,
// } from '@heroicons/react/24/outline';

// const DashboardPage: React.FC = () => {
//   const { user } = useAuth();
//   const [content, setContent] = useState<Content[]>([]);
//   const [filter, setFilter] = useState<ContentFilter>({
//     content_type: 'all',
//     status: 'all',
//     search: '',
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!user) return;

//     const loadContent = () => {
//       setLoading(true);
//       try {
//         const userContent = ContentService.getContentByAuthor(user.id, filter);
//         setContent(userContent);
//       } catch (error) {
//         console.error('Error loading content:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadContent();
//   }, [user, filter]);

//   const handleDeleteContent = async (id: string) => {
//     if (window.confirm('Are you sure you want to delete this content?')) {
//       try {
//         ContentService.deleteContent(id);
//         // Reload content
//         if (user) {
//           const userContent = ContentService.getContentByAuthor(user.id, filter);
//           setContent(userContent);
//         }
//       } catch (error) {
//         console.error('Error deleting content:', error);
//         alert('Failed to delete content');
//       }
//     }
//   };

//   const stats = {
//     total: content.length,
//     published: content.filter(c => c.status === 'published').length,
//     drafts: content.filter(c => c.status === 'draft').length,
//     articles: content.filter(c => c.content_type === 'article').length,
//     podcasts: content.filter(c => c.content_type === 'podcast').length,
//   };

//   const allTags = ContentService.getAllTags();

//   // if (!user || user.role !== 'contributor') {
//   //   return (
//   //     <div className="min-h-screen bg-gray-50">
//   //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//   //         <div className="text-center">
//   //           <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
//   //           <p className="text-gray-600">You need to be a contributor to access this page.</p>
//   //         </div>
//   //       </div>
//   //     </div>
//   //   );
//   // }

//   const denied = !user || user.role !== 'contributor';

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Content Dashboard</h1>
//               <p className="text-gray-600 mt-2">Manage your articles and podcasts</p>
//             </div>
//             <Link to="/dashboard/create" className="btn-primary flex items-center space-x-2">
//               <PlusIcon className="w-5 h-5" />
//               <span>Create Content</span>
//             </Link>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
//           <div className="card text-center">
//             <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-3">
//               <ChartBarIcon className="w-6 h-6 text-primary-600" />
//             </div>
//             <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
//             <div className="text-sm text-gray-600">Total Content</div>
//           </div>

//           <div className="card text-center">
//             <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3">
//               <EyeIcon className="w-6 h-6 text-green-600" />
//             </div>
//             <div className="text-2xl font-bold text-gray-900">{stats.published}</div>
//             <div className="text-sm text-gray-600">Published</div>
//           </div>

//           <div className="card text-center">
//             <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mx-auto mb-3">
//               <PencilIcon className="w-6 h-6 text-yellow-600" />
//             </div>
//             <div className="text-2xl font-bold text-gray-900">{stats.drafts}</div>
//             <div className="text-sm text-gray-600">Drafts</div>
//           </div>

//           <div className="card text-center">
//             <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3">
//               <BookOpenIcon className="w-6 h-6 text-blue-600" />
//             </div>
//             <div className="text-2xl font-bold text-gray-900">{stats.articles}</div>
//             <div className="text-sm text-gray-600">Articles</div>
//           </div>

//           <div className="card text-center">
//             <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3">
//               <MicrophoneIcon className="w-6 h-6 text-purple-600" />
//             </div>
//             <div className="text-2xl font-bold text-gray-900">{stats.podcasts}</div>
//             <div className="text-sm text-gray-600">Podcasts</div>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="mb-6">
//           <ContentFilterComponent
//             filter={filter}
//             onFilterChange={setFilter}
//             availableTags={allTags}
//             showStatusFilter={true}
//           />
//         </div>

//         {/* Content List */}
//         <div className="card">
//           <div className="flex items-center justify-between p-6 border-b border-gray-200">
//             <h2 className="text-lg font-medium text-gray-900">Your Content</h2>
//             <div className="text-sm text-gray-500">
//               {content.length} {content.length === 1 ? 'item' : 'items'}
//             </div>
//           </div>

//           {loading ? (
//             <div className="p-12 text-center">
//               <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
//               <span className="text-gray-600">Loading your content...</span>
//             </div>
//           ) : content.length === 0 ? (
//             <div className="p-12 text-center">
//               <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <BookOpenIcon className="w-8 h-8 text-gray-400" />
//               </div>
//               <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
//               <p className="text-gray-600 mb-6">
//                 {filter.search || filter.content_type !== 'all' || filter.status !== 'all'
//                   ? 'Try adjusting your filters'
//                   : 'Start by creating your first piece of content'
//                 }
//               </p>
//               {(!filter.search && filter.content_type === 'all' && filter.status === 'all') && (
//                 <Link to="/dashboard/create" className="btn-primary">
//                   Create Content
//                 </Link>
//               )}
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Content
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Type
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Updated
//                     </th>
//                     <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {content.map((item) => (
//                     <tr key={item.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4">
//                         <div>
//                           <div className="font-medium text-gray-900">{item.title}</div>
//                           <div className="text-sm text-gray-500 line-clamp-1">{item.description}</div>
//                           {item.tags.length > 0 && (
//                             <div className="flex gap-1 mt-1">
//                               {item.tags.slice(0, 3).map((tag) => (
//                                 <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
//                                   #{tag}
//                                 </span>
//                               ))}
//                               {item.tags.length > 3 && (
//                                 <span className="text-xs text-gray-500">+{item.tags.length - 3}</span>
//                               )}
//                             </div>
//                           )}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`badge ${item.content_type === 'article' ? 'badge-article' : 'badge-podcast'}`}>
//                           {item.content_type}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`badge ${item.status === 'published' ? 'badge-published' : 'badge-draft'}`}>
//                           {item.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         <div>{formatRelativeTime(item.updated_at)}</div>
//                         <div className="text-xs">{formatDate(item.updated_at)}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <div className="flex items-center justify-end space-x-2">
//                           {item.status === 'published' && (
//                             <Link
//                               to={`/content/${item.id}`}
//                               className="text-gray-400 hover:text-gray-600 transition-colors"
//                               title="View"
//                             >
//                               <EyeIcon className="w-4 h-4" />
//                             </Link>
//                           )}
//                           <Link
//                             to={`/dashboard/edit/${item.id}`}
//                             className="text-primary-600 hover:text-primary-700 transition-colors"
//                             title="Edit"
//                           >
//                             <PencilIcon className="w-4 h-4" />
//                           </Link>
//                           <button
//                             onClick={() => handleDeleteContent(item.id)}
//                             className="text-red-600 hover:text-red-700 transition-colors"
//                             title="Delete"
//                           >
//                             <TrashIcon className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;

// src/pages/contributor/DashboardPage.tsx
// import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import React, { useCallback, useEffect, useMemo, useState } from 'react';





type Row = {
  id: string;
  title: string;
  description: string | null;
  content_type: 'article' | 'podcast';
  status: 'draft' | 'published';
  tags: string[] | null;
  published_at: string | null;
  updated_at: string | null;
  audio_file_url: string | null;
};

const PAGE_SIZE = 10;

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // table
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // filters & pagination
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'article' | 'podcast'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState<number | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);

  // stats tiles
  const [countTotal, setCountTotal] = useState(0);
  const [countPublished, setCountPublished] = useState(0);
  const [countDrafts, setCountDrafts] = useState(0);
  const [countArticles, setCountArticles] = useState(0);
  const [countPodcasts, setCountPodcasts] = useState(0);

  // 🔐 contributors only
  // if (!user || user.role !== 'contributor') {
  //   return (
  //     <div className="min-h-screen bg-gray-50">
  //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  //         <div className="text-center">
  //           <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
  //           <p className="text-gray-600">You need to be a contributor to manage content.</p>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }
  const canManage = !!user && user.role === 'contributor';

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  // ===== fetchers =====
  // const fetchStats = async () => {
  //   const uid = (await supabase.auth.getUser()).data.user!.id;

  //   // total
  //   const totalQ = supabase.from('content').select('id', { count: 'exact', head: true })
  //     .eq('author_id', uid).is('deleted_at', null);

  //   const pubQ = supabase.from('content').select('id', { count: 'exact', head: true })
  //     .eq('author_id', uid).eq('status', 'published').is('deleted_at', null);

  //   const draftQ = supabase.from('content').select('id', { count: 'exact', head: true })
  //     .eq('author_id', uid).eq('status', 'draft').is('deleted_at', null);

  //   const artQ = supabase.from('content').select('id', { count: 'exact', head: true })
  //     .eq('author_id', uid).eq('content_type', 'article').is('deleted_at', null);

  //   const podQ = supabase.from('content').select('id', { count: 'exact', head: true })
  //     .eq('author_id', uid).eq('content_type', 'podcast').is('deleted_at', null);

  //   const [totalR, pubR, draftR, artR, podR] = await Promise.all([totalQ, pubQ, draftQ, artQ, podQ]);

  //   setCountTotal(totalR.count ?? 0);
  //   setCountPublished(pubR.count ?? 0);
  //   setCountDrafts(draftR.count ?? 0);
  //   setCountArticles(artR.count ?? 0);
  //   setCountPodcasts(podR.count ?? 0);
  // };
//   const fetchStats = useCallback(async () => {
//   if (!canManage || !user?.id) return;
//   const uid = user.id;

//   const totalQ = supabase.from('content').select('id', { count: 'exact', head: true })
//     .eq('author_id', uid).is('deleted_at', null);
//   const pubQ = supabase.from('content').select('id', { count: 'exact', head: true })
//     .eq('author_id', uid).eq('status', 'published').is('deleted_at', null);
//   const draftQ = supabase.from('content').select('id', { count: 'exact', head: true })
//     .eq('author_id', uid).eq('status', 'draft').is('deleted_at', null);
//   const artQ = supabase.from('content').select('id', { count: 'exact', head: true })
//     .eq('author_id', uid).eq('content_type', 'article').is('deleted_at', null);
//   const podQ = supabase.from('content').select('id', { count: 'exact', head: true })
//     .eq('author_id', uid).eq('content_type', 'podcast').is('deleted_at', null);

//   const [totalR, pubR, draftR, artR, podR] = await Promise.all([totalQ, pubQ, draftQ, artQ, podQ]);
//   setCountTotal(totalR.count ?? 0);
//   setCountPublished(pubR.count ?? 0);
//   setCountDrafts(draftR.count ?? 0);
//   setCountArticles(artR.count ?? 0);
//   setCountPodcasts(podR.count ?? 0);
// }, [canManage, user?.id]);

const fetchStats = useCallback(async () => {
  if (!canManage) return;

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user?.id) return;
  const uid = data.user.id;

  const totalQ = supabase.from('content').select('id', { count: 'exact', head: true })
    .eq('author_id', uid).is('deleted_at', null);
  const pubQ   = supabase.from('content').select('id', { count: 'exact', head: true })
    .eq('author_id', uid).eq('status', 'published').is('deleted_at', null);
  const draftQ = supabase.from('content').select('id', { count: 'exact', head: true })
    .eq('author_id', uid).eq('status', 'draft').is('deleted_at', null);
  const artQ   = supabase.from('content').select('id', { count: 'exact', head: true })
    .eq('author_id', uid).eq('content_type', 'article').is('deleted_at', null);
  const podQ   = supabase.from('content').select('id', { count: 'exact', head: true })
    .eq('author_id', uid).eq('content_type', 'podcast').is('deleted_at', null);

  const [totalR, pubR, draftR, artR, podR] = await Promise.all([totalQ, pubQ, draftQ, artQ, podQ]);

  setCountTotal(totalR.count ?? 0);
  setCountPublished(pubR.count ?? 0);
  setCountDrafts(draftR.count ?? 0);
  setCountArticles(artR.count ?? 0);
  setCountPodcasts(podR.count ?? 0);
}, [canManage, supabase]);


const fetchTags = useCallback(async () => {
  if (!canManage) return;

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user?.id) return;
  const uid = data.user.id;

  const { data: rows } = await supabase
    .from('content')
    .select('tags')
    .eq('author_id', uid)
    .is('deleted_at', null);

  const set = new Set<string>();
  (rows || []).forEach(r => (r.tags || []).forEach((t: string) => set.add(t)));
  setAllTags(['all', ...Array.from(set).sort()]);
}, [canManage, supabase]);


const fetchContent = useCallback(async () => {
  if (!canManage) return;
  setLoading(true);
  setError(null);

  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user?.id) throw new Error('Not authenticated');
    const uid = data.user.id;

    let q = supabase
      .from('content')
      .select('id,title,description,content_type,status,tags,published_at,updated_at,audio_file_url', { count: 'exact' })
      .eq('author_id', uid)
      .is('deleted_at', null);

    if (typeFilter !== 'all')  q = q.eq('content_type', typeFilter);
    if (statusFilter !== 'all') q = q.eq('status', statusFilter);
    if (tagFilter !== 'all')    q = q.contains('tags', [tagFilter]);
    if (search.trim())          q = q.ilike('title', `%${search.trim()}%`);

    const from = (page - 1) * PAGE_SIZE;
    const to   = from + PAGE_SIZE - 1;

    const { data: rows, error: qErr, count } = await q
      .order('updated_at', { ascending: false, nullsFirst: false })
      .range(from, to);

    if (qErr) throw qErr;
    setItems((rows || []) as Row[]);
    setTotal(count ?? null);
  } catch (e: any) {
    console.error(e);
    setError(e?.message ?? 'Failed to load content');
  } finally {
    setLoading(false);
  }
}, [canManage, typeFilter, statusFilter, tagFilter, search, page, supabase]);



  // const fetchTags = async () => {
  //   const uid = (await supabase.auth.getUser()).data.user!.id;
  //   const { data } = await supabase
  //     .from('content')
  //     .select('tags')
  //     .eq('author_id', uid)
  //     .is('deleted_at', null);
  //   const set = new Set<string>();
  //   (data || []).forEach(r => (r.tags || []).forEach((t: string) => set.add(t)));
  //   setAllTags(['all', ...Array.from(set).sort()]);
  // };

  // const fetchContent = async () => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const { data: authData, error: authErr } = await supabase.auth.getUser();
  //     if (authErr || !authData?.user) throw new Error('Not authenticated');

  //     let q = supabase
  //       .from('content')
  //       .select('id,title,description,content_type,status,tags,published_at,updated_at,audio_file_url', { count: 'exact' })
  //       .eq('author_id', authData.user.id)
  //       .is('deleted_at', null);

  //     if (typeFilter !== 'all') q = q.eq('content_type', typeFilter);
  //     if (statusFilter !== 'all') q = q.eq('status', statusFilter);
  //     if (tagFilter !== 'all') q = q.contains('tags', [tagFilter]);
  //     if (search.trim()) q = q.ilike('title', `%${search.trim()}%`);

  //     const { data, error, count } = await q
  //       .order('updated_at', { ascending: false, nullsFirst: false })
  //       .range(from, to);

  //     if (error) throw error;
  //     setItems((data || []) as Row[]);
  //     setTotal(count ?? null);
  //   } catch (e: any) {
  //     console.error(e);
  //     setError(e?.message ?? 'Failed to load content');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   void fetchStats();
  //   void fetchTags();
  // }, []);

  // useEffect(() => {
  //   void fetchContent();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [typeFilter, statusFilter, tagFilter, search, page]);
  // ✅ use the callbacks as dependencies
  useEffect(() => { fetchStats(); fetchTags(); }, [fetchStats, fetchTags]);
  useEffect(() => { fetchContent(); }, [fetchContent]);


  useEffect(() => {
  if (!canManage) return;
  void fetchStats();
  void fetchTags();
}, [canManage]);

useEffect(() => {
  if (!canManage) return;
  void fetchContent();
}, [canManage, typeFilter, statusFilter, tagFilter, search, page]);

  // ===== helpers =====
  const totalPages = useMemo(() => (total ? Math.max(1, Math.ceil(total / PAGE_SIZE)) : 1), [total]);

  const fmtDate = (iso?: string | null) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return isNaN(d.getTime()) ? '—' : d.toLocaleDateString();
  };

  const confirmAndDelete = async (id: string) => {
    // if (!confirm('Soft delete this item?')) return;
    if (!window.confirm('Soft delete this item?')) return;

    const { error } = await supabase.from('content').update({ deleted_at: new Date().toISOString() }).eq('id', id);
    if (error) alert(error.message); else await fetchContent();
  };

  const togglePublish = async (row: Row) => {
    const toPublished = row.status !== 'published';
    const { error } = await supabase
      .from('content')
      .update({
        status: toPublished ? 'published' : 'draft',
        published_at: toPublished ? new Date().toISOString() : null,
      })
      .eq('id', row.id);
    if (error) alert(error.message); else await fetchContent();
  };

  // ===== UI =====
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Content Dashboard</h1>
          <Link to="/dashboard/create?type=article">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              + Create Content
            </button>
          </Link>
        </div>

        {/* tiles */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Tile label="Total Content" value={countTotal} />
          <Tile label="Published" value={countPublished} />
          <Tile label="Drafts" value={countDrafts} />
          <Tile label="Articles" value={countArticles} />
          <Tile label="Podcasts" value={countPodcasts} />
        </div>

        {/* filters */}
        {/* filters */}
<div className="flex flex-col md:flex-row gap-3 mb-4 items-stretch">
  <input
    placeholder="Search content..."
    className="flex-1 border rounded px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    value={search}
    onChange={(e) => { setPage(1); setSearch(e.target.value); }}
  />

  <div className="flex gap-3">
    <SelectField
      value={typeFilter}
      onChange={(v) => { setPage(1); setTypeFilter(v as any); }}
    >
      <option value="all">All Types</option>
      <option value="article">Articles</option>
      <option value="podcast">Podcasts</option>
    </SelectField>

    <SelectField
      value={statusFilter}
      onChange={(v) => { setPage(1); setStatusFilter(v as any); }}
    >
      <option value="all">All Status</option>
      <option value="draft">Draft</option>
      <option value="published">Published</option>
    </SelectField>

    <SelectField
      value={tagFilter}
      onChange={(v) => { setPage(1); setTagFilter(v); }}
    >
      {allTags.map(t => (
        <option key={t} value={t}>
          {t === 'all' ? 'All Tags' : t}
        </option>
      ))}
    </SelectField>
  </div>
</div>

        {/* <div className="flex flex-col md:flex-row gap-3 mb-4">
          <input
            placeholder="Search content..."
            className="flex-1 border rounded px-3 py-2"
            value={search}
            onChange={(e) => { setPage(1); setSearch(e.target.value); }}
          />
          <select className="border rounded px-3 py-2" value={typeFilter}
                  onChange={(e) => { setPage(1); setTypeFilter(e.target.value as any); }}>
            <option value="all">All Types</option>
            <option value="article">Articles</option>
            <option value="podcast">Podcasts</option>
          </select>
          <select className="border rounded px-3 py-2" value={statusFilter}
                  onChange={(e) => { setPage(1); setStatusFilter(e.target.value as any); }}>
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <select className="border rounded px-3 py-2" value={tagFilter}
                  onChange={(e) => { setPage(1); setTagFilter(e.target.value); }}>
            {allTags.map(t => <option key={t} value={t}>{t === 'all' ? 'All Tags' : t}</option>)}
          </select>
        </div> */}

        {/* table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="grid grid-cols-12 px-4 py-3 bg-gray-50 text-sm font-semibold text-gray-700">
            <div className="col-span-5">Content</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1">Updated</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {loading ? (
            <div className="p-6 text-gray-600">Loading…</div>
          ) : error ? (
            <div className="p-6 text-red-600">{error}</div>
          ) : items.length === 0 ? (
            <div className="p-6 text-gray-600">No items found.</div>
          ) : (
            items.map((row) => (
              <div key={row.id} className="grid grid-cols-12 px-4 py-4 border-t text-sm items-center">
                <div className="col-span-5">
                  <div className="font-semibold">{row.title}</div>
                  {row.description && <div className="text-gray-600 line-clamp-1">{row.description}</div>}
                  {(row.tags || []).length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {row.tags!.map(t => <span key={t} className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs">#{t}</span>)}
                    </div>
                  )}
                </div>
                <div className="col-span-2 capitalize">{row.content_type}</div>
                <div className="col-span-2">
                  <span className={`px-2 py-1 rounded text-xs ${row.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {row.status}
                  </span>
                </div>
                <div className="col-span-1">{fmtDate(row.updated_at || row.published_at)}</div>
                <div className="col-span-2 flex justify-end gap-2">
                  <button className="px-3 py-1 rounded border hover:bg-gray-50"
                          onClick={() => navigate(`/dashboard/edit/${row.id}`)}>
                    Edit
                  </button>
                  <button className="px-3 py-1 rounded border hover:bg-gray-50"
                          onClick={() => togglePublish(row)}>
                    {row.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>
                  <button className="px-3 py-1 rounded border text-red-600 hover:bg-red-50"
                          onClick={() => confirmAndDelete(row.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <button className="px-3 py-1 rounded border disabled:opacity-50"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}>
              Prev
            </button>
            <div className="text-sm text-gray-600">Page {page} / {totalPages}</div>
            <button className="px-3 py-1 rounded border disabled:opacity-50"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}>
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Tile({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
}

// function SelectField({
//   value,
//   onChange,
//   children,
//   className = '',
// }: {
//   value: string;
//   onChange: (v: string) => void;
//   children: React.ReactNode;
//   className?: string;
// }) {
//   return (
//     <div className={`relative ${className}`}>
//       <select
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="appearance-none border rounded px-3 py-2 pr-9 bg-white text-gray-800 shadow-sm
//                    focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px] cursor-pointer"
//       >
//         {children}
//       </select>
//       <ChevronDownIcon
//         className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500"
//       />
//     </div>
//   );
// }
function SelectField({
  value,
  onChange,
  children,
  className = '',
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          appearance-none [-webkit-appearance:none] [-moz-appearance:none] bg-white bg-none
    border rounded px-3 py-2 pr-9 text-gray-800 shadow-sm
    focus:outline-none focus:ring-2 focus:ring-blue-500
    min-w-[140px] cursor-pointer
  "
      >
        {children}
      </select>

      {/* keep your custom chevron */}
      <ChevronDownIcon
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500"
      />
    </div>
  );
}

