export enum IDType {
  USER = 'USR',
  AUDIT = 'AUD',
  BID = 'BID',
  AUCTION = 'ACT',
}

export const generateID = (type: IDType) => {
  if (type === IDType.AUCTION) {
    const date = new Date();
    const year = String(date.getFullYear()).slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    return `ACT-${year}${month}-${hour}00`;
  }
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomLetter = alphabet.slice(0, 4)[Math.floor(Math.random() * 4)];
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  return `${type}-${randomLetter}-${randomNumber}`;
};
