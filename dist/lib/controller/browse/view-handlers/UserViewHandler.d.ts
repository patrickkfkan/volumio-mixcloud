import View from './View';
import { RenderedPage } from './ViewHandler';
import ExplodableViewHandler from './ExplodableViewHandler';
import { UserModelGetUsersParams } from '../../../model/UserModel';
export interface UserView extends View {
    name: 'user' | 'users';
    username?: string;
    keywords?: string;
    dateJoined?: UserModelGetUsersParams['dateJoined'];
    userType?: UserModelGetUsersParams['userType'];
    select?: 'dateJoined' | 'userType';
}
export default class UserViewHandler extends ExplodableViewHandler<UserView> {
    #private;
    browse(): Promise<RenderedPage>;
    protected getTracksOnExplode(): Promise<import("../../../entities/CloudcastEntity").CloudcastEntity[]>;
}
//# sourceMappingURL=UserViewHandler.d.ts.map