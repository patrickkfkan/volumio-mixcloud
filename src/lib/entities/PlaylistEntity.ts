import { UserEntity } from './UserEntity';

export interface PlaylistEntity {
  id: string;
  name: string;
  description?: string;
  url?: string;
  owner?: UserEntity;
}
