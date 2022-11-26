export const Highlighted = ({ text = "", highlight = "" }) => {
  //text: the text written in the input  // highlight: מה שצריך לסמן
  // hightlight = ''  // don't highlight
  // highlight = '     ' // don't highlight
  if (!highlight.trim()) {
    //trim:
    return <span>{text}</span>;
  }
  const regex = new RegExp(`(${escapeRegExp(highlight)})`, "gi"); //gi: תחפש בכל הטקסט
  //i(insensitive): אל תתיחס לאותיות גדולות או קטנות
  const parts = text.split(regex);
  // aaabcccc
  // highlight: 'b'
  // ['aaa','b','ccc']
  return (
    <span>
      {parts
        .filter((part) => part)
        .map((part, i) =>
          regex.test(part) ? (
            <mark key={i}>{part}</mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
    </span>
  );
};
function escapeRegExp(text: string) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
