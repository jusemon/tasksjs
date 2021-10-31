import bcrypt from 'bcrypt';

export const cipher = async (value: string) => {
  const hashed = await new Promise<string>((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return reject(err);
      bcrypt.hash(value, salt, (err2, hash) => {
        if (err2)
          return reject(err2);
        return resolve(hash)
      });
    });
  });
  return hashed;
};

export const compare = async (value: string, hash: string) => {
  const match = await new Promise<boolean>((resolve, reject) => {
    bcrypt.compare(value, hash, (err, isPasswordMatch) => {
      return err == null ?
        resolve(isPasswordMatch) :
        reject(err);
    });
  });
  return match;
};
