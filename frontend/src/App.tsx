import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Pavon Online Store
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <button
            onClick={() => setCount((count) => count + 1)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
          >
            Count is {count}
          </button>
          <p className="mt-4 text-gray-600">
            Tailwind CSS is working! 🎉
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
