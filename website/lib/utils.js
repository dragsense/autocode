export function isEmpty(value) {

  if (!value)
    return true;

  return Object.keys(value).length === 0
    && value.constructor === Object;
}


export function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}


export function debounce(func, wait) {
  let timeoutId;
  return function (...args) {
    const context = this;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

export function formatDate(dateString, format) {
  const date = new Date(dateString);

  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

  if (format === 'YYYY-MM-DD') {
    return formattedDate.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$1-$2');
  } else if (format === 'MM/DD/YYYY') {
    return formattedDate;
  } else if (format === 'DD/MM/YYYY') {
    return formattedDate.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3');
  } else if (format === 'YYYY/MM/DD') {
    return formattedDate.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3/$1/$2');
  } else if (format === 'Month D, YYYY') {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } else if (format === 'D MMM, YYYY') {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } else if (format === 'MMMM DD, YYYY') {
    const options = { month: 'long', day: '2-digit', year: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } else if (format === 'DD MMM, YYYY') {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } else {
    return formattedDate;
  }
}

export const getCurrentDate = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear());
  return `${day}-${month}-${year}`;
};

export const generateCss = (styles) => {
  let css = '';
  Object.keys(styles).map((key) => {
    if (styles[key]) {
      if (key !== 'normal')
        css += '@media ' + key + ' {\n';
      Object.values(styles[key]).flatMap((element) => {

        Object.values(element.selectors).map(selector => {
          let properties = Object.entries(selector.properties).map(([key, property]) => `${key}: ${property.value}`).join(';');
          css += `${selector.selectorText} {\n  ${properties}\n}\n\n`;
        }).join('');

      });

      if (key !== 'normal')
        css += ' }\n';
    }
  });

  return css;
}


export const generateAnimations = (styles) => {

  let css = '';
  Object.keys(styles).map((key) => {

    Object.values(styles[key]).flatMap((element) => {

      let selectorCss = '';
      Object.values(element.selectors).map(selector => {
        let properties = Object.entries(selector.properties).map(([key, property]) => `${key}: ${property.value}`).join(';');
        selectorCss += `${selector.selectorText} {\n  ${properties}\n}\n\n`;
      }).join('');

      css += `@keyframes ${element.elementType} { ${selectorCss} }\n`;

    });

  })
  return css;

}


export const generateAnimationNames = (styles) => {

  let names = [];
  Object.keys(styles).map((key) => {
    Object.values(styles[key]).flatMap((element) => {
      names.push(element.elementType);
    });

  })
  return names;

}


export const getStateValue = (key, states) => {

  let defaultValue = "";

  if (!states)
    return defaultValue;

  const stateRef = states[key[0]];

  if (!stateRef)
    return defaultValue;


  if (stateRef.type == 'image') {
    defaultValue = {
      value: stateRef.src ? stateRef.src.src : '/images/default/default-img.png',
      label: stateRef.src?.alt
    }
  }
  else
    if (stateRef.type == 'video') {
      defaultValue = {
        value: stateRef.src ? stateRef.src.src : '/images/default/default-poster.png',
        label: stateRef.src?.alt, srcs: stateRef.srcs
      }
    } else
      if (stateRef.type == 'audio') {
        defaultValue = {
          value: '/audios/default/sample.mp3', srcs: stateRef.srcs
        }
      }
      else
        if (key[1] && stateRef.states) {
          defaultValue = (stateRef.states[key[1]] !== undefined ? stateRef.states[key[1]] : "")
        }
        else
          defaultValue = (stateRef.defaultValue !== undefined ? stateRef.defaultValue : "");



  return defaultValue;
}

export const getStateStates = (key, states) => {


  let values = [];

  if (!states)
    return values;

  const value = states[key[0]];
  if (!value)
    return values;

  // if (value.type == 'arraylength') {
  //   const defaultValue = (value.defaultValue !== undefined ? value.defaultValue : 0);
  //   values = Array.from({ length: parseInt(defaultValue) }, (_, index) => {
  //     return { label: `${value.text || "Item"} ${index}`, value: index }
  //   })
  // }



  if (value.type == 'array') {
    values = Object.values(value.states).map((value, index) => {
      const val = value.split(":");
      return { label: val[0], value: val[1] ? val[1] : index }
    })
  }

  if (value.type == 'images') {
    values = Object.values(value.states).map((value) => {
      return { label: value.alt, value: value.src }
    })
  }


  return values;
}

export const getStateRef = (key, states) => {

  if (!states)
    return undefined;

  let value = states[key[0]];
  return value;
}



export const updateStateValue = (key, withValue, states, value, updateKey = "defaultValue") => {



  let stateRef = getStateRef(key, states);

  if (!stateRef)
    return false;

  try {
    let val = '';
    let evalString;


    if (withValue)
      evalString = `${withValue} ${value}`;
    else
      evalString = `${value}`;

    evalString = evalString.replace(/\s/g, '');
    const hasNonNumeric = /[^+\-*/()\d]/.test(evalString);
    val = hasNonNumeric ? evalString : eval(evalString);
    if (val >= stateRef.max && updateKey !== 'max')
      val = stateRef.max - 1;
    else
      if (val <= stateRef.min && updateKey !== 'min')
        val = stateRef.min;



    if (stateRef.type == 'boolean')
      val = stateRef[updateKey] ? 0 : 1;

    if (stateRef.type == 'array')
      val = val.split(',')

    if (key[1])
      stateRef.states[key[1]] = val;
    else
      stateRef[updateKey] = val;


  } catch (e) {

    message.error(e.message);
  }



}


export const getPaginationRange = (currentPage, totalPages, pagination) => {
  let leftRangeLength = pagination.leftRange || 1;
  let rightRangeLength = pagination.rightRange || 1;
  const rangeSize = pagination.nearRange || 2;

  const dots = pagination.dots || "...";

  let start = Math.max(currentPage - rangeSize, 1);
  let end = Math.min(currentPage + rangeSize, totalPages);

  if (leftRangeLength > totalPages) {
    leftRangeLength = totalPages;
    rightRangeLength = 0;
  }

  if (rightRangeLength + leftRangeLength > totalPages) {
    rightRangeLength = totalPages - leftRangeLength;
  }


  if (start === 1) {
    end = Math.min(start + rangeSize * 2, totalPages);
  } else if (end === totalPages) {
    start = Math.max(end - rangeSize * 2, 1);
  }

  const leftRange = [];
  const rightRange = [];

  for (let i = 1; i <= leftRangeLength; i++) {
    leftRange.push(i);
  }

  if (start > leftRangeLength + 1) {
    leftRange.push(dots);
  }

  if (end < totalPages - rightRangeLength) {
    rightRange.push(dots);
  }

  for (let i = totalPages - rightRangeLength + 1; i <= totalPages; i++) {
    rightRange.push(i);
  }

  const nearbyRange = [];

  const startIndex = start > leftRangeLength ? start : leftRangeLength + 1;

  const endIndex = end < totalPages - rightRangeLength + 1 ? end : end - rightRangeLength;
  for (let i = startIndex; i <= endIndex; i++) {
    nearbyRange.push(i);
  }

  return [...leftRange, ...nearbyRange, ...rightRange];
};
