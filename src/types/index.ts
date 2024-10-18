// src/types/index.ts

export interface Question {
    id?: number;
    question: string;
    type: string;
    options?: string[];
    mandatory: boolean;
    matchmaking: boolean;
    answer?: string | number | boolean | null;
}

export interface Event {
    id?: number;
    title: string;
    description: string;
    occurs: string;
    location: string;
    max_attendees: number;
    min_attendees?: number;
    last_registration_dt: string;
    recurring: number;
    recurring_interval: number;
    user_id?: string;
    slug?: string;
}

export interface EventInstance {
    id?: number;
    event_id: number;
    max_attendees: number;
    min_attendees: number;
    last_registration_dt: string;
    event: Event;
}