export interface Poll {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  created_by: string;
  created_at: string;
}

export interface PollOption {
  id: string;
  poll_id: string;
  title: string;
  description: string | null;
  created_at: string;
}

export interface Vote {
  id: string;
  poll_id: string;
  option_id: string;
  user_id: string;
  created_at: string;
}