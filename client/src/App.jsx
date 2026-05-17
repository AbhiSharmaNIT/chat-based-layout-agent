import { useState } from "react";
import axios from "axios";
import { initialDesign } from "./data/initialDesign";
import WireframePreview from "./components/WireframePreview";

function App() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! Tell me how you want to modify the layout.",
    },
  ]);

  const [layoutJson, setLayoutJson] = useState(initialDesign);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/layout/update", {
        instruction: input,
        currentJson: layoutJson,
      });

      setLayoutJson(res.data.updatedJson);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.data.explanation || "Layout updated successfully.",
        },
      ]);
    } catch (error) {
  console.error(error);

  setMessages((prev) => [
    ...prev,
    {
      role: "assistant",
      content:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong while updating the layout.",
    },
  ]);
}
finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chat Section */}
        <div className="bg-white rounded-2xl shadow p-4 flex flex-col h-[90vh]">
          <h1 className="text-2xl font-bold mb-4">Chat Layout Agent</h1>

          <div className="flex-1 overflow-y-auto space-y-3 mb-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-xl max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white ml-auto"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              className="flex-1 border rounded-xl px-4 py-2"
              placeholder="Example: Move headline to top"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />

            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-black text-white px-5 py-2 rounded-xl"
            >
              {loading ? "Updating..." : "Send"}
            </button>
          </div>
        </div>

        {/* JSON Viewer */}
        <div className="bg-white rounded-2xl shadow p-4 h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Updated Layout JSON</h2>

          <pre className="bg-gray-900 text-green-300 p-4 rounded-xl text-xs overflow-x-auto">
            {JSON.stringify(layoutJson, null, 2)}
          </pre>
          <WireframePreview layoutJson={layoutJson} />
        </div>
      </div>
    </div>
  );
}

export default App;
