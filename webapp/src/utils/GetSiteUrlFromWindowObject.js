// copied from utils in mattermost-webapp

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