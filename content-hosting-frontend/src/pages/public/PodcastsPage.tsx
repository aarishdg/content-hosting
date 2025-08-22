// import React, { useState, useEffect } from 'react';

// import { supabase } from '../../utils/supabaseClient';

// import ContentCard from '../../components/ui/ContentCard';
// import { Content } from '../../types';      // ← import your full Content type
// import { Link } from 'react-router-dom';
// const PodcastsPage: React.FC = () => {
//   const [podcasts, setPodcasts] = useState<Content[]>([]);

//   useEffect(() => {
//     (async () => {
//       const { data, error } = await supabase
//         .from('content')
//         .select('*')
//         .eq('content_type', 'podcast')
//         .eq('status', 'published')
//         .order('published_at', { ascending: false });
//       if (error) {
//         console.error(error);
//       } else {
//         setPodcasts(data);
//       }
//     })();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="mb-8 flex items-center">
//           <h1 className="text-3xl font-bold">Podcasts</h1>
//           <div className="ml-auto">
//             <Link to="/dashboard/create?type=podcast">
//               <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
//                 Create Podcast
//               </button>
//             </Link>
//           </div>
//         </div>

//         {/* Grid of podcast cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {podcasts.map((p) => (
//   <ContentCard key={p.id} content={p}>
//     <audio controls src={p.audio_file_url!} className="w-full mt-2" />
//     <p className="text-sm text-gray-500 mt-1">
//       {p.published_at
//         ? `Published on ${new Date(p.published_at).toLocaleDateString()}`
//         : 'Not yet published'}
//     </p>
//   </ContentCard>
// ))}

//         </div>
//       </div>
//     </div>
//   );
// };

// export default PodcastsPage;
// src/pages/public/PodcastsPage.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import ContentCard from '../../components/ui/ContentCard';
import { Link } from 'react-router-dom';

export default function PodcastsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from('content')
        .select('id,title,description,tags,published_at,content_type')
        .eq('status','published')
        .eq('content_type','podcast')
        .order('published_at',{ ascending:false })
        .limit(24);
      setItems(data || []);
      setLoading(false);
    })();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center">
          <h1 className="text-3xl font-bold">Podcasts</h1>
          <div className="ml-auto">
            <Link to="/dashboard/create?type=podcast">
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Create Podcast
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
                  content_type: 'podcast',
                  status: 'published',
                  tags: row.tags || [],
                  published_at: row.published_at || undefined,
                } as any}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
