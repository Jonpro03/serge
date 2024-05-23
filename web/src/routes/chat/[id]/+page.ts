import type { PageLoad } from "./$types";
import { browser } from '$app/environment';

type MessageType = "human" | "ai" | "system";

interface MessageData {
  content: string;
}

interface Message {
  type: MessageType;
  data: MessageData;
}

interface Params {
  model_path: string;
  n_ctx: number;
  n_gpu_layers: number;
  n_threads: number;
  last_n_tokens_size: number;
  max_tokens: number;
  temperature: number;
  top_p: number;
  repeat_penalty: number;
  top_k: number;
}

interface Response {
  id: string;
  created: string;
  params: Params;
  owner: string;
  history: Message[];
}

export const load: PageLoad = async ({ fetch, params }) => {
  let token: string | null = null;

  if (browser) {
    token = localStorage.getItem('token');
  }

  const options: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
  };

  const r = await fetch("/api/chat/" + params.id, options);
  const data = (await r.json()) as Response;

  return {
    chat: data,
  };
};
