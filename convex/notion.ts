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

// Get page content (blocks) by ID - simplified for rendering
export const getPageContent = action({
  args: { pageId: v.string() },
  handler: async (_, args) => {
    const notion = new Client({
      auth: process.env.NOTION_API_KEY,
    });

    const blocks = await notion.blocks.children.list({
      block_id: args.pageId,
    });

    // Simplify blocks for easier rendering in React
    const simplifiedBlocks = blocks.results.map((block: any) => {
      const type = block.type;
      const content = block[type];
      const result: Record<string, any> = { type };

      switch (type) {
        case "paragraph":
        case "heading_1":
        case "heading_2":
        case "heading_3":
        case "quote":
          result.text = content?.rich_text?.map((t: any) => ({
            content: t.plain_text,
            annotations: t.annotations || {},
            href: t.href,
          })) || [];
          result.plainText = content?.rich_text?.map((t: any) => t.plain_text).join("") || "";
          break;

        case "bulleted_list_item":
        case "numbered_list_item":
          result.text = content?.rich_text?.map((t: any) => ({
            content: t.plain_text,
            annotations: t.annotations || {},
            href: t.href,
          })) || [];
          result.plainText = content?.rich_text?.map((t: any) => t.plain_text).join("") || "";
          break;

        case "to_do":
          result.text = content?.rich_text?.map((t: any) => ({
            content: t.plain_text,
            annotations: t.annotations || {},
            href: t.href,
          })) || [];
          result.plainText = content?.rich_text?.map((t: any) => t.plain_text).join("") || "";
          result.checked = content?.checked || false;
          break;

        case "callout":
          result.text = content?.rich_text?.map((t: any) => ({
            content: t.plain_text,
            annotations: t.annotations || {},
            href: t.href,
          })) || [];
          result.plainText = content?.rich_text?.map((t: any) => t.plain_text).join("") || "";
          result.icon = content?.icon?.emoji || null;
          break;

        case "code":
          result.text = content?.rich_text?.map((t: any) => ({
            content: t.plain_text,
            annotations: t.annotations || {},
            href: t.href,
          })) || [];
          result.plainText = content?.rich_text?.map((t: any) => t.plain_text).join("") || "";
          result.language = content?.language || "text";
          break;

        case "divider":
          // No additional content needed
          break;

        case "toggle":
          result.text = content?.rich_text?.map((t: any) => ({
            content: t.plain_text,
            annotations: t.annotations || {},
            href: t.href,
          })) || [];
          result.plainText = content?.rich_text?.map((t: any) => t.plain_text).join("") || "";
          break;

        default:
          result.plainText = "";
      }

      return result;
    });

    return simplifiedBlocks;
  },
});

// Get tasks from Notion database and transform them for the action tree
export const getTasks = action({
  args: {},
  handler: async () => {
    const notion = new Client({
      auth: process.env.NOTION_API_KEY,
    });

    const response = await notion.dataSources.query({
      data_source_id: process.env.NOTION_DATABASE_ID!,
    });

    const tasks = response.results
      .map((page: any) => {
        const props = page.properties;

        // Extract task name from title property
        const nameProp = Object.values(props).find(
          (v: any) => v?.type === "title"
        ) as any;
        const name = nameProp?.title?.[0]?.plain_text ?? "";

        // Extract time investment (Zeitinvestment in Stunden)
        const timeProp = Object.values(props).find(
          (v: any) => v?.type === "number"
        ) as any;
        const timeInvestment = timeProp?.number ?? 1;

        // Calculate XP: 1 hour = 100 XP
        const xp = Math.round(timeInvestment * 100);

        // Extract emoji from page icon
        const emoji = page.icon?.type === "emoji" ? page.icon.emoji : "⭐";

        // Get Notion page URL
        const link = page.url;

        // Extract "Wiederholbar" checkbox (repeatable)
        const repeatableProp = Object.entries(props).find(
          ([key, v]: [string, any]) => key === "Wiederholbar" || key === "repeatable"
        )?.[1] as any;
        const repeatable = repeatableProp?.type === "checkbox" ? repeatableProp.checkbox : false;

        // Extract "Kommentar notwendig" checkbox
        const kommentarNoetigProp = Object.entries(props).find(
          ([key, v]: [string, any]) => key === "Kommentar notwendig"
        )?.[1] as any;
        const kommentarNoetig = kommentarNoetigProp?.type === "checkbox" ? kommentarNoetigProp.checkbox : false;

        return {
          id: page.id,
          name,
          xp,
          emoji,
          link,
          repeatable,
          kommentarNoetig,
        };
      })
      .filter((task: any) => task.name.length > 0); // Filter out tasks without names

    return tasks;
  },
});

