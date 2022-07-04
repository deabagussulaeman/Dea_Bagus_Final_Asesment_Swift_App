const crypto = require('crypto');
/**
 * ---------------------------------------------------- *
 * @function onEncrypt
 * @param {data, iv, mode} object configuration encrypt
 * @summary ecnryption with aes method
 * @returns {string} encryption
 * ---------------------------------------------------- *
 */
export const onEncrypt = ({data, key}) => {
  const iv = key.substring(0, 16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let crypted = cipher.update(data, 'utf8', 'base64');
  crypted += cipher.final('base64');
  return crypted;
};

/**
 * ---------------------------------------------------- *
 * @function onEncrypt
 * @param {data, iv, mode} object configuration encrypt
 * @summary ecnryption with aes method
 * @returns {string} encryption
 * ---------------------------------------------------- *
 */
export const onDecrypt = ({data, key}) => {
  const iv = key.substring(0, 16);
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let dec = decipher.update(data, 'base64', 'utf8');
  dec += decipher.final('utf8');
  return dec;
};
