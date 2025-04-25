'use client';

const History = ({ history, handleHistoryItemClick, clearHistory }) => {
  if (history.length === 0) {
    return (
      <div className="history-container">
        <div className="history-header">
          <h3>Riwayat Perhitungan</h3>
          <button className="history-clear-btn" disabled>
            <i className="fas fa-trash"></i>
          </button>
        </div>
        <div className="history-empty">
          <p>Belum ada riwayat perhitungan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h3>Riwayat Perhitungan</h3>
        <button className="history-clear-btn" onClick={clearHistory} title="Hapus Riwayat">
          <i className="fas fa-trash"></i>
        </button>
      </div>
      <div className="history-list">
        {history.map((item, index) => (
          <div
            key={index}
            className="history-item"
            onClick={() => handleHistoryItemClick(item)}
          >
            <div className="history-expression">{item.expression}</div>
            <div className="history-result">{item.result}</div>
            {item.timestamp && (
              <div className="history-timestamp">
                {new Date(item.timestamp).toLocaleString()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
