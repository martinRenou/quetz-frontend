import React from 'react';
import { API_STATUSES, BACKEND_HOST } from './constants';
import { http } from '../../utils/http';
import InlineLoader from '../../components/loader';
import { formatSize } from './channel-details-info';
import moment from 'moment';

type PackageVersionProps = {
  channel: string;
  selectedPackage: string;
};

type PackageVersionsState = {
  versionData: null | any;
  apiStatus: API_STATUSES;
};

class PackageVersions extends React.PureComponent<
  PackageVersionProps,
  PackageVersionsState
> {
  constructor(props: PackageVersionProps) {
    super(props);
    this.state = {
      versionData: null,
      apiStatus: API_STATUSES.PENDING
    };
  }

  async componentDidMount() {
    const { channel, selectedPackage } = this.props;
    const { data: versionData } = (await http.get(
      `${BACKEND_HOST}/api/channels/${channel}/packages/${selectedPackage}/versions`,
      ''
    )) as any;

    this.setState({
      versionData,
      apiStatus: API_STATUSES.SUCCESS
    });
  }

  render() {
    const { versionData, apiStatus } = this.state;
    const { selectedPackage } = this.props;
    if (apiStatus === API_STATUSES.PENDING) {
      return <InlineLoader text={`Loading versions in ${selectedPackage}`} />;
    }

    if (versionData.length === 0) {
      return <div>No versions available for the package</div>;
    }

    const info = versionData[0].info;

    return (
      <>
        {/*TODO: Copy button for md5 */}
        <h4 className="section-heading">Package Info</h4>
        <p className="minor-paragraph">
          <b>Arch</b>: {info.arch || 'n/a'}
          <br />
          <b>Build</b>: {info.build || 'n/a'}
          <br />
          <b>Depends</b>: {info.depends.join(', ')}
          <br />
          <b>MD5</b>: {info.md5}
          <br />
          <b>Platform</b>: {versionData[0].platform || info.platform}
          <br />
          <b>Version</b>: {info.version}
        </p>
        <h4 className="section-heading">History</h4>
        <table className="table-small full-width">
          <thead>
            <tr>
              <th>Uploader</th>
              <th>Date</th>
              <th>Filename</th>
              <th>Size</th>
              <th>Version</th>
            </tr>
          </thead>
          <tbody>
            {versionData.map((version: any) => (
              <tr key={version.time_created}>
                <td>{version.uploader.name}</td>
                <td>{moment(version.time_created).fromNow()}</td>
                <td>{version.filename}</td>
                <td>{formatSize(version.info.size)}</td>
                <td>{version.version}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  }
}

export default PackageVersions;
