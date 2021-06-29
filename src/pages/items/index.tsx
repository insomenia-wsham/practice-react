import { API_URL, getCategory, getItems, getCarts } from '@api';
import { useQuery } from 'react-query';
import { Item } from '@constants';
import { currency } from '@js/utils';
import { useFormik } from 'formik';
import { Link, List, ListInput, ListItem, Navbar, NavRight, NavTitle, Page, Row, Col } from 'framework7-react';
import { map } from 'lodash';
import React, { useEffect, useState, useRef } from 'react';
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
  const { data, status, error } = useQuery<any>('carts', getCarts());
  const { is_main, category_id } = f7route.query;
  const [viewType, setViewType] = useState<string>('grid');
  const [category, setCategory] = useState(null);
  const [itemList, setItemList] = useState([]);
  const [itemTotalCount, setItemTotalCount] = useState(0);
  const [filterValues, setFilterValues] = useState({
    offset: 0,
    limit: 20,
    s: 'created_at desc',
  });

  const allowInfinite = useRef(true);
  const [showPreloader, setShowPreloader] = useState(true);

  const loadMore = () => {
    if (!allowInfinite.current) return;
    allowInfinite.current = false;

    setTimeout(async () => {
      if (itemList.length >= itemTotalCount) {
        setShowPreloader(false);
        return;
      }
      const { data: itemData } = await getItems({
        q: { category_id_eq: category_id, s: filterValues.s },
        offset: filterValues.offset + 20,
        limit: filterValues.limit + 20,
      });
      allowInfinite.current = true;
      setItemList((prev) => [...prev, ...itemData.items]);
    }, 1000);
  };

  useEffect(() => {
    if (category_id) {
      getCategory(category_id).then((resp) => {
        setCategory(resp.data);
      });
    }
    (async () => {
      const { data: itemData } = await getItems({
        q: { category_id_eq: category_id, s: filterValues.s },
        offset: filterValues.offset,
        limit: filterValues.limit,
      });
      setItemList(itemData.items);
      setItemTotalCount(itemData.total_count);
    })();
  }, [filterValues]);

  const filterForm = useFormik<ItemFilterProps>({
    initialValues: {
      s: 'created_at desc',
      category_id_eq: category_id,
    },
    onSubmit: async (res) => {
      setFilterValues({
        ...filterValues,
        s: res.s,
      });
    },
  });

  const onRefresh = async (done) => {
    done();
  };

  const salePercent = (list_price: number, sale_price: number) => {
    const saleValue = list_price - sale_price;
    const lastValue = saleValue / list_price;

    return `${lastValue === 0 ? 0 : parseFloat((Number(lastValue) * 100).toFixed(1))}%`;
  };

  return (
    <Page
      noToolbar={!is_main}
      onPtrRefresh={onRefresh}
      infinite
      infiniteDistance={50}
      infinitePreloader={showPreloader}
      onInfinite={loadMore}
      ptr
    >
      <Navbar backLink={!is_main}>
        <NavTitle>{(category && category.title) || '쇼핑'}</NavTitle>
        <NavRight>
          <Link href="/carts" iconF7="cart" iconBadge={data ? data.total_count : 0} badgeColor="red" />
        </NavRight>
      </Navbar>

      <form onSubmit={filterForm.handleSubmit} className="item-list-form p-3 table w-full border-b">
        <div className="float-left">
          총 <b>{currency(itemTotalCount || 0)}</b>개 상품
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
      <List noHairlines className="mt-4 text-sm font-thin ">
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
                      subtitle={`${currency(item.sale_price).toLocaleString()}원`}
                      className="w-full"
                    >
                      <img slot="media" src={API_URL + item.image_path} className="w-20 rounded" alt="" />
                    </ListItem>
                  </React.Fragment>
                ))
              : itemList.map((item: Item, i) => (
                  // <React.Fragment key={item.id}>
                  //   <div className="w-1/2 inline-flex grid-list-item relative">
                  //     <ListItem
                  //       mediaItem
                  //       link={`/items/${item.id}`}
                  //       title={`${item.id}-${item.name}`}
                  //       subtitle={`${currency(item.sale_price).toLocaleString()}원`}
                  //       header={category_id ? category?.title : ''}
                  //       className="w-full"
                  //     >
                  //       <img
                  //         slot="media"
                  //         alt=""
                  //         src={API_URL + item.image_path}
                  //         className="w-40 m-auto radius rounded shadow"
                  //       />
                  //     </ListItem>
                  //   </div>
                  // </React.Fragment>
                  <React.Fragment key={item.id}>
                    <a href={`/items/${item.id}`}>
                      <div className="inline-block mx-auto w-1/2">
                        <img
                          slot="media"
                          alt=""
                          src={API_URL + item.image_path}
                          className="w-40 m-auto mb-3 radius rounded shadow"
                        />
                        <div className="w-40 m-auto mb-6">
                          <div>
                            {salePercent(item.list_price, item.sale_price) !== '0%' ? (
                              <b className="rounded-sm bg-yellow-500 text-white px-2">할인판매</b>
                            ) : (
                              <b className="rounded-sm bg-blue-500 text-white px-2">인기상품</b>
                            )}
                          </div>

                          <p>{`${item.id}-${item.name}`}</p>
                          <div>
                            {salePercent(item.list_price, item.sale_price) !== '0%' ? (
                              <b className="text-base text-red-500 mr-2">
                                {salePercent(item.list_price, item.sale_price)}
                              </b>
                            ) : null}
                            <b className="text-lg">{currency(item.sale_price).toLocaleString()}</b>원
                          </div>
                        </div>
                      </div>
                    </a>
                  </React.Fragment>
                ))}
          </ul>
        )}
      </List>
    </Page>
  );
};

export default React.memo(ItemIndexPage);
