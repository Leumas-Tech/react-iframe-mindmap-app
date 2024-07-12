import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const DraggableIframe = ({ url, index, onRemove }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [size, setSize] = useState({ width: 300, height: 200 });
  const [iframeUrl, setIframeUrl] = useState(url);
  const iframeRef = useRef(null);

  const handleMouseDown = (e) => {
    if (e.ctrlKey) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResizeMouseDown = (e) => {
    setIsResizing(true);
  };

  const handleResizeMouseMove = (e) => {
    if (isResizing) {
      setSize({
        width: e.clientX - position.x,
        height: e.clientY - position.y,
      });
    }
  };

  const handleResizeMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizing) {
        setSize({
          width: e.clientX - position.x,
          height: e.clientY - position.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, position.x, position.y]);

  useEffect(() => {
    const updateUrl = () => {
      if (iframeRef.current) {
        setIframeUrl(iframeRef.current.contentWindow.location.href);
      }
    };

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener('load', updateUrl);
    }

    return () => {
      if (iframe) {
        iframe.removeEventListener('load', updateUrl);
      }
    };
  }, [iframeRef]);

  return (
    <div
      className="tab"
      style={{ transform: `translate(${position.x}px, ${position.y}px)`, width: size.width, height: size.height }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="tab-header">
        <span>{iframeUrl}</span>
        <button className="close-button" onClick={() => onRemove(index)}>
          ×
        </button>
      </div>
      <iframe ref={iframeRef} src={url} title={`iframe-${index}`} />
      <div className="resize-handle" onMouseDown={handleResizeMouseDown}></div>
    </div>
  );
};

const App = () => {
  const [tabs, setTabs] = useState([]);
  const [newUrl, setNewUrl] = useState('');

  const addTab = () => {
    if (newUrl) {
      setTabs([...tabs, newUrl]);
      setNewUrl('');
    }
  };

  const removeTab = (index) => {
    setTabs(tabs.filter((_, i) => i !== index));
  };

  return (
    <div className="app-container">
      <div className="tab-controls">
        <input
          type="text"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder="Enter URL"
        />
        <button onClick={addTab}>Add Tab</button>
      </div>
      <div className="mindmap-area">
        {tabs.map((url, index) => (
          <DraggableIframe key={index} url={url} index={index} onRemove={removeTab} />
        ))}
      </div>
    </div>
  );
};

export default App;
