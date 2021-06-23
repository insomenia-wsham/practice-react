import { API_URL, getCategory, getItems, getCarts } from '@api';
import { useQuery } from 'react-query';
import useAuth from '@hooks/useAuth';
import { Item } from '@constants';
import { currency } from '@js/utils';
import { useFormik } from 'formik';
import { Link, List, ListInput, ListItem, Navbar, NavRight, NavTitle, Page } from 'framework7-react';
import { map } from 'lodash';
import React, { useEffect, useState, useCallback } from 'react';
import i18n from '../../assets/lang/i18n';

const SortStates = [
  ['created_at desc', '최신순'],
  ['sale_price desc', '높은가격순'],
  ['sale_price asc', '낮은가격순'],
] as const;
type SortState = typeof SortStates[number][0];

interface ItemFilterProps {
  s: SortState;
  category_id_eq: string;
}

const ItemIndexPage = ({ f7route }) => {
  const { authenticateUser, currentUser } = useAuth();
  const { data, status, error } = useQuery<any>('carts', getCarts());
  const { is_main, category_id } = f7route.query;
  const [viewType, setViewType] = useState('grid');
  const [category, setCategory] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [itemIndex, setItemIndex] = useState(0);
  const [itemList, setItemList] = useState([]);
  // const [result, setResult] = useState(itemList.slice(0, 10));

  // const infiniteScroll = useCallback(() => {
  //   const scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
  //   const scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
  //   const { clientHeight } = document.documentElement;

  //   if (scrollTop + clientHeight === scrollHeight) {
  //     setItemIndex(itemIndex + 10);
  //     setResult(result.concat(itemList.slice(itemIndex + 10, itemIndex + 20)));
  //   }
  // }, [itemIndex, result]);

  useEffect(() => {
    if (category_id) {
      getCategory(category_id).then((resp) => {
        setCategory(resp.data);
      });
    }
    (async () => {
      const { data } = await getItems();
      const { items } = data;
      items.sort((a, b) => b.id - a.id);
      if (category_id) {
        const categorySortItem = items.filter((item) => item.category.id === Number(category_id));
        setItemList(categorySortItem);
      } else {
        setItemList(items);
        // setResult(items.slice(0, 10));
      }
    })();
  }, []);

  // useEffect(() => {
  //   window.addEventListener('scroll', infiniteScroll, true);
  //   return () => window.removeEventListener('scroll', infiniteScroll, true);
  // }, [infiniteScroll]);

  const filterForm = useFormik<ItemFilterProps>({
    initialValues: {
      s: 'created_at desc',
      category_id_eq: category_id,
    },
    onSubmit: async (res) => {
      if (res.s === 'sale_price desc') {
        itemList.sort((a, b) => b.sale_price - a.sale_price);
      } else if (res.s === 'sale_price asc') {
        itemList.sort((a, b) => a.sale_price - b.sale_price);
      } else {
        itemList.sort((a, b) => b.id - a.id);
      }
    },
  });

  const onRefresh = async (done) => {
    done();
  };

  return (
    <Page noToolbar={!is_main} onPtrRefresh={onRefresh} ptr>
      <Navbar backLink={!is_main}>
        <NavTitle>{(category && category.title) || '쇼핑'}</NavTitle>
        <NavRight>
          <Link href="/carts" iconF7="cart" iconBadge={data ? data.total_count : 0} badgeColor="red" />
        </NavRight>
      </Navbar>

      <form onSubmit={filterForm.handleSubmit} className="item-list-form p-3 table w-full border-b">
        <div className="float-left">
          총 <b>{currency((itemList && itemList.length) || 0)}</b>개 상품
        </div>
        <ListInput
          type="select"
          className="float-right inline-flex items-center px-2.5 py-3 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          name="s"
          onChange={(e) => {
            filterForm.handleChange(e);
            filterForm.submitForm();
          }}
          value={filterForm.values.s}
        >
          {map(SortStates, (v, idx) => (
            <option value={v[0]} key={idx}>
              {v[1]}
            </option>
          ))}
        </ListInput>
        <ListInput
          type="select"
          defaultValue="grid"
          className="float-right inline-flex items-center px-2.5 py-3 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2"
          onChange={(e) => setViewType(e.target.value)}
        >
          {map(i18n.t('ui'), (v, k) => (
            <option value={k} key={k}>
              {v}
            </option>
          ))}
        </ListInput>
      </form>
      <List noHairlines className="mt-0 text-sm font-thin ">
        {itemList && (
          <ul>
            {viewType === 'list'
              ? itemList.map((item: Item, i) => (
                  <React.Fragment key={item.id}>
                    <ListItem
                      key={item.id}
                      mediaItem
                      link={`/items/${item.id}`}
                      title={`${item.id}-${item.name}`}
                      subtitle={`${currency(item.sale_price)}원`}
                      className="w-full"
                    >
                      <img slot="media" src={API_URL + item.image_path} className="w-20 rounded" alt="" />
                    </ListItem>
                  </React.Fragment>
                ))
              : itemList.map((item: Item, i) => (
                  <React.Fragment key={item.id}>
                    <div className="w-1/2 inline-flex grid-list-item relative">
                      <ListItem
                        mediaItem
                        link={`/items/${item.id}`}
                        title={`${item.id}-${item.name}`}
                        subtitle={`${currency(item.sale_price)}원`}
                        header={category_id ? category?.title : ''}
                        className="w-full"
                      >
                        <img
                          slot="media"
                          alt=""
                          src={API_URL + item.image_path}
                          className="w-40 m-auto radius rounded shadow"
                        />
                      </ListItem>
                    </div>
                  </React.Fragment>
                ))}
          </ul>
        )}
      </List>
    </Page>
  );
};

export default React.memo(ItemIndexPage);
