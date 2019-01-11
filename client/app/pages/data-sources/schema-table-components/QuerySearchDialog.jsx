import React from 'react';
import Modal from 'antd/lib/modal';
import Input from 'antd/lib/input';
import PropTypes from 'prop-types';

import { Query } from '@/components/proptypes';

export class QueryListItem extends React.Component {
  static propTypes = {
    query: Query.isRequired,
  };

  render() {
    if (!this.props.query) {
      return <div />;
    }

    return (
      <div className="p-relative">
        <Input
          className="bg-white"
          readOnly="readonly"
          disabled="true"
          value={this.props.query.name}
        />
        {
          this.props.removeQuery ? (
            <a
              href="#"
              onClick={() => this.props.removeQuery(null)}
              className="d-flex align-items-center justify-content-center"
              style={{
                position: 'absolute',
                right: '1px',
                top: '1px',
                bottom: '1px',
                width: '30px',
                background: '#fff',
                borderRadius: '3px',
              }}
            >
              <i className="text-muted fa fa-times" />
            </a>) : null
        }
      </div>
    );
  }
}

export class QuerySearchDialog extends React.Component {
  static propTypes = {
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    query: Query.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedQuery: null,
      searchedQueries: [],
    };
  }

  getHighlightedText = (text, highlight) => {
    // Split text on highlight term, include term itself into parts, ignore case
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {
          parts.map((part, i) => (
            <span key={i} style={part.toLowerCase() === highlight.toLowerCase() ? { fontWeight: 'bold' } : {}}>
              { part }
            </span>
          ))
        }
      </span>
    );
  }

  createRecentQueriesList = () => {
    if (!this.recentQueries || this.recentQueries.length <= 0) {
      return [];
    }
    return this.recentQueries.map(query => (
      <a className="list-group-item" onClick={() => this.selectQuery(query)}>
        {query.name}
      </a>
    ));
  }

  createSearchQueriesList = () =>
    (this.state.searchedQueries.map(query => (
      <button className="btn btn-default list-group-item" onClick={() => this.selectQuery(query)}>
        {this.getHighlightedText(query.name, this.searchTerm)}
      </button>
    )));

  selectQuery = (query) => {
    this.setState({ selectedQuery: query });
  }

  searchQueries = (e) => {
    this.searchTerm = e.target.value;
    this.props.query.query({ q: this.searchTerm }, (results) => {
      this.setState({ searchedQueries: results.results });
    });
  }

  render() {
    const {
      query,
    } = this.props;

    query.recent().$promise.then((items) => {
      this.recentQueries = items;
    });

    return (
      <Modal
        title="Add Sample Query"
        visible={this.props.visible}
        onCancel={this.props.onCancel}
        onOk={() => this.props.onOk(this.state.selectedQuery)}
        okText="Add Sample"
        cancelText="Close"
      >
        {this.state.selectedQuery ?
          (
            <QueryListItem
              query={this.state.selectedQuery}
              removeQuery={() => this.selectQuery(null)}
            />
          ) : (
            <div>
              <div className="form-group">
                <Input
                  className="form-control"
                  autoFocus
                  onChange={this.searchQueries}
                  placeholder="Search a query by name..."
                />
              </div>

              <div className="scrollbox" style={{ maxHeight: '50vh' }}>
                {!this.state.searchedQueries || this.state.searchedQueries.length <= 0 ?
                  (
                    <div className="list-group">
                      {this.createRecentQueriesList()}
                    </div>
                  ) : (
                    <div className="list-group">
                      {this.createSearchQueriesList()}
                    </div>
                  )
                }
              </div>
            </div>
          )
        }

      </Modal>
    );
  }
}
