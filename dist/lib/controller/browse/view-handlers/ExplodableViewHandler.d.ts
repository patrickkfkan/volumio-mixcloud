import BaseViewHandler from './BaseViewHandler';
import View from './View';
import { CloudcastEntity } from '../../../entities/CloudcastEntity';
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
    explode(): Promise<ExplodedTrackInfo[]>;
    protected parseTrackForExplode(track: E): Promise<ExplodedTrackInfo | null>;
    protected abstract getTracksOnExplode(): Promise<E | E[]>;
    /**
     * Track uri:
     * mixcloud/cloudcast@cloudcastId={...}@owner={...}
     */
    protected getTrackUri(track: E): string | null;
}
//# sourceMappingURL=ExplodableViewHandler.d.ts.map