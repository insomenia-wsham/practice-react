import { Navbar, Page, List, ListItem } from 'framework7-react';
import React, { useEffect, useState } from 'react';
import { getCategories, API_URL } from '@api';

const CategoryIndexPage = ({ f7route }) => {
  const { is_main } = f7route.query;

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    (async () => {
      const { data } = await getCategories({ q: { s: ['title asc'] } });
      setCategories(data);
    })();
  }, []);

  return (
    <Page>
      <Navbar title="카테고리" backLink={!is_main} />
      <List medial-list>
        {categories.map((category, i) => (
          <ListItem key={i} title={category.title} link={`/items?category_id=${category.id}`}>
            <img slot="media" src={API_URL + category.image_path} width="44" />
          </ListItem>
        ))}
      </List>
    </Page>
  );
};

export default React.memo(CategoryIndexPage);
