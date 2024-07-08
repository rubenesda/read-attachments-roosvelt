export const supportedExtension = (filename) => {
  const supportedExtensions = ['.json'];

  if (filename) {
    const extension = filename.toLowerCase().split('.').pop();
    return supportedExtensions.includes(`.${extension}`);
  }

  return false;
};
