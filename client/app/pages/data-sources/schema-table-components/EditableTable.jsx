import React from 'react';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import PropTypes from 'prop-types';
import './schema-table.css';
import { QuerySearchDialog, QueryListItem } from './QuerySearchDialog';
import { TableVisibilityCheckbox } from './TableVisibilityCheckbox';

const FormItem = Form.Item;
const { TextArea } = Input;
export const EditableContext = React.createContext();

// eslint-disable-next-line react/prop-types
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

export const EditableFormRow = Form.create()(EditableRow);

export class SampleQueryList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchDialogOpen: false,
      sampleQueries: Object.keys(this.props.value).length > 0 ? this.props.value : {},
    };
  }

  createSampleQueriesList = () => {
    const sampleQueryValues = Object.values(this.state.sampleQueries);
    if (sampleQueryValues.length <= 0) {
      return (
        <div className="p-relative">
          <Input
            className="bg-white"
            readOnly="readonly"
            disabled
            placeholder="Add new query sample..."
          />
        </div>
      );
    }
    return sampleQueryValues.map((query) => {
      return (
        <QueryListItem
          query={query}
          removeQuery={() => this.removSampleQuery(query)}
        />
      );
    });
  }

  removSampleQuery = (query) => {
    const newSampleQueries = Object.assign({}, this.state.sampleQueries);
    delete newSampleQueries[query.id];
    this.setState({ sampleQueries: newSampleQueries });
    this.props.onChange(newSampleQueries);
  }

  addSampleQuery = (newQuery) => {
    const newSampleQueries = Object.assign({}, this.state.sampleQueries);
    newSampleQueries[newQuery.id] = newQuery;
    this.setState({
      searchDialogOpen: false,
      sampleQueries: newSampleQueries,
    });
    this.props.onChange(newSampleQueries);
  }

  openSearchDialog = () => {
    this.setState({ searchDialogOpen: true });
  }

  closeSearchDialog = () => {
    this.setState({ searchDialogOpen: false });
  }

  render() {
    return (
      <div>
        <div className="sample-list">
          {this.createSampleQueriesList()}
        </div>
        <div title="Add a sample" className="add-sample">
          <a className="btn btn-primary" onClick={this.openSearchDialog}>+</a>
        </div>
        <QuerySearchDialog
          query={this.props.query}
          visible={this.state.searchDialogOpen}
          onOk={this.addSampleQuery}
          onCancel={this.closeSearchDialog}
        />
      </div>
    );
  }
}

export class EditableCell extends React.Component {
  static propTypes = {
    dataIndex: PropTypes.string.isRequired,
    editing: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: this.props.record ? this.props.record.table_visible : false,
    };
  }

  onChange = () => {
    this.setState({ visible: !this.state.visible });
  }

  getInput = () => {
    if (this.props.inputType === 'table_visible') {
      return (
        <TableVisibilityCheckbox
          visible={this.state.visible}
          onChange={this.onChange}
        />);
    } else if (this.props.inputType === 'sample_queries') {
      return <SampleQueryList query={this.props.Query} />;
    }
    return <TextArea className="table-textarea" placeholder="Enter table description..." style={{ resize: 'vertical' }} />;
  };

  render() {
    const {
      editing,
      dataIndex,
      record,
      ...restProps
    } = this.props;

    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    initialValue: record[dataIndex],
                  })(this.getInput()) }
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}
