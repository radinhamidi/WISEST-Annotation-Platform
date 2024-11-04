import React from 'react';

const updateHash = (highlight) => {
  document.location.hash = `highlight-${highlight.id}`;
};

export function Sidebar({ highlights, toggleDocument, resetHighlights, updateQuoteFromSRTextbox }) {
  return (
    <div className="sidebar" style={{ width: '25vw' }}>
      <div className="description" style={{ padding: '1rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Your Annotations</h3><hr />
      </div>

      <ul className="sidebar__highlights">
        {highlights.map((highlight, index) => (
          <li
            key={index}
            className="sidebar__highlight"
            onClick={() => {
              updateHash(highlight);
            }

            }
          >
            <div>
              <strong>{highlight.comment.text}</strong>
              {highlight.content.text ? (
                <blockquote style={{ marginTop: '0.5rem' }}>
                  {`${highlight.content.text.slice(0, 90).trim()}…`}
                </blockquote>
              ) : null}
              {highlight.content.image ? (
                <div
                  className="highlight__image"
                  style={{ marginTop: '0.5rem' }}
                >
                  <img src={highlight.content.image} alt={'Screenshot'} />
                </div>
              ) : null}
            </div>
            <div className="highlight__location">
              Page {highlight.position.pageNumber}
            </div>
            <button onClick={() => updateQuoteFromSRTextbox(highlight.content.text)}>Select Quote From SR</button>
          </li>
        ))}
      </ul>
      <div style={{ padding: '1rem' }}>
        <button onClick={toggleDocument}>Toggle PDF document</button>
      </div>
      {highlights.length > 0 ? (
        <div style={{ padding: '1rem' }}>
          <button onClick={resetHighlights}>Reset highlights</button>
        </div>
      ) : null}
    </div>
  );
}
