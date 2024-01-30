// components/ScrollableWords.js
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { VariableSizeList } from 'react-window';

const ScrollableWords = () => {
  const [words, setWords] = useState([]);
  const containerRef = useRef(null);
  const rowHeight = 30; // Adjusted height
  const fetchThreshold = 500; // Adjust as needed
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const fetchData = async (page) => {
    try {
      const response = await axios.get(
        'https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt'
      );
      const allWords = response.data.split('\n');
      const startIndex = (page - 1) * fetchThreshold;
      const endIndex = startIndex + fetchThreshold;
      const pageData = allWords.slice(startIndex, endIndex);
      setWords((prevWords) => [...prevWords, ...pageData]);
      setCurrentPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error('Error fetching words:', error);
    }
  };

  const handleIntersection = (entries) => {
    const container = containerRef.current;
    if (entries[0].isIntersecting && currentPage * fetchThreshold < words.length) {
      fetchData(currentPage);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [currentPage, words]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '50%', // Adjusted width
        margin: '0 auto', // Centered horizontally
        height: '300px',
        overflowY: 'auto',
        border: '1px solid black',
      }}
    >
      <VariableSizeList
        height={words.length * rowHeight}
        itemCount={words.length}
        itemSize={() => rowHeight}
        width="100%"
      >
        {({ index, style }) => (
          <div style={{ ...style, border: '1px solid black', padding: '5px', textAlign: 'center' }}>
            {words[index]}
          </div>
        )}
      </VariableSizeList>
    </div>
  );
};

export default ScrollableWords;
