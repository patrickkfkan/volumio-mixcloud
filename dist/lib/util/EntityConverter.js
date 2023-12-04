"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EntityConverter {
    static convertCloudcast(data) {
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
    static convertUser(data) {
        const locationParts = [];
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
    static convertPlaylist(data) {
        return {
            id: data.id,
            name: data.name,
            description: data.description,
            url: data.url,
            owner: data.owner ? this.convertUser(data.owner) : undefined
        };
    }
    static convertSlugLike(data) {
        return {
            name: data.name,
            slug: data.slug
        };
    }
}
exports.default = EntityConverter;
//# sourceMappingURL=EntityConverter.js.map