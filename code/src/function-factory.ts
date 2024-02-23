import on_work_creation from './functions/on_work_creation';
import on_ticket_extracts from './functions/on_ticket_extracts';
import insights from './functions/insights';
import trends from './functions/trends';
import snapKitBtn from './functions/snapKitBtn';

export const functionFactory = {
  // Add your functions here
  on_work_creation,
  on_ticket_extracts,
  insights,
  trends,
  snapKitBtn
} as const;

export type FunctionFactoryType = keyof typeof functionFactory;
