// 역할: 로딩/에러/빈 상태 메시지를 공통 스타일로 렌더링합니다.
export default function StatusMessage({ children, as = "p" }) {
  if (!children) {
    return null;
  }

  const Tag = as;
  return <Tag className="blog-status">{children}</Tag>;
}
