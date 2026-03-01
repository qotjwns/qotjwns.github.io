// 역할: Notion 블록 데이터를 화면용 HTML 요소로 변환해 렌더링합니다.
import { Fragment } from "react";

const HEADING_TAGS = {
  heading_1: "h2",
  heading_2: "h3",
  heading_3: "h4",
};

function applyAnnotations(content, annotations) {
  let node = content;
  if (annotations.code) {
    node = <code>{node}</code>;
  }
  if (annotations.bold) {
    node = <strong>{node}</strong>;
  }
  if (annotations.italic) {
    node = <em>{node}</em>;
  }
  if (annotations.underline) {
    node = <u>{node}</u>;
  }
  if (annotations.strikethrough) {
    node = <s>{node}</s>;
  }
  return node;
}

function renderRichText(richText) {
  if (!richText || richText.length === 0) {
    return null;
  }

  return richText.map((item, index) => {
    if (item.type !== "text") {
      return null;
    }
    const content = item.text?.content ?? "";
    const annotations = item.annotations ?? {};
    let node = content;

    if (item.text?.link?.url) {
      node = (
        <a href={item.text.link.url} target="_blank" rel="noreferrer">
          {node}
        </a>
      );
    }

    node = applyAnnotations(node, annotations);

    return <Fragment key={index}>{node}</Fragment>;
  });
}

function getBlockRichText(block) {
  const value = block[block.type];
  return value?.rich_text || [];
}

function getBlockText(block) {
  return getBlockRichText(block)
    .map((text) => text.plain_text)
    .join("");
}

function slugifyHeading(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function getHeadingsFromBlocks(blocks) {
  if (!blocks?.length) {
    return [];
  }

  const slugCounts = new Map();

  return blocks.flatMap((block, index) => {
    const tag = HEADING_TAGS[block.type];
    if (!tag) {
      return [];
    }

    const text = getBlockText(block).trim();
    if (!text) {
      return [];
    }

    const baseId = slugifyHeading(text) || `section-${index + 1}`;
    const count = slugCounts.get(baseId) ?? 0;
    slugCounts.set(baseId, count + 1);

    return [
      {
        blockId: block.id,
        id: count === 0 ? baseId : `${baseId}-${count + 1}`,
        level: Number(tag.slice(1)),
        text,
      },
    ];
  });
}

function renderBlock(block, headingLookup) {
  switch (block.type) {
    case "paragraph":
      return <p>{renderRichText(block.paragraph.rich_text)}</p>;
    case "heading_1":
    case "heading_2":
    case "heading_3": {
      const HeadingTag = HEADING_TAGS[block.type];
      const heading = headingLookup.get(block.id);
      return (
        <HeadingTag className="notion-heading" id={heading?.id}>
          {renderRichText(block[block.type].rich_text)}
        </HeadingTag>
      );
    }
    case "quote":
      return <blockquote>{renderRichText(block.quote.rich_text)}</blockquote>;
    case "code":
      return (
        <pre className="notion-code">
          <code data-language={block.code.language}>
            {getBlockText(block)}
          </code>
        </pre>
      );
    case "divider":
      return <hr />;
    case "callout":
      return (
        <div className="notion-callout">{renderRichText(block.callout.rich_text)}</div>
      );
    case "image": {
      const image = block.image;
      const url =
        image.type === "external" ? image.external?.url : image.file?.url;
      if (!url) {
        return null;
      }
      const caption = image.caption?.map((item) => item.plain_text).join("");
      return (
        <figure className="notion-image">
          <img src={url} alt={caption || "Notion image"} loading="lazy" />
          {caption ? <figcaption>{caption}</figcaption> : null}
        </figure>
      );
    }
    case "bulleted_list_item":
    case "numbered_list_item":
      return (
        <li className="notion-list-item">
          {renderRichText(getBlockRichText(block))}
        </li>
      );
    default:
      return null;
  }
}

function groupBlocks(blocks) {
  const groups = [];
  let currentList = null;

  blocks.forEach((block) => {
    if (
      block.type === "bulleted_list_item" ||
      block.type === "numbered_list_item"
    ) {
      const listType =
        block.type === "bulleted_list_item" ? "ul" : "ol";
      if (!currentList || currentList.type !== listType) {
        currentList = { type: listType, items: [] };
        groups.push(currentList);
      }
      currentList.items.push(block);
      return;
    }

    currentList = null;
    groups.push(block);
  });

  return groups;
}

export default function NotionRenderer({ blocks }) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  const grouped = groupBlocks(blocks);
  const headingLookup = new Map(
    getHeadingsFromBlocks(blocks).map(({ blockId, ...heading }) => [blockId, heading])
  );

  return grouped.map((group, index) => {
    if (group.type === "ul" || group.type === "ol") {
      const ListTag = group.type;
      return (
        <ListTag className="notion-list" key={`list-${index}`}>
          {group.items.map((item) => (
            <Fragment key={item.id}>{renderBlock(item, headingLookup)}</Fragment>
          ))}
        </ListTag>
      );
    }

    return (
      <Fragment key={group.id || `block-${index}`}>
        {renderBlock(group, headingLookup)}
      </Fragment>
    );
  });
}
