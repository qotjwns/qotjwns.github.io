// 역할: 제목/설명/본문을 감싸는 공통 섹션 컨테이너입니다.
import PageHeader from "./PageHeader.jsx";

export default function Section({ id, title, description, children }) {
  return (
    <section className="section" id={id}>
      <PageHeader description={description} title={title} titleAs="h2" />
      {children}
    </section>
  );
}
