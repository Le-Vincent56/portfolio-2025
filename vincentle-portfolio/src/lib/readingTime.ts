import readingTime from 'reading-time';

export const getReadingStats = (text: string) => readingTime(text);