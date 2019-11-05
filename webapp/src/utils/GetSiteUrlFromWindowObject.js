// copied from: https://github.com/mattermost/mattermost-webapp/blob/master/utils/url.tsx
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// https://github.com/mattermost/mattermost-webapp/blob/master/LICENSE.txt

export default function(obj) {
  let siteURL = '';
  if (obj.location.origin) {
    siteURL = obj.location.origin;
  } else {
    siteURL = `${obj.location.protocol}//${obj.location.hostname}${obj.location.port ? `:${obj.location.port}` : ''}`;
  }

  if (siteURL[siteURL.length - 1] === '/') {
    siteURL = siteURL.substring(0, siteURL.length - 1);
  }

  if (obj.basename) {
    siteURL += obj.basename;
  }

  if (siteURL[siteURL.length - 1] === '/') {
    siteURL = siteURL.substring(0, siteURL.length - 1);
  }

  return siteURL;
}