export const isValidUrl = (url: string) => {
  const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;

  return urlPattern.test(url);
};
