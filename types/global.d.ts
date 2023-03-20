import { Dispatch, SetStateAction } from 'react';

export {};

declare global {
  interface ButtonInfo {
    name: string;
    link: string;
  }

  interface IGInfo {
    contact: string;
    invite_link: string;
    image: string;
    title: string;
    description: string;
    category: string;
  }

  type BookingDataBackend = {
    id: number;
    venueId: number;
    userId: number;
    orgId: number;
    start: string;
    end: string;
    bookedAt: string;
  };

  type BookingDataDisplay = {
    ig: string;
    venueId: number;
    bookedBy: string;
    from: Date;
    to: Date;
  };

  interface BookingDataSelection {
    start: Date | null;
    end: Date | null;
    venueId: number;
    venueName: string;
  }

  interface TelegramUser {
    id: number;
    first_name: string;
    username: string;
    photo_url: string;
    auth_date: number;
    hash: string;
  }

  interface AuthState {
    token: string;
    orgIds: Array<number>;
  }

  interface BookingDataForm {
    event: string;
    orgId: number;
  }

  interface OrgInfo {
    id: number;
    name: string;
    description: string;
    verified: boolean;
  }
}
