import { UserEntity } from './UserEntity.js';

export interface CloudcastEntity {
  id: string;
  url?: string;
  name: string;
  description?: string;
  thumbnail?: string;
  owner?: UserEntity;
  isExclusive?: boolean;
  streams?: {
    hls?: string;
    dash?: string;
    http?: string;
  }
  duration?: number;
}
