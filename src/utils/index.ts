/**
 * Small method that will determine if the filename has a valid extension
 * @param filename - string - filename with extension
 * @returns - boolean
 */
export const supportedExtension = (filename: string) => {
  const supportedExtensions = ['.json'];

  if (filename) {
    const extension = filename.toLowerCase().split('.').pop();
    return supportedExtensions.includes(`.${extension}`);
  }

  return false;
};

/**
 * Small method that will centralize different messages
 * @param message_code - string - a small message code
 * @returns - string - the full message
 */
export const parseMsgCode = (message_code: string) => {
  const messages = {
    NO_ATTACHMENTS: 'No attachments found in Email',
    NO_VALID_ATTACHMENTS:
      'No attachments with supported file extension found in Email',
  };

  return messages[message_code];
};
