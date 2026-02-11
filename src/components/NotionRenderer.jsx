import { Fragment } from "react";

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

function renderBlock(block) {
  switch (block.type) {
    case "paragraph":
      return <p>{renderRichText(block.paragraph.rich_text)}</p>;
    case "heading_1":
      return <h2>{renderRichText(block.heading_1.rich_text)}</h2>;
    case "heading_2":
      return <h3>{renderRichText(block.heading_2.rich_text)}</h3>;
    case "heading_3":
      return <h4>{renderRichText(block.heading_3.rich_text)}</h4>;
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

  return grouped.map((group, index) => {
    if (group.type === "ul" || group.type === "ol") {
      const ListTag = group.type;
      return (
        <ListTag className="notion-list" key={`list-${index}`}>
          {group.items.map((item) => (
            <Fragment key={item.id}>{renderBlock(item)}</Fragment>
          ))}
        </ListTag>
      );
    }

    return (
      <Fragment key={group.id || `block-${index}`}>
        {renderBlock(group)}
      </Fragment>
    );
  });
}
