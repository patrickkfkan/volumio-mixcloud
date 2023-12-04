import BaseViewHandler from './BaseViewHandler';
import RootViewHandler from './RootViewHandler';
import CloudcastViewHandler from './CloudcastViewHandler';
import View from './View';
import ViewHelper from './ViewHelper';
import DiscoverViewHandler from './DiscoverViewHandler';
import FeaturedViewHandler from './FeaturedViewHandler';
import PlaylistViewHandler from './PlaylistViewHandler';
import TagViewHandler from './TagViewHandler';
import UserViewHandler from './UserViewHandler';

type HandlerClass<V extends View, T extends BaseViewHandler<V>> =
  new (uri: string, currentView: V, previousViews: View[]) => T;

const VIEW_NAME_TO_CLASS: Record<string, HandlerClass<any, any>> = {
  'root': RootViewHandler,
  'cloudcast': CloudcastViewHandler,
  'cloudcasts': CloudcastViewHandler,
  'discover': DiscoverViewHandler,
  'featured': FeaturedViewHandler,
  'playlist': PlaylistViewHandler,
  'playlists': PlaylistViewHandler,
  'tags': TagViewHandler,
  'user': UserViewHandler,
  'users': UserViewHandler
};

export default class ViewHandlerFactory {

  static getHandler<V extends View>(uri: string): BaseViewHandler<V> {
    const views = ViewHelper.getViewsFromUri(uri);
    const currentView = views.pop();
    const previousViews = views;

    if (!currentView) {
      throw Error('Invalid URI: no parseable view.');
    }

    /**
     * 'artist' and 'label' views are obsolete (replaced by single 'band' view),
     * but may still exist in Volumio playlists or favourites. We still want to be able
     * to play them, so we translate these URIs into their 'band' equivalent.
     */
    if (currentView.name === 'artist' || currentView.name === 'label') {
      currentView.name = 'band';

      if (currentView.artistUrl) {
        currentView.bandUrl = currentView.artistUrl;
        delete currentView.artistUrl;
      }

      if (currentView.labelUrl) {
        currentView.bandUrl = currentView.labelUrl;
        delete currentView.labelUrl;
      }
    }
    /**
     * 'articles' and 'shows' are also absolute (replaced by singular form)
     */
    else if (currentView.name === 'articles') {
      currentView.name = 'article';
    }
    else if (currentView.name === 'shows') {
      currentView.name = 'show';
    }

    return new VIEW_NAME_TO_CLASS[currentView.name](uri, currentView, previousViews);
  }
}
