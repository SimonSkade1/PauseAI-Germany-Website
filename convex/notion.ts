"use node";

import { action } from "./_generated/server";
import { Client } from "@notionhq/client";
import { v } from "convex/values";

export const getTable = action({
  args: {},
  handler: async () => {
    const notion = new Client({
      auth: process.env.NOTION_API_KEY,
    });

    // Notion SDK v5+ uses dataSources.query instead of databases.query
    const response = await notion.dataSources.query({
      data_source_id: process.env.NOTION_DATABASE_ID!,
    });

    const rows = response.results.map((page: any) => {
      const props = page.properties;
      const row: Record<string, any> = { id: page.id };

      // Add icon if present
      if (page.icon) {
        row.icon = page.icon;
      }

      for (const [key, value] of Object.entries(props) as any) {
        switch (value.type) {
          case "title":
            row[key] = value.title?.[0]?.plain_text ?? "";
            break;
          case "rich_text":
            row[key] = value.rich_text?.[0]?.plain_text ?? "";
            break;
          case "number":
            row[key] = value.number;
            break;
          case "select":
            row[key] = value.select?.name ?? "";
            break;
          case "multi_select":
            row[key] = value.multi_select.map((s: any) => s.name);
            break;
          case "checkbox":
            row[key] = value.checkbox;
            break;
          case "date":
            row[key] = value.date?.start ?? null;
            break;
          default:
            row[key] = JSON.stringify(value);
        }
      }

      return row;
    });

    return rows;
  },
});

// Get a single page by ID
export const getPage = action({
  args: { pageId: v.string() },
  handler: async (_, args) => {
    const notion = new Client({
      auth: process.env.NOTION_API_KEY,
    });

    const page = await notion.pages.retrieve({
      page_id: args.pageId,
    });

    return page;
  },
});

// Get page content (blocks) by ID
export const getPageContent = action({
  args: { pageId: v.string() },
  handler: async (_, args) => {
    const notion = new Client({
      auth: process.env.NOTION_API_KEY,
    });

    const blocks = await notion.blocks.children.list({
      block_id: args.pageId,
    });

    return blocks;
  },
});
