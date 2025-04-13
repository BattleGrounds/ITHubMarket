from flask import Flask, jsonify, request
from flask_cors import CORS
import time
import random
import os

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "https://it-hub-market.vercel.app"}})

# Определяем порт и хост
port = int(os.environ.get("PORT", 5000))  # Используем PORT из переменных окружения, если он не установлен, используем 5000
host = os.environ.get("HOST", "0.0.0.0")  # Используем HOST из переменных окружения, если он не установлен, используем 0.0.0.0

# Генерация 1 тысячи товаров при запуске сервера
products = [
    {
        "id": i,
        "name": f"Товар {i}",
        "price": random.randint(100, 1000000),
        "rating": round(random.uniform(1.0, 5.0), 1)
    } 
    for i in range(1_000)
]

def bubble_sort(arr, key):
    # Оптимизированная версия пузырьковой сортировки
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n-i-1):
            if arr[j][key] > arr[j+1][key]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr

@app.route('/api/sort', methods=['POST'])
def sort_products ():
    data = request.json
    key = data['sortType']
    reverse = True if data['sortOrder'] == 'asc' else False
    algorithm = data['algorithm']
    page = data.get('page', 1)
    per_page = data.get('per_page', 50)
    
    # Создаем копию для сортировки
    arr = products.copy()

    sorted_arr = []

    start_time = time.time()

    if algorithm == 'builtin':
        sorted_arr = sorted(arr, key=lambda x: x[key], reverse=reverse)
    elif algorithm == 'custom':
        sorted_arr = bubble_sort(arr, key)
        if reverse:
            sorted_arr.reverse()
    
    # Пагинация
    total = len(sorted_arr)
    start = (page - 1) * per_page
    end = start + per_page
    paginated = sorted_arr[start:end]
    
    execution_time = (time.time() - start_time) * 1000
    
    return jsonify({
        'products': paginated,
        'time': f"{execution_time:.2f} ms",
        'total': total,
        'page': page,
        'per_page': per_page
    })

if __name__ == '__main__':
    app.run(host=host, port=port)