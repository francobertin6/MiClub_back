
export default class CommonsUtils {

    static buildResult(opts) {
      const {
        docs,
        limit,
        totalPages,
        page,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        sort,
      } = opts
      return {
        status: 'success',
        payload: docs,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink: !hasPrevPage ? null : `http://localhost:8080/ecommerce?page=${prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}`,
        nextLink: !hasNextPage ? null : `http://localhost:8080/ecommerce?page=${nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}`,
        sort,
        sortLink: `http://localhost:8080/ecommerce?page=${page}&limit=${limit}&sort=${sort === 'asc' ? 'desc' : 'asc'}`
      }
     }
    
    }