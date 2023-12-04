import BaseViewHandler from './BaseViewHandler';
import View from './View';
import ViewHelper from './ViewHelper';
import { CloudcastEntity } from '../../../entities/CloudcastEntity';
import UIHelper from '../../../util/UIHelper';
import { CloudcastView } from './CloudcastViewHandler';

export interface ExplodedTrackInfo {
  service: 'mixcloud';
  uri: string;
  albumart?: string;
  artist?: string;
  album?: string;
  name: string;
  title: string;
  duration?: number;
  samplerate?: string;
}

export default abstract class ExplodableViewHandler<V extends View, E extends CloudcastEntity = CloudcastEntity> extends BaseViewHandler<V> {

  async explode(): Promise<ExplodedTrackInfo[]> {
    const view = this.currentView;
    if (view.noExplode) {
      return [];
    }

    const tracks = await this.getTracksOnExplode();
    if (!Array.isArray(tracks)) {
      const trackInfo = await this.parseTrackForExplode(tracks);
      return trackInfo ? [ trackInfo ] : [];
    }

    const trackInfoPromises = tracks.map((track) => this.parseTrackForExplode(track));
    return (await Promise.all(trackInfoPromises)).filter((song) => song) as ExplodedTrackInfo[];
  }

  protected async parseTrackForExplode(track: E): Promise<ExplodedTrackInfo | null> {
    const trackUri = this.getTrackUri(track);
    if (!trackUri) {
      return null;
    }
    const trackName = !track.isExclusive ? track.name : UIHelper.addExclusiveText(track.name);
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

  protected abstract getTracksOnExplode(): Promise<E | E[]>;

  /**
   * Track uri:
   * mixcloud/cloudcast@cloudcastId={...}@owner={...}
   */
  protected getTrackUri(track: E) {
    if (!track.url) {
      return null;
    }
    const cloudcastView: CloudcastView = {
      name: 'cloudcast',
      cloudcastId: track.id
    };
    if (track.owner?.username) {
      cloudcastView.owner = track.owner.username;
    }
    return `mixcloud/${ViewHelper.constructUriSegmentFromView(cloudcastView)}`;
  }
}
