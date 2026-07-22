import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { locales, cap } from './lib/i18n';

// Products that ship a localized docs collection. Adding a product here
// auto-generates `<product>Docs<Locale>` collections for every locale.
const products = ['packscope'] as const;

const docSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  order: z.number().default(0),
});

function makeDocCollections(): Record<string, ReturnType<typeof defineCollection>> {
  const out: Record<string, ReturnType<typeof defineCollection>> = {};
  for (const product of products) {
    for (const locale of locales) {
      out[`${product}Docs${cap(locale)}`] = defineCollection({
        loader: glob({ pattern: '**/*.md', base: `./src/content/docs/${product}/${locale}` }),
        schema: docSchema,
      });
    }
  }
  return out;
}

const postSchema = z.object({
  title: z.string(),
  date: z.date(),
  description: z.string(),
  tags: z.array(z.string()).default([]),
  author: z.string().optional(),
  source: z.string().optional(),
  draft: z.boolean().default(false),
});

// Posts are split per locale under src/content/posts/<locale>/.
// Adding a locale auto-generates a `posts<Locale>` collection.
function makePostCollections(): Record<string, ReturnType<typeof defineCollection>> {
  const out: Record<string, ReturnType<typeof defineCollection>> = {};
  for (const locale of locales) {
    out[`posts${cap(locale)}`] = defineCollection({
      loader: glob({ pattern: '**/*.{md,mdx,html}', base: `./src/content/posts/${locale}` }),
      schema: postSchema,
    });
  }
  return out;
}

export const collections = {
  ...makePostCollections(),
  ...makeDocCollections(),
};
