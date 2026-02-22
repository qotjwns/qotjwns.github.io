// 역할: 게시물 태그 목록을 공통 UI로 렌더링합니다.
export default function PostTags({ tags }) {
  if (!tags?.length) {
    return null;
  }

  return (
    <div className="blog-tags">
      {tags.map((tag) => (
        <span className="blog-tag" key={tag}>
          {tag}
        </span>
      ))}
    </div>
  );
}
