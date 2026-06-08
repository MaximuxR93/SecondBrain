export const validateUrl = (url: string) => {
  return (
    url.includes("instagram.com") ||
    url.includes("youtube.com") ||
    url.includes("youtu.be")
  );
};