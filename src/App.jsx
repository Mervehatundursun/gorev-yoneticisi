import { useState, useEffect } from 'react';

function App() {
  // 1. VERİ TUTMA ALANI (State'ler)
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState('');

  // 2. LOCALSTORAGE'DAN VERİ ÇEKME (Sayfa ilk açıldığında çalışır)
  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('görevler'));
    if (storedTodos) {
      setTodos(storedTodos);
    }
  }, []);

  // 3. LOCALSTORAGE'A VERİ KAYDETME (Görev listesi her değiştiğinde çalışır)
  useEffect(() => {
    localStorage.setItem('görevler', JSON.stringify(todos));
  }, [todos]);

  // --- CRUD İŞLEMLERİ ---

  // İşlem 1: EKLE (Create)
  const addTodo = () => {
    if (inputValue.trim() === '') return; // Boş eklemeyi engeller
    const newTodo = {
      id: Date.now(), // Benzersiz bir kimlik (ID) oluşturur
      text: inputValue
    };
    setTodos([...todos, newTodo]); // Eski listeye yeni görevi ekler
    setInputValue(''); // Input'un içini temizler
  };

  // İşlem 2: SİL (Delete)
  const deleteTodo = (id) => {
    // Silinmek istenen ID dışındaki tüm görevleri filtreleyip yeni liste yapar
    const filteredTodos = todos.filter(todo => todo.id !== id);
    setTodos(filteredTodos);
  };

  // İşlem 3: GÜNCELLEME (Update) - 1. Aşama: Düzenleme modunu açar
  const startEdit = (todo) => {
    setEditId(todo.id);
    setEditValue(todo.text);
  };

  // İşlem 3: GÜNCELLEME (Update) - 2. Aşama: Değişikliği kaydeder
  const saveEdit = (id) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, text: editValue } : todo
    );
    setTodos(updatedTodos);
    setEditId(null); // Düzenleme modunu kapatır
    setEditValue('');
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">Görev Yöneticisi</h1>

        {/* EKLEME ALANI */}
        <div className="flex mb-6 shadow-sm rounded-lg overflow-hidden">
          <input
            type="text"
            className="border p-3 w-full outline-none focus:bg-gray-50"
            placeholder="Yeni bir görev yazın..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            onClick={addTodo}
            className="bg-indigo-600 text-white px-6 py-3 hover:bg-indigo-700 transition font-semibold"
          >
            Ekle
          </button>
        </div>

        {/* İşlem 4: LİSTELEME (Read) */}
        <ul className="space-y-3">
          {todos.map(todo => (
            <li key={todo.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition">

              {/* Eğer bu öğe düzenleniyorsa input göster, yoksa metni göster */}
              {editId === todo.id ? (
                <div className="flex w-full gap-2">
                  <input
                    type="text"
                    className="border p-2 w-full rounded focus:outline-indigo-300"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
                  <button onClick={() => saveEdit(todo.id)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 font-medium">Kaydet</button>
                  <button onClick={() => setEditId(null)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 font-medium">İptal</button>
                </div>
              ) : (
                <>
                  <span className="flex-1 text-gray-700 text-lg">{todo.text}</span>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(todo)} className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded hover:bg-yellow-200 transition font-medium text-sm">Düzenle</button>
                    <button onClick={() => deleteTodo(todo.id)} className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition font-medium text-sm">Sil</button>
                  </div>
                </>
              )}
            </li>
          ))}

          {/* Liste boşsa gösterilecek mesaj */}
          {todos.length === 0 && (
            <p className="text-center text-gray-400 mt-6 pb-2">Henüz eklenecek bir görev yok.</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;