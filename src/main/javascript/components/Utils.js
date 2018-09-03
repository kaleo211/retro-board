import React from 'react';

export default class Board extends React.Component {

  static get(url, callback) {
    if (url) {
      fetch(url)
        .then(resp => {
          if (resp.ok) {
            return resp.json();
          } else {
            throw new Error("failed to get:", url);
          }
        }).then(data => {
          callback(data);
        }).catch(error => {
          console.log(error);
        });
    }
  }

  static deleteResource(resource, callback) {
    let url = resource._links.self.href.replace('{?projection}', '');
    fetch(url, {
      method: 'delete',
    }).then(resp => {
      if (resp.ok) {
        return resp.json();
      } else {
        throw new Error("failed to delete:", url);
      }
    }).then(data => {
      callback(data);
    }).catch(error => {
      console.log(error);
    });
  }

  static fetchResource(resourceType, callback) {
    let url = window.location.protocol + "//" + window.location.hostname + ":8080/api/" + resourceType;
    this.get(url, callback);
  }

  static getSelfLink(resource) {
    if (resource && resource._links) {
      return resource._links.self.href.replace('{?projection}', '');
    }
    return null;
  }

  static postResource(resourceType, resource, callback) {
    let url = window.location.protocol + "//" + window.location.hostname + ":8080/api/" + resourceType;
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(resource),
      headers: new Headers({
        'Content-Type': 'application/json',
      })
    }).then(resp => {
      if (resp.ok) {
        return resp.json();
      } else {
        throw new Error("failed to post:", resourceType, resource);
      }
    }).then(data => {
      callback(data);
    }).catch(error => {
      console.log(error);
    });
  }

  static patchResource(resource, updatedResource, callback) {
    let url = this.getSelfLink(resource);
    if (url) {
      fetch(url, {
        method: 'PATCH',
        body: JSON.stringify(updatedResource),
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      }).then(resp => {
        if (resp.ok) {
          return resp.json();
        } else {
          throw new Error("failed to patch:", resource, updatedResource);
        }
      }).then(data => {
        callback(data);
      });
    }

  }
}