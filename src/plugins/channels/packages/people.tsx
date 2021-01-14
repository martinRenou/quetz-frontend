import * as React from 'react';
import { API_STATUSES, BACKEND_HOST } from '../constants';
import { http } from '../../../utils/http';
import InlineLoader from '../../../components/loader';

class PackageMembers extends React.PureComponent<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      packageMembers: null,
      apiStatus: API_STATUSES.PENDING
    };
  }

  async componentDidMount() {
    const { channelId, packageId } = this.props;
    const { data: packageMembers } = (await http.get(
      `${BACKEND_HOST}/api/channels/${channelId}/packages/${packageId}/members`,
      ''
    )) as any;

    this.setState({
      packageMembers,
      apiStatus: API_STATUSES.SUCCESS
    });
  }

  render() {
    const { packageMembers, apiStatus } = this.state;

    if (apiStatus === API_STATUSES.PENDING) {
      return <InlineLoader text="Fetching list of members" />;
    }

    return (
      <div className="package-files-wrapper padding">
        {(packageMembers || []).map((member: any) => (
          <div className="list-row" key={member.user.id}>
            <div className="member-icon-column">
              <img
                src={member.user.profile.avatar_url}
                className="profile-icon"
                alt=""
              />
            </div>
            <div className="member-name-column">{member.user.profile.name}</div>
            <div className="member-username-column">{member.user.username}</div>
            <div className="member-role-column">{member.role}</div>
          </div>
        ))}
      </div>
    );
  }
}

export default PackageMembers;
