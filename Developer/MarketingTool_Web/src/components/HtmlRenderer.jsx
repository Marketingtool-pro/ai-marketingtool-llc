import PropTypes from 'prop-types';
/***************************  CONTENT - INNER HTML  ***************************/

function HtmlRenderer({ htmlString }) {
  return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
}

export default HtmlRenderer;

HtmlRenderer.propTypes = { htmlString: PropTypes.string };
