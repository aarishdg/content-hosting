// // src/pages/contributor/CreateContentPage.tsx
// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';
// import { ContentFormData } from '../../types';
// import { ContentService } from '../../utils/mockData';
// import ContentForm from '../../components/forms/ContentForm';
// import { supabase } from '../../utils/supabaseClient';


// type FormValues = {
//   type: 'article' | 'podcast';
//   title: string;
//   description?: string;
//   tags: string[];
//   richText: string;   // your Tiptap/Quill HTML/JSON
//   publish: boolean;
//   file?: File;        // only used if type === 'podcast'
// };

// async function onSubmit(formValues: FormValues) {
//   if (formValues.type === 'article') {
//     await handleCreateArticle({
//       title: formValues.title,
//       description: formValues.description,
//       tags: formValues.tags,
//       richHTML: formValues.richText,
//       publish: formValues.publish,
//     });
//   } else if (formValues.type === 'podcast' && formValues.file) {
//     await handleCreatePodcast({
//       title: formValues.title,
//       description: formValues.description,
//       tags: formValues.tags,
//       file: formValues.file,
//       richHTML: formValues.richText,
//       publish: formValues.publish,
//     });
//   }
//   // Redirect back to dashboard after success
// }


// async function handleCreateArticle({
//   title,
//   description,
//   tags,
//   richHTML,
//   publish,
// }: {
//   title: string;
//   description?: string;
//   tags: string[];
//   richHTML: string; // TipTap/Quill HTML/JSON string
//   publish: boolean;
// }) {
//   const { data: { user }, error: userErr } = await supabase.auth.getUser();
//   if (userErr || !user) throw new Error('Not authenticated');

//   const { error } = await supabase.from('content').insert([{
//     title,
//     description,
//     tags,
//     content_type: 'article',
//     status: publish ? 'published' : 'draft',
//     rich_text_content: richHTML,
//     author_id: user.id,
//   }]);

//   if (error) {
//   console.error('Insert error:', error);
//   alert(`Insert failed: ${error.message}`);
// }

// async function handleCreatePodcast({
//   title,
//   description,
//   tags,
//   file,       // File from <input type="file" accept="audio/*" />
//   richHTML,   // optional show notes
//   publish,
// }: {
//   title: string;
//   description?: string;
//   tags: string[];
//   file: File;
//   richHTML?: string;
//   publish: boolean;
// }) {
//   const { data: { user }, error: userErr } = await supabase.auth.getUser();
//   if (userErr || !user) throw new Error('Not authenticated');

//   // 1) Create draft row to get content_id
//   const { data: row, error: insertErr } = await supabase
//     .from('content')
//     .insert([{
//       title,
//       description,
//       tags,
//       content_type: 'podcast',
//       status: 'draft',
//       rich_text_content: richHTML ?? null,
//       author_id: user.id,
//     }])
//     .select('id')
//     .single();

//   if (insertErr) throw insertErr;
//   const contentId = row.id as string;

//   // 2) Upload audio to bucket `podcasts` at user/{uid}/{content_id}/{filename}
//   const storagePath = `user/${user.id}/${contentId}/${file.name}`;
//   const { error: uploadErr } = await supabase
//     .storage.from('podcasts')
//     .upload(storagePath, file, { upsert: true });
//   if (uploadErr) throw uploadErr;

//   // 3) Update DB with audio_file_url and final status
//   const { error: updateErr } = await supabase
//     .from('content')
//     .update({
//       audio_file_url: storagePath,
//       status: publish ? 'published' : 'draft',
//     })
//     .eq('id', contentId);
//   if (updateErr) throw updateErr;

//   // (Optional) signed URL for immediate playback
//   // const { data: signed } = await supabase
//   //  .storage.from('podcasts').createSignedUrl(storagePath, 3600);
//   // return signed?.signedUrl;
// }



// const CreateContentPage: React.FC = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const { search } = useLocation();
//   const params = new URLSearchParams(search);

//   const onlyArticle = params.get('type') === 'article';
//   const onlyPodcast = params.get('type') === 'podcast';
//   const [loading, setLoading] = useState(false);

//   // Only contributors can create
//   if (!user || user.role !== 'contributor') {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="text-center">
//             <h1 className="text-2xl font-bold text-gray-900 mb-4">
//               Access Denied
//             </h1>
//             <p className="text-gray-600">
//               You need to be a contributor to create content.
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

// //   const handleSubmit = async (formData: ContentFormData) => {
// //   setLoading(true);
// //   try {
// //     // Simulate network/API delay
// //     await new Promise<void>((resolve) => setTimeout(resolve, 500));

// //     // Persist the new podcast
// //     ContentService.createContent({
// //       ...formData,
// //       author_id: user.id,
// //     });

// //     // Redirect to the public podcasts list
// //     navigate('/podcasts');
// //   } catch (err) {
// //     console.error('Error creating content:', err);
// //     alert('Failed to create podcast. Please try again.');
// //   } finally {
// //     setLoading(false);
// //   }
// // };
// const handleSubmit = async (formData: ContentFormData) => {
//   setLoading(true);
//   try {
//     // 1) If this is a podcast, upload the file & get its URL + duration
//     let audio_file_url: string | null = null;
//     let audio_duration: number | null = null;

//     if (formData.content_type === 'podcast' && formData.audio_file) {
//       const file = formData.audio_file;
//       const fileName = `${Date.now()}_${file.name}`;

//       // Upload to the "podcasts" bucket
//       const { data: uploadData, error: uploadError } = await supabase
//         .storage
//         .from('podcasts')
//         .upload(fileName, file);
//       if (uploadError) throw uploadError;

//       // Get its public URL (no error field returned here)
//       const { data } = supabase
//         .storage
//         .from('podcasts')
//         .getPublicUrl(uploadData.path);
//       audio_file_url = data.publicUrl;

//       // Compute duration via an <audio> element
//       const audio = new Audio(audio_file_url);
//       await new Promise<void>((resolve) => {
//         audio.onloadedmetadata = () => resolve();
//       });
//       audio_duration = Math.round(audio.duration);
//     }

//     // 2) Build the row payload
//     const nowIso = new Date().toISOString();
//     const isPublishing = formData.status === 'published';

//     const payload = {
//       title: formData.title,
//       description: formData.description,
//       content_type: formData.content_type,    // article or podcast
//       status: formData.status,
//       tags: formData.tags,
//       author_id: user.id,
//       published_at: isPublishing ? nowIso : null,
//       rich_text_content:
//         formData.content_type === 'article'
//           ? formData.rich_text_content
//           : null,
//       audio_file_url,
//       audio_duration,
//     };

//     // 3) Insert into Supabase
//     const { error: insertError } = await supabase
//       .from('content')
//       .insert(payload);
//     if (insertError) throw insertError;

//     // 4) Redirect to the correct list
//     navigate(
//       formData.content_type === 'podcast' ? '/podcasts' : '/articles'
//     );
//   } catch (err: any) {
//     console.error('Error saving content:', err);
//     alert(err.message || 'Failed to save. Please try again.');
//   } finally {
//     setLoading(false);
//   }
// };


//   const handleCancel = () => {
//     navigate('/dashboard');
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="mb-6 flex items-center justify-between">
//           <h1 className="text-3xl font-bold text-gray-900">
//             {onlyArticle
//               ? 'Create Article'
//               : onlyPodcast
//               ? 'Create Podcast'
//               : 'Create Content'}
//           </h1>
//           <button
//             onClick={handleCancel}
//             className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
//           >
//             Cancel
//           </button>
//         </div>

//         {/* Subheading */}
//         <p className="text-gray-600 mb-8">
//           {onlyArticle
//             ? 'Draft your article below — no podcast fields will appear.'
//             : onlyPodcast
//             ? 'Upload your podcast audio below — no article fields will appear.'
//             : 'Choose article or podcast, then fill in the details.'}
//         </p>

//         {/* Form */}
//         <ContentForm
//           onlyArticle={onlyArticle}
//           onlyPodcast={onlyPodcast}
//           onSubmit={handleSubmit}
//           onCancel={handleCancel}
//           loading={loading}
//           isEditing={false}
//         />
//       </div>
//     </div>
//   );
// };

// export default CreateContentPage;
// src/pages/contributor/CreateContentPage.tsx
// src/pages/contributor/CreateContentPage.tsx
// src/pages/contributor/CreateContentPage.tsx
import { v4 as uuidv4 } from 'uuid';

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ContentFormData } from '../../types';
import ContentForm from '../../components/forms/ContentForm';
import { supabase } from '../../utils/supabaseClient';

const CreateContentPage: React.FC = () => {
  const { user } = useAuth(); // expects { id, role, email } on user
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const onlyArticle = params.get('type') === 'article';
  const onlyPodcast = params.get('type') === 'podcast';
  const [loading, setLoading] = useState(false);

  // 🔐 Gate: only contributors can create (restores your original UI flow)
  if (!user || user.role !== 'contributor') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600">You need to be a contributor to create content.</p>
          </div>
        </div>
      </div>
    );
  }
const handleSubmit = async (formData: ContentFormData) => {
  console.log('[handleSubmit] raw formData →', formData);

  // derive missing fields from the query (?type=article / ?type=podcast)
  const derivedContentType =
    (onlyArticle && 'article') ||
    (onlyPodcast && 'podcast') ||
    (formData.content_type as 'article' | 'podcast');

  const derivedStatus =
    (formData as any).status ??
    ((formData as any).publish ? 'published' : 'draft');

  if (!derivedContentType) {
    alert('Content type missing — cannot submit.');
    return;
  }

  setLoading(true);
  try {
    const { data: authData, error: authErr } = await supabase.auth.getUser();
    if (authErr || !authData?.user) throw new Error('Not authenticated');
    const uid = authData.user.id;

    if (derivedContentType === 'article') {
      const payload = {
        title: formData.title,
        description: formData.description,
        content_type: 'article',
        status: derivedStatus,
        tags: formData.tags ?? [],
        author_id: uid,
        published_at: derivedStatus === 'published' ? new Date().toISOString() : null,
        rich_text_content: formData.rich_text_content ?? '',
        audio_file_url: null,
        audio_duration: null,
      };
      console.log('[handleSubmit] inserting article payload →', payload);
      const { error } = await supabase.from('content').insert(payload);
      if (error) throw error;
      navigate('/articles');
      return;
    }

    if (derivedContentType === 'podcast') {
      if (!formData.audio_file) throw new Error('Please attach an audio file (.mp3/.m4a).');

      const file = formData.audio_file;
      // Pre-generate the row id so we can upload first and then insert with audio_file_url set
      const contentId = uuidv4();
      const storagePath = `user/${uid}/${contentId}/${Date.now()}_${file.name}`;

      // 1) Upload to Storage first
      const { error: upErr } = await supabase
        .storage
        .from('podcasts')
        .upload(storagePath, file, { upsert: true });
      if (upErr) throw upErr;

      // 2) Insert row WITH audio_file_url already set (passes the CHECK)
      const finalStatus = derivedStatus === 'published' ? 'published' : 'draft';
      const { error: insertErr } = await supabase
        .from('content')
        .insert([{
          id: contentId, // use the UUID we generated
          title: formData.title,
          description: formData.description,
          content_type: 'podcast',
          status: finalStatus,
          tags: formData.tags ?? [],
          author_id: uid,
          published_at: finalStatus === 'published' ? new Date().toISOString() : null,
          rich_text_content: formData.rich_text_content ?? null,
          audio_file_url: storagePath,
          audio_duration: null,
        }]);
  if (insertErr) throw insertErr;

  navigate('/podcasts');
  // navigate('/articles?type=podcast');
  return;
}


    // if (derivedContentType === 'podcast') {
    //   if (!formData.audio_file) throw new Error('Please attach an audio file (.mp3/.m4a).');

    //   const { data: created, error: insertErr } = await supabase
    //     .from('content')
    //     .insert([{
    //       title: formData.title,
    //       description: formData.description,
    //       content_type: 'podcast',
    //       status: 'draft',
    //       tags: formData.tags ?? [],
    //       author_id: uid,
    //       published_at: null,
    //       rich_text_content: formData.rich_text_content ?? null,
    //       audio_file_url: null,
    //       audio_duration: null,
    //     }])
    //     .select('id')
    //     .single();
    //   if (insertErr) throw insertErr;

    //   const contentId = created.id as string;
    //   const file = formData.audio_file!;
    //   const storagePath = `user/${uid}/${contentId}/${Date.now()}_${file.name}`;

    //   const { error: upErr } = await supabase.storage.from('podcasts').upload(storagePath, file, { upsert: true });
    //   if (upErr) throw upErr;

    //   const finalStatus = derivedStatus === 'published' ? 'published' : 'draft';
    //   const { error: updErr } = await supabase
    //     .from('content')
    //     .update({
    //       audio_file_url: storagePath,
    //       status: finalStatus,
    //       published_at: finalStatus === 'published' ? new Date().toISOString() : null,
    //     })
    //     .eq('id', contentId);
    //   if (updErr) throw updErr;

    //   // navigate('/podcasts');
    //   navigate('/articles?type=podcast');

    //   return;
    // }

    alert('Unknown content type');
  } catch (e: any) {
    console.error('Create error:', e);
    alert(e?.message ?? 'Failed to create content');
  } finally {
    setLoading(false);
  }
};

  // const handleSubmit = async (formData: ContentFormData) => {
  //   setLoading(true);
  //   try {
  //     const { data: authData, error: authErr } = await supabase.auth.getUser();
  //     if (authErr || !authData?.user) throw new Error('Not authenticated');
  //     const uid = authData.user.id;

  //     // 📝 Article: insert straight to DB (no storage upload)
  //     if (formData.content_type === 'article') {
  //       const payload = {
  //         title: formData.title,
  //         description: formData.description,
  //         content_type: 'article',
  //         status: formData.status, // 'draft' | 'published'
  //         tags: formData.tags ?? [],
  //         author_id: uid,
  //         published_at: formData.status === 'published' ? new Date().toISOString() : null,
  //         rich_text_content: formData.rich_text_content ?? '',
  //         audio_file_url: null,
  //         audio_duration: null,
  //       };

  //       const { error } = await supabase.from('content').insert(payload);
  //       if (error) throw error;

  //       navigate('/articles'); // or '/dashboard'
  //       return;
  //     }

  //     // 🎧 Podcast: draft row → upload to Storage → update row with file path + status
  //     if (formData.content_type === 'podcast') {
  //       if (!formData.audio_file) throw new Error('Please attach an audio file (.mp3/.m4a).');

  //       // 1) Create draft row to get contentId
  //       const { data: created, error: insertErr } = await supabase
  //         .from('content')
  //         .insert([{
  //           title: formData.title,
  //           description: formData.description,
  //           content_type: 'podcast',
  //           status: 'draft',
  //           tags: formData.tags ?? [],
  //           author_id: uid,
  //           published_at: null,
  //           rich_text_content: formData.rich_text_content ?? null,
  //           audio_file_url: null,
  //           audio_duration: null,
  //         }])
  //         .select('id')
  //         .single();

  //       if (insertErr) throw insertErr;
  //       const contentId = created.id as string;

  //       // 2) Upload audio to Storage bucket `podcasts`
  //       const file = formData.audio_file!;
  //       const storagePath = `user/${uid}/${contentId}/${Date.now()}_${file.name}`;
  //       const { error: upErr } = await supabase
  //         .storage
  //         .from('podcasts')
  //         .upload(storagePath, file, { upsert: true });
  //       if (upErr) throw upErr;

  //       // 3) Update row with storage path + final status
  //       const finalStatus = formData.status === 'published' ? 'published' : 'draft';
  //       const { error: updErr } = await supabase
  //         .from('content')
  //         .update({
  //           audio_file_url: storagePath,
  //           status: finalStatus,
  //           published_at: finalStatus === 'published' ? new Date().toISOString() : null,
  //         })
  //         .eq('id', contentId);
  //       if (updErr) throw updErr;

  //       navigate('/podcasts'); // or '/dashboard'
  //       return;
  //     }

  //     throw new Error('Unknown content type');
  //   } catch (e: any) {
  //     console.error('Create error:', e);
  //     alert(e?.message ?? 'Failed to create content');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleCancel = () => navigate('/dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            {onlyArticle ? 'Create Article' : onlyPodcast ? 'Create Podcast' : 'Create Content'}
          </h1>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>

        {/* Subheading */}
        <p className="text-gray-600 mb-8">
          {onlyArticle
            ? 'Draft your article below — no podcast fields will appear.'
            : onlyPodcast
            ? 'Upload your podcast audio below — no article fields will appear.'
            : 'Choose article or podcast, then fill in the details.'}
        </p>

        {/* Form */}
        {/* Form */}
        <ContentForm
            onlyArticle={onlyArticle}
            onlyPodcast={onlyPodcast}
            onSubmit={(vals) => {
              console.log('[ContentForm → onSubmit] vals:', vals);

              // enforce content_type from the URL if the form doesn't pass it
              const enforcedType =
                (onlyArticle && 'article') ||
                (onlyPodcast && 'podcast') ||
                (vals as any).content_type;

              // call your existing handler
              handleSubmit({ ...(vals as any), content_type: enforcedType });
            }}
            onCancel={handleCancel}
            loading={loading}
            isEditing={false}
/>

      </div>
    </div>
  );
};

export default CreateContentPage;
