import PropTypes from 'prop-types';

export const DataSource = PropTypes.shape({
  syntax: PropTypes.string,
  options: PropTypes.shape({
    doc: PropTypes.string,
    doc_url: PropTypes.string,
  }),
  type_name: PropTypes.string,
});

export const DataSourceMetadata = PropTypes.shape({
  key: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  example: PropTypes.string,
  column_description: PropTypes.string,
});

export const Query = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
});

export const Table = PropTypes.shape({
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
});

export const Schema = PropTypes.arrayOf(Table);
