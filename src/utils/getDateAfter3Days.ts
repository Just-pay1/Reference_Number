export const getDateAfter3Days = (): Date => {
    const now = new Date();
    now.setDate(now.getDate() + 3);
    return now;
  };
  