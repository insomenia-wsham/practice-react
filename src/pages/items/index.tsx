import {
  API_URL,
  getCategory,
  getItems,
  getCarts,
  createCart,
  getInterestList,
  deleteInterestItem,
  createInterestItem,
} from '@api';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Item } from '@constants';
import { currency } from '@js/utils';
import { useFormik } from 'formik';
import {
  f7,
  Link,
  List,
  ListInput,
  ListItem,
  Navbar,
  NavRight,
  NavTitle,
  Page,
  Subnavbar,
  Searchbar,
} from 'framework7-react';
import { map } from 'lodash';
import React, { useEffect, useState, useRef } from 'react';
import LandingPage from '@pages/landing';
import i18n from '../../assets/lang/i18n';
import icoCart from '../../assets/images/ico_cart.svg';

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
  const { data: interestsData } = useQuery<any>('interest', getInterestList());
  const { is_main, category_id } = f7route.query;
  const deleteInterestMutation = useMutation(deleteInterestItem());
  const createInterestMutation = useMutation(createInterestItem());
  const createCartMutation = useMutation(createCart());
  const queryClient = useQueryClient();
  const [viewType, setViewType] = useState<string>('grid');
  const [category, setCategory] = useState(null);
  const [itemList, setItemList] = useState([]);
  const [itemTotalCount, setItemTotalCount] = useState(0);
  const [filterValues, setFilterValues] = useState({
    name_cont: '',
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
        q: { category_id_eq: category_id, s: filterValues.s, name_cont: filterValues.name_cont },
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
        q: { category_id_eq: category_id, s: filterValues.s, name_cont: filterValues.name_cont },
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

  const handleCartCreate = (itemId) => {
    const toastCenter = f7.toast.create({
      text: '장바구니에 담았습니다.',
      position: 'center',
      closeTimeout: 1000,
    });
    createCartMutation.mutate(
      { item_id: itemId, item_count: 1 },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(`carts`);
          toastCenter.open();
        },
      },
    );
  };

  const handleKeywordChange = (e) => {
    setFilterValues({
      ...filterValues,
      name_cont: e.target.value,
    });
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
        <NavTitle>{(category && category.title) || '상품검색'}</NavTitle>
        <NavRight>
          <Link href="/carts" iconF7="cart" iconBadge={data ? data.total_count : 0} badgeColor="red" />
        </NavRight>
        <Subnavbar inner={false}>
          <Searchbar
            searchContainer=".search-list"
            searchIn=".item-title"
            placeholder="검색어를 입력해주세요."
            onChange={handleKeywordChange}
            disableButton={false}
          />
        </Subnavbar>
      </Navbar>

      {status === 'loading' && <LandingPage />}
      {status === 'error' && <div>{error}</div>}

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
                      title={`${item.name}`}
                      subtitle={`${currency(item.sale_price).toLocaleString()}원`}
                      className="w-full"
                    >
                      <img slot="media" src={API_URL + item.image_path} className="w-20 rounded" alt="" />
                    </ListItem>
                  </React.Fragment>
                ))
              : itemList.map((item: Item, i) => (
                  <React.Fragment key={item.id}>
                    <div className="relative inline-block mx-auto w-1/2">
                      <a href={`/items/${item.id}`}>
                        <img
                          slot="media"
                          alt=""
                          src={API_URL + item.image_path}
                          className="w-40 m-auto mb-3 radius rounded shadow"
                        />
                      </a>
                      <div className="absolute right-5 bottom-28" onClick={() => handleCartCreate(item.id)}>
                        <button>
                          <img src={icoCart} />
                        </button>
                      </div>
                      <div className="absolute right-5 bottom-14">
                        <button>
                          {interestsData && interestsData.interests.find((interest) => interest.item_id === item.id) ? (
                            <i
                              className="mb-2 la la-heart text-2xl text-red-500"
                              onClick={() =>
                                deleteInterestMutation.mutate(
                                  {
                                    id: interestsData.interests.find((interest) => interest.item_id === item.id).id,
                                  },
                                  {
                                    onSuccess: () => {
                                      queryClient.invalidateQueries('interest');
                                    },
                                  },
                                )
                              }
                            />
                          ) : (
                            <i
                              className="mb-2 la la-heart-o text-2xl text-gray-400"
                              onClick={() =>
                                createInterestMutation.mutate(
                                  {
                                    item_id: item.id,
                                  },
                                  {
                                    onSuccess: () => {
                                      queryClient.invalidateQueries('interest');
                                    },
                                  },
                                )
                              }
                            />
                          )}
                        </button>
                      </div>
                      <div className="w-40 m-auto mb-6">
                        <div>
                          {salePercent(item.list_price, item.sale_price) !== '0%' ? (
                            <b className="rounded-sm text-white px-2" style={{ backgroundColor: '#87768e' }}>
                              할인
                            </b>
                          ) : (
                            <b className="rounded-sm text-white px-2" style={{ backgroundColor: '#C39E96' }}>
                              인기
                            </b>
                          )}
                        </div>

                        <p>{`${item.name}`}</p>
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
                  </React.Fragment>
                ))}
          </ul>
        )}
      </List>
    </Page>
  );
};

export default React.memo(ItemIndexPage);
