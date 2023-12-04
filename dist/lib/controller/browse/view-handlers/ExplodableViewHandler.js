"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseViewHandler_1 = __importDefault(require("./BaseViewHandler"));
const ViewHelper_1 = __importDefault(require("./ViewHelper"));
const UIHelper_1 = __importDefault(require("../../../util/UIHelper"));
class ExplodableViewHandler extends BaseViewHandler_1.default {
    async explode() {
        const view = this.currentView;
        if (view.noExplode) {
            return [];
        }
        const tracks = await this.getTracksOnExplode();
        if (!Array.isArray(tracks)) {
            const trackInfo = await this.parseTrackForExplode(tracks);
            return trackInfo ? [trackInfo] : [];
        }
        const trackInfoPromises = tracks.map((track) => this.parseTrackForExplode(track));
        return (await Promise.all(trackInfoPromises)).filter((song) => song);
    }
    async parseTrackForExplode(track) {
        const trackUri = this.getTrackUri(track);
        if (!trackUri) {
            return null;
        }
        const trackName = !track.isExclusive ? track.name : UIHelper_1.default.addExclusiveText(track.name);
        return {
            service: 'mixcloud',
            uri: trackUri,
            albumart: track.thumbnail,
            artist: track.owner?.name || track.owner?.username,
            album: '',
            name: trackName,
            title: trackName
        };
    }
    /**
     * Track uri:
     * mixcloud/cloudcast@cloudcastId={...}@owner={...}
     */
    getTrackUri(track) {
        if (!track.url) {
            return null;
        }
        const cloudcastView = {
            name: 'cloudcast',
            cloudcastId: track.id
        };
        if (track.owner?.username) {
            cloudcastView.owner = track.owner.username;
        }
        return `mixcloud/${ViewHelper_1.default.constructUriSegmentFromView(cloudcastView)}`;
    }
}
exports.default = ExplodableViewHandler;
//# sourceMappingURL=ExplodableViewHandler.js.map