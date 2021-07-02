import React, { useEffect, useState } from 'react';
import { API_URL, getItems } from '@api';
import { Row, Col, Link } from 'framework7-react';

const ItemList = () => {
  const tabTitle = ['NEW', 'EXPENSIVE', 'INEXPENSIVE'];
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('NEW');
  const handleOrderChage = (title) => {
    setFilter(title);
  };

  useEffect(() => {
    (async () => {
      let s = 'created_at desc';
      if (filter === 'EXPENSIVE') {
        s = 'sale_price desc';
      } else if (filter === 'INEXPENSIVE') {
        s = 'sale_price asc';
      }
      const { data } = await getItems({
        q: { s },
        offset: 0,
        limit: 15,
      });
      setItems(data.items);
    })();
  }, [filter]);

  return (
    <div>
      <Row className="mb-2 text-center border-gray-300 border">
        {tabTitle.map((title, i) => (
          <button key={i} id={title} className="w-1/3" onClick={() => handleOrderChage(title)}>
            <Col
              key={title}
              className={`py-2 border-gray-300 ${title === 'EXPENSIVE' ? 'border-l border-r' : ''} ${
                filter === title ? 'bg-gray-800 text-white' : 'bg-white text-black'
              }`}
            >
              {title}
            </Col>
          </button>
        ))}
      </Row>
      <ul>
        {items.map((item, i) => (
          <li key={i} className="inline-block w-1/3 px-1">
            <Link href={`/items/${item.id}`}>
              <img src={API_URL + item.image_path} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemList;
