import { useEffect, useMemo } from 'react';

// @third-party
import useSWR, { mutate as globalMutate } from 'swr';

// @project
import { blogs } from '../data/blogs';
import { profiles } from '../data/profile';
import { attempt } from '@/utils/attempt';
import { generateId, getBase64 } from '@/utils/common';

import { swrCache } from '@/sections/blog/api/SWRProvider';
import { getMutateContext } from './mutate-bound';

const endpoints = {
  key: 'api/blogs',
  list: '/list',
  detail: '/detail',
  filter: '/filter'
};

export const initialBlogFilter = {
  /**
   *
   * Example of default `columnFilters` - [{ id: 'categories', value: ['Business'] }]
   *
   **/
  columnFilters: [],
  globalFilter: ''
};

// helper to get array values from FormData like tags[0], tags[1], ...
function getFormDataArray(formData, keyPrefix) {
  const result = [];
  let index = 0;
  while (true) {
    const value = formData.get(`${keyPrefix}[${index}]`);
    if (!value) break;
    result.push(value.toString());
    index++;
  }
  return result;
}

function getBlogList(allBlogs) {
  const blogMap = new Map();

  for (const blog of allBlogs) {
    if (blog.isDraft && blog.refferenceId) {
      blogMap.set(blog.refferenceId, {
        ...blog,
        visits: blog.visits ?? 0,
        isArchived: true
      });
    } else if (!blog.isDraft) {
      if (!blogMap.has(blog.id)) {
        blogMap.set(blog.id, blog);
      }
    } else {
      blogMap.set(blog.id, {
        ...blog,
        visits: blog.visits ?? 0,
        isArchived: true
      });
    }
  }

  const finalList = Array.from(blogMap.values()).map((blog) => {
    if (blog.isDraft && blog.refferenceId) {
      const published = allBlogs.find((b) => b.id === blog.refferenceId && !b.isDraft);
      if (published) {
        return {
          ...blog,
          visits: published.visits ?? 0,
          isArchived: 'isArchived' in published ? published.isArchived : true,
          createdDate: published.createdDate
        };
      }
    }
    return blog;
  });

  return finalList.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
}

/***************************  API - BLOG LIST  ***************************/

export function useGetBlogs() {
  const cacheKey = endpoints.key + endpoints.list;
  const cached = swrCache.get(cacheKey);

  // Fallback to mock if not cached (hydration-like)
  const initialData = cached?.data ?? blogs ?? [];

  useEffect(() => {
    // Hydrate cache once if not already
    if (!cached) {
      globalMutate(cacheKey, blogs, { revalidate: false });
    }
  }, [cached, cacheKey]);

  const { data, isLoading, error, isValidating } = useSWR(cacheKey, () => initialData, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      blogs: getBlogList(data || []),
      blogsLoading: isLoading,
      blogsError: error,
      blogsValidating: isValidating
    }),
    [data, isLoading, error, isValidating]
  );

  return memoizedValue;
}

/***************************  API - GET BLOG  ***************************/

export async function getBlog(blogID) {
  const cached = swrCache.get(endpoints.key + endpoints.list);
  const data = cached?.data ?? blogs;

  const blog = data.find((b) => b.id === blogID) || null;

  return await attempt(Promise.resolve(blog));

  // to hit server
  // return attempt(axiosServices.get(`/api/blogs/${blogID}`));
}

/***************************  API - SAVE DRAFT BLOG  ***************************/

export async function saveDraft(formData) {
  const getField = (key) => {
    const value = formData.get(key);
    return typeof value === 'string' ? value : '';
  };

  const idValue = formData.get('id');
  const blogId = typeof idValue === 'string' ? idValue : generateId().toString();

  const bannerFile = formData.get('banner');
  let banner = { name: '', size: 0, url: '' };

  const cached = swrCache.get(endpoints.key + endpoints.list);
  const currentList = cached?.data ?? [];

  const existingPublished = currentList.find((b) => b.id === blogId && !b.isDraft);
  const existingDraft = currentList.find((b) => b.id === blogId && b.isDraft);

  let finalId = blogId;
  let finalRefferenceId = getField('refferenceId') || undefined;

  if (existingPublished && !existingDraft) {
    finalRefferenceId = existingPublished.id;
    finalId = generateId().toString();
  }

  const referencedPublished = finalRefferenceId ? currentList.find((b) => b.id === finalRefferenceId && !b.isDraft) : undefined;

  const createdDate = referencedPublished?.createdDate ?? existingDraft?.createdDate ?? new Date();
  const profile = referencedPublished?.profile ?? existingDraft?.profile ?? profiles[0];

  if (bannerFile instanceof File) {
    banner = { name: bannerFile.name, size: bannerFile.size, url: await getBase64(bannerFile) };
  } else if (typeof bannerFile === 'string' && bannerFile) {
    if (existingDraft) {
      banner = existingDraft.banner;
    } else if (referencedPublished) {
      banner = referencedPublished.banner;
    }
  } else {
    banner = { name: '', size: 0, url: '' };
  }

  const payload = {
    id: finalId,
    refferenceId: finalRefferenceId,
    title: getField('title'),
    caption: getField('caption'),
    content: getField('content'),
    tags: getFormDataArray(formData, 'tags'),
    categories: getFormDataArray(formData, 'categories'),
    banner,
    seo: {
      title: getField('seo.title'),
      description: getField('seo.description')
    },
    slug: getField('slug'),
    profile,
    createdDate,
    isDraft: true
  };

  const mutate = getMutateContext();

  await mutate(
    endpoints.key + endpoints.list,
    (current = []) => {
      const safeBlogs = Array.isArray(current) ? current : [];
      const index = safeBlogs.findIndex((b) => b.id === payload.id);
      if (index !== -1) {
        safeBlogs[index] = payload;
      } else {
        safeBlogs.unshift(payload);
      }

      return [...safeBlogs]; // clone to trigger reactivity
    },
    false
  );

  return await attempt(new Promise((resolve) => resolve('ok')));

  // to hit server
  // return attempt(
  //   axiosServices.post('/api/blogs/saveDraft', formData, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data'
  //     }
  //   })
  // );
}

/***************************  API - SAVE PUBLISH BLOG  ***************************/

export async function savePublish(formData) {
  const getField = (key) => {
    const value = formData.get(key);
    return typeof value === 'string' ? value : '';
  };

  const mutate = getMutateContext();

  const bannerFile = formData.get('banner');
  const id = getField('id');
  const blogId = id || generateId();

  const cached = swrCache.get(endpoints.key + endpoints.list);
  const currentList = cached?.data ?? [];

  const existingBlog = currentList.find((b) => b.id === blogId);
  const refferenceId = existingBlog?.refferenceId || getField('refferenceId') || undefined;

  const isPublishingDraftWithRef = existingBlog?.isDraft && !!refferenceId;
  const targetId = isPublishingDraftWithRef ? refferenceId : blogId;
  const targetPublished = currentList.find((b) => b.id === targetId && !b.isDraft);

  let banner = existingBlog?.isDraft
    ? (existingBlog?.banner ?? { name: '', size: 0, url: '' })
    : (targetPublished?.banner ?? existingBlog?.banner ?? { name: '', size: 0, url: '' });

  if (bannerFile instanceof File) {
    banner = {
      name: bannerFile.name,
      size: bannerFile.size,
      url: await getBase64(bannerFile)
    };
  } else if (typeof bannerFile === 'string' && bannerFile) {
    banner = banner; // keep existing
  }

  const blog = {
    id: targetId,
    title: getField('title'),
    caption: getField('caption'),
    content: getField('content'),
    tags: getFormDataArray(formData, 'tags'),
    categories: getFormDataArray(formData, 'categories'),
    banner,
    isArchived: targetPublished?.isArchived ?? false,
    seo: {
      title: getField('seo.title'),
      description: getField('seo.description')
    },
    slug: getField('slug'),
    visits: targetPublished?.visits ?? 0,
    profile: targetPublished?.profile ?? profiles[0],
    createdDate: targetPublished?.createdDate ?? new Date(),
    isDraft: false
  };

  await mutate(
    endpoints.key + endpoints.list,
    (current = []) => {
      let updated = [...current];

      if (existingBlog?.isDraft) {
        updated = updated.filter((b) => b.id !== blogId);
      }

      const index = updated.findIndex((b) => b.id === targetId);
      if (index !== -1) {
        updated[index] = blog;
      } else {
        updated.unshift(blog);
      }

      return updated;
    },
    false
  );

  return await attempt(Promise.resolve('ok'));

  // to hit server
  // return attempt(
  //   axiosServices.post('/api/blogs/savePublish', formData, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data'
  //     }
  //   })
  // );
}

/***************************  API - BLOG DELETE  ***************************/

export async function deleteBlog(id) {
  const mutate = getMutateContext();

  return attempt(
    mutate(
      endpoints.key + endpoints.list,
      (currentBlogs = []) => {
        if (!Array.isArray(currentBlogs)) return [];

        return currentBlogs.filter((blog) => blog.id !== id && blog.refferenceId !== id);
      },
      false
    )
  );

  // to hit server
  // return attempt(axiosServices.delete(`/api/blogs/delete/${id}`));
}

/***************************  API - DRAFT BLOG DELETE  ***************************/

export async function deleteDraftBlog(id) {
  const mutate = getMutateContext();

  return attempt(
    mutate(endpoints.key + endpoints.list, (current = []) => current.filter((blog) => !(blog.id === id && blog.isDraft)), false)
  );

  // to hit server
  // return attempt(axiosServices.delete(`/api/blogs/deleteDraft/${id}`));
}

/***************************  API - BLOG PUBLISH  ***************************/

export async function setBlogArchivedStatus(id, isArchived) {
  const mutate = getMutateContext();

  return attempt(
    mutate(
      endpoints.key + endpoints.list,
      (currentBlogs = []) => {
        if (!currentBlogs || !Array.isArray(currentBlogs)) return [];

        return currentBlogs.map((blog) => (blog.id === id ? { ...blog, isArchived } : blog));
      },
      false
    )
  );

  // to hit server
  // return attempt(axiosServices.patch('/api/blogs/publish', { id }));
}

/***************************  GET - BLOG FILTER  ***************************/

export function useGetBlogFilter() {
  const { data, isLoading, error, isValidating } = useSWR(endpoints.key + endpoints.filter, () => initialBlogFilter, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      blogFilter: data,
      blogFilterLoading: isLoading,
      blogFilterError: error,
      blogFilterValidating: isValidating
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

/***************************  MANAGE - BLOG FILTER  ***************************/

export async function handleBlogFilter(filter) {
  const mutate = getMutateContext();

  return mutate(endpoints.key + endpoints.filter, () => filter, false);
}
