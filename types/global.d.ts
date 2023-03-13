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

  //todo merge backend with frontend types, create types package
  type BackendBookingInfo = {
    id: number;
    venueId: number;
    userId: number;
    orgId: number;
    start: string;
    end: string;
    bookedAt: string;
  };

  type BookingInfoToDisplay = {
    ig: string;
    venue: string;
    bookedBy: string;
    from: number;
    to: number;
  };

  interface VenueBookingProps {
    venue: string;
    isTimeLabelsDisplayed: boolean;
    startDate: Date;
    onOpen: () => void;
    setBookingDataFromSelection: Dispatch<SetStateAction<BookingDataFromSelection>>;
    bookingDataFromSelection: BookingDataFromSelection;
  }

  interface BookingDataFromSelection {
    start: Date | null;
    end: Date | null;
    venueId: number;
    venue: string;
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
  }
}
