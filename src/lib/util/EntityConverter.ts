import { Category, Cloudcast, Playlist, Tag, User } from 'mixcloud-fetch';
import { UserEntity } from '../entities/UserEntity.js';
import { CloudcastEntity } from '../entities/CloudcastEntity.js';
import { PlaylistEntity } from '../entities/PlaylistEntity.js';
import { SlugEntity } from '../entities/SlugEntity.js';

export default class EntityConverter {

  static convertCloudcast(data: Cloudcast): CloudcastEntity {
    return {
      id: data.id,
      url: data.url,
      name: data.name,
      description: data.description,
      thumbnail: data.images?.extra_large,
      owner: data.owner ? this.convertUser(data.owner) : undefined,
      isExclusive: data.isExclusive,
      streams: data.streams,
      duration: data.duration
    };
  }

  static convertUser(data: User): UserEntity {
    const locationParts: string[] = [];
    if (data.city) {
      locationParts.push(data.city);
    }
    if (data.country) {
      locationParts.push(data.country);
    }
    const location = locationParts.join(', ');

    return {
      username: data.username,
      url: data.url,
      name: data.name,
      thumbnail: data.images?.extra_large,
      about: data.about,
      location: location || undefined
    };
  }

  static convertPlaylist(data: Playlist): PlaylistEntity {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      url: data.url,
      owner: data.owner ? this.convertUser(data.owner) : undefined
    };
  }

  static convertSlugLike(data: Category | Tag): SlugEntity {
    return {
      name: data.name,
      slug: data.slug
    };
  }
}
