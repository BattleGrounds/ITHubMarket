import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [sortType, setSortType] = useState('price');
  const [sortOrder, setSortOrder] = useState('asc');
  const [algorithm, setAlgorithm] = useState('builtin');
  const [time, setTime] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 50;

  const fetchData = useCallback(async () => {
    const response = await fetch('https://ithubmarket.onrender.com/api/sort', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sortType, sortOrder, algorithm, page, perPage }),
    });
    const data = await response.json();
    setProducts(data.products);
    setTotal(data.total);
    setTime(data.time);
  }, [sortType, sortOrder, algorithm, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSortChange = (e) => {
    setSortType(e.target.value);
  };

  const handleOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleAlgorithmChange = (e) => {
    setAlgorithm(e.target.value);
  };

  const handleNextPage = () => {
    if (page < Math.ceil(total / perPage)) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="App">
      <h1>Сравнение алгоритмов сортировки</h1>
      <div className="controls">
        <select value={sortType} onChange={handleSortChange}>
          <option value="price">По цене</option>
          <option value="name">По имени</option>
        </select>
        <select value={sortOrder} onChange={handleOrderChange}>
          <option value="asc">По возрастанию</option>
          <option value="desc">По убыванию</option>
        </select>
        <select value={algorithm} onChange={handleAlgorithmChange}>
          <option value="builtin">Встроенная сортировка</option>
          <option value="bubble">Пузырьковая сортировка</option>
          <option value="tim">TimSort</option>
        </select>
        <button onClick={fetchData}>Сортировать</button>
      </div>
      <div className="time">Время сортировки: {time} мс</div>
      <div className="products">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <h3>{product.name}</h3>
            <p>Цена: {product.price}₽</p>
            <p>Категория: {product.category}</p>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={page === 1}>Назад</button>
        <span>Страница {page} из {Math.ceil(total / perPage)}</span>
        <button onClick={handleNextPage} disabled={page === Math.ceil(total / perPage)}>Вперед</button>
      </div>
    </div>
  );
}

export default App;