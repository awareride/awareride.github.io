import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const packscopeDocs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx,html}', base: './src/content/docs/packscope' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    order: z.number().default(0),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx,html}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    author: z.string().optional(),
    source: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { packscopeDocs, posts };
