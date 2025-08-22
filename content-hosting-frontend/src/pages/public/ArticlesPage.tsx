// import React, { useState, useEffect } from 'react';
// import { Content, ContentFilter } from '../../types';
// import { ContentService } from '../../utils/mockData';
// import ContentCard from '../../components/ui/ContentCard';
// import ContentFilterComponent from '../../components/ui/ContentFilter';
// import { BookOpenIcon } from '@heroicons/react/24/outline';
// import { Link } from 'react-router-dom';

// const ArticlesPage: React.FC = () => {
//   const [content, setContent] = useState<Content[]>([]);
//   const [filter, setFilter] = useState<ContentFilter>({
//     content_type: 'article',
//     search: '',
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadContent = () => {
//       setLoading(true);
//       try {
//         const publishedContent = ContentService.getPublishedContent(filter);
//         setContent(publishedContent);
//       } catch (error) {
//         console.error('Error loading content:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadContent();
//   }, [filter]);

//   const allTags = ContentService.getAllTags();

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="flex items-center justify-center">
//             <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
//             <span className="ml-2 text-gray-600">Loading articles...</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         {/* <div className="mb-8">
//           <div className="flex items-center mb-4">
//             <BookOpenIcon className="w-8 h-8 text-blue-600 mr-3" />
//             <h1 className="text-3xl font-bold text-gray-900">Articles</h1>
//           </div>
//           <p className="text-gray-600">
//             Discover insightful articles from our community of contributors
//           </p>
//         </div> */}
//         <div className="mb-8">
//           <div className="flex items-center mb-4">
//             <BookOpenIcon className="w-8 h-8 text-blue-600 mr-3" />
//             <h1 className="text-3xl font-bold text-gray-900">Articles</h1>
//             {/* ← Create Article button */}
//             <div className="ml-auto">
//               <Link to="/dashboard/create?type=article">
//                 <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
//                   Create Article
//                 </button>
//               </Link>
//             </div>
//           </div>
//           <p className="text-gray-600">
//             Discover insightful articles from our community of contributors
//           </p>
//         </div>

//         {/* Filter */}
//         <div className="mb-8">
//           <ContentFilterComponent
//             filter={filter}
//             onFilterChange={(newFilter) => setFilter({ ...newFilter, content_type: 'article' })}
//             availableTags={allTags}
//           />
//         </div>

//         {/* Content Grid */}
//         {content.length === 0 ? (
//           <div className="text-center py-12">
//             <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
//               <BookOpenIcon className="w-8 h-8 text-gray-400" />
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
//             <p className="text-gray-600">
//               {filter.search || filter.tag
//                 ? 'Try adjusting your search criteria'
//                 : 'No articles have been published yet'
//               }
//             </p>
//           </div>
//         ) : (
//           <>
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-xl font-semibold text-gray-900">
//                 {content.length} {content.length === 1 ? 'Article' : 'Articles'}
//               </h2>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {content.map((item) => (
//                 <ContentCard key={item.id} content={item} />
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// // add this so App.tsx can do `import ArticlesPage from './pages/public/ArticlesPage'`
// export default ArticlesPage;


// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { ContentService } from '../../utils/mockData';
// import { Content } from '../../types';
// import { BookOpenIcon } from '@heroicons/react/24/outline';
// import ContentCard from '../../components/ui/ContentCard';



// const ArticlesPage: React.FC = () => {
  
//     const [articles, setArticles] = useState<Content[]>([]);


//   useEffect(() => {
//     setArticles(
//       ContentService.getPublishedContent().filter(c => c.content_type === 'article')
//     );
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="mb-8 flex items-center">
//           <BookOpenIcon className="w-8 h-8 text-blue-600 mr-3" />
//           <h1 className="text-3xl font-bold">Articles</h1>
//           <div className="ml-auto">
//             <Link to="/dashboard/create?type=article">
//               <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
//                 Create Article
//               </button>
//             </Link>
//           </div>
//         </div>
//         {/* Article Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {articles.map(a => (
//             <ContentCard key={a.id} content={a} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ArticlesPage;

import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';
import { BookOpenIcon } from '@heroicons/react/24/outline';
import ContentCard from '../../components/ui/ContentCard';

type Row = {
  id: string;
  title: string;
  description: string | null;
  tags: string[] | null;
  published_at: string | null;
  content_type: 'article' | 'podcast';
};

export default function ArticlesPage() {
  const { search } = useLocation();
  const qs = new URLSearchParams(search);
  const typeParam = (qs.get('type') || 'article').toLowerCase();
  const contentType: 'article' | 'podcast' =
    typeParam === 'podcast' ? 'podcast' : 'article';

  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('content')
        .select('id,title,description,tags,published_at,content_type')
        .eq('status', 'published')
        .eq('content_type', contentType)
        .order('published_at', { ascending: false })
        .limit(24);

      if (!error) setItems(data as Row[] || []);
      setLoading(false);
    })();
  }, [contentType]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center">
          <BookOpenIcon className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold">
            {contentType === 'podcast' ? 'Podcasts' : 'Articles'}
          </h1>

        {/* Switcher + Create */}
          <div className="ml-auto">
              <Link to={`/dashboard/create?type=${contentType}`}>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Create {contentType === 'podcast' ? 'Podcast' : 'Article'}
          </button>
          </Link>
          </div>

</div>
        {loading ? (
          <div>Loading…</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((row) => (
              <ContentCard
                key={row.id}
                content={{
                  id: row.id,
                  title: row.title,
                  description: row.description || '',
                  content_type: row.content_type,
                  status: 'published',
                  tags: row.tags || [],
                  published_at: row.published_at || undefined,
                } as any}
              />
            ))}
            {items.length === 0 && (
              <div className="text-gray-600">No {contentType}s yet.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
