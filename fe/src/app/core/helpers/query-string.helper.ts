export function buildQueryString(obj: any) {
    let str = '';
    for (const p in obj) {
      if (
        obj.hasOwnProperty(p) &&
        obj[p] !== undefined &&
        obj[p] !== null &&
        obj[p] !== ''
      ) {
        str += encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]) + '&';
      }
    }
    return str;
  }