// 역할: 날짜 문자열을 안전하게 파싱해 화면 표시용 형식으로 변환합니다.
const DEFAULT_LOCALE = "en-US";

export function formatDate(dateString, options) {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat(DEFAULT_LOCALE, options).format(date);
}
