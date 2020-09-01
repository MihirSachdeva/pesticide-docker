import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import useMediaQuery from '@material-ui/core/useMediaQuery';

export default function SkeletonIssue(props) {

  return (
    <div
      className="skeleton-issue-container"
      style={{
        borderTopLeftRadius: props.first ? '10px' : '0',
        borderTopRightRadius: props.first ? '10px' : '0',
        borderBottomLeftRadius: props.last ? '10px' : '0',
        borderBottomRightRadius: props.last ? '10px' : '0',
      }}
    >
      <div className="skeleton-issue-left">
        <Skeleton
          variant="rect"
          width={105}
          height={40}
          animation="wave"
          style={{ marginRight: '5px', borderRadius: '10px' }}
        />
        <Skeleton
          variant="text"
          width={90}
          height={30}
          animation="wave"
          style={{ marginRight: '5px' }}
        />
        <Skeleton
          variant="text"
          width={90}
          height={30}
          animation="wave"
          style={{ marginRight: '5px' }}
        />
      </div>
      <div className="skeleton-issue-right">
        <Skeleton
          variant="rect"
          width={85}
          height={40}
          animation="wave"
          style={{ marginRight: '5px', borderRadius: '10px' }}
        />
        <Skeleton
          variant="rect"
          width={85}
          height={40}
          animation="wave"
          style={{ marginRight: '5px', borderRadius: '10px' }}
        />
        <Skeleton
          variant="rect"
          width={130}
          height={40}
          animation="wave"
          style={{ marginRight: '5px', borderRadius: '10px' }}
        />
      </div>
    </div>
  );
}
