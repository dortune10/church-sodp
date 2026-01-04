export type UserRole = 'admin' | 'editor' | 'leader' | 'member';

export interface Profile {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    role: UserRole;
    created_at: string;
    updated_at: string;
}

export interface Member {
    id: string;
    full_name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    birth_date: string | null;
    status: string;
    profile_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface Ministry {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    category: string | null;
    schedule: string | null;
    leader_id: string | null;
    created_at: string;
    updated_at: string;
    members?: { full_name: string };
}

export interface Event {
    id: string;
    title: string;
    description: string | null;
    ministry_id: string | null;
    category: string | null;
    start_at: string;
    end_at: string | null;
    location: string | null;
    capacity: number | null;
    registration_enabled: boolean;
    show_on_home: boolean;
    created_at: string;
    updated_at: string;
}

export interface Sermon {
    id: string;
    title: string;
    slug: string;
    speaker: string | null;
    preacher_name?: string | null;
    series: string | null;
    passage: string | null;
    description: string | null;
    video_url: string | null;
    audio_url: string | null;
    notes_url: string | null;
    featured: boolean;
    published_at: string;
    preached_at?: string;
    created_at: string;
    updated_at: string;
}

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    body: string | null;
    thumbnail_url: string | null;
    author_id: string | null;
    status: 'draft' | 'published';
    published_at: string | null;
    created_at: string;
    updated_at: string;
    profiles?: { full_name: string | null };
}

export interface PhotoAlbum {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    date_range: string | null;
    event_id: string | null;
    ministry_id: string | null;
    is_public: boolean;
    created_at: string;
    photos?: Photo[];
}

export interface Photo {
    id: string;
    album_id: string;
    storage_path: string;
    caption: string | null;
    taken_at: string | null;
    position: number;
    created_at: string;
}

export interface ContactMessage {
    id: string;
    full_name: string;
    email: string;
    subject: string | null;
    message: string;
    status: string;
    created_at: string;
}

export interface PrayerRequest {
    id: string;
    full_name: string | null;
    request: string;
    share_publicly: boolean;
    status: string;
    created_at: string;
}
