export interface ApiKeys {
  key: string;
  owner: string;
  name: string;
}

export interface Tool {
  owner: string;
  name: string;
  description: string;
  apiURL: string;
  images: string[];
  price: number;
}

export interface Chats {
  threadId: string;
  owner: string;
  chats: any[];
}
