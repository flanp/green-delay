const PAGE_NUMBER = 'pageNumber';
const PAGE_SIZE = 'pageSize';

const getObjWithoutPaginationProps = (obj) => {
    obj = {...obj};
    if (obj.hasOwnProperty(PAGE_NUMBER)){
        delete obj.pageNumber;
    }

    if (obj.hasOwnProperty(PAGE_SIZE)){
        delete obj.pageSize;
    }

    return obj;
}

const getPaginationProps = (obj) => {
    let pageSize = 20;
    let pageNumber = 0;

    if (obj.hasOwnProperty(PAGE_NUMBER)){
        pageNumber = isNaN(parseInt(obj[PAGE_NUMBER])) ? pageNumber : parseInt(obj[PAGE_NUMBER]);
    }

    if (obj.hasOwnProperty(PAGE_SIZE)){
        pageSize = isNaN(parseInt(obj[PAGE_SIZE])) ? pageSize : parseInt(obj[PAGE_SIZE]);
    }

    return {
        pageNumber,
        pageSize
    };
}

module.exports = {
    getObjWithoutPaginationProps,
    getPaginationProps,
};