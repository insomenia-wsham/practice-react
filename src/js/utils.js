import React from 'react';
import moment from 'moment';
import { isString, map } from 'lodash';

export const currency = (data, options) => {
  if (!data) return '';
  return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const dateFormat = (date, format) => {
  try {
    return moment(date).format(i18next.t('date_formats')[format]);
  } catch (e) {
    console.log(e);
    return '시간이나 포맷이 잘못되었습니다.';
  }
};

export const enumT = (model_name, value) => {
  try {
    return i18next.t('enum')[model_name][value];
  } catch {
    return '모델명 혹은 값이 잘못되었습니다.';
  }
};

export const toast = (() => {
  let instance;
  // public
  function init(f7) {
    const textToast = f7.toast.create({
      text: 'text',
      position: 'center',
      closeTimeout: 2000,
    });
    const iconToast = f7.toast.create({
      text: 'text',
      icon: `<i class="f7-icons">exclamationmark_triangle</i>`,
      position: 'center',
      closeTimeout: 2000,
    });
    function privateMethod() {
      console.log('private');
    }
    return {
      openToast: () => textToast.open(),
      openIconToast: () => iconToast.open(),
      setToastIcon: (icon) => {
        iconToast.$el.find('.toast-icon i.f7-icons').text(icon);
        return instance;
      },
      setToastText: (text) => {
        textToast.$el.find('.toast-text').text(text);
        iconToast.$el.find('.toast-text').text(text);
        return instance;
      },
    };
  }
  return {
    get: (_) => instance,
    set(f7) {
      if (!instance) instance = init(f7);
    },
  };
})();

export const objectsSkeletonPlaceholder = (size) => ({
  objects: new Array(size).fill({}),
  total_pages: 0,
  total_count: 0,
});

export const simpleFormat = (text, options) => {
  try {
    eltext = isString(text) ? text.split(/(?:\r\n|\r|\n)/g) : [];
    text = map(text, (v) => <>{v}</>);
    return text;
  } catch (e) {
    console.log(e);
  }
};

export const sleep = (n) => new Promise((resolve) => setTimeout(resolve, n));

export const saleRate = ({ list_price, sale_price }) => {
  let result = 0;
  if (list_price !== sale_price) {
    const resultSaleRate = Math.round((sale_price / list_price) * 100);
    result = 100 - resultSaleRate;
  }
  return result;
};
