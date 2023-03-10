import React from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useReducer } from 'react';
import logger from 'use-reducer-logger';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProductInfo from './ProductInfo';
import { Helmet } from 'react-helmet-async';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function Home() {
  const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
    products: [],
    loading: true,
    error: '',
  });
  //   const [products, setProducts] = useState([]);
  // This useEffect will behave like componentDidMount i.e. executes only after 1st render.
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products/');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: error.message });
      }
      //   setProducts(result.data);
    };

    fetchData();
  }, []);
  return (
    <div>
      <Helmet>
        <title>DEPO24</title>
      </Helmet>
      <h1>Featured Products</h1>
      <div className="products">
        {loading ? (
          <div class="d-flex justify-content-center text-info">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div class="p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3">
            {error}
          </div>
        ) : (
          <Row>
            {products.map((product) => (
              <Col key={product.DSIN} sm={6} md={4} lg={3} className="mb-3">
                <ProductInfo product={product}></ProductInfo>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default Home;
