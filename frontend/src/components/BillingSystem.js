import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Modal from "react-modal";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const API_URL = process.env.REACT_APP_API_URL;

const Billing = () => {
  const [fruits, setFruits] = useState({});
  const [shops, setShops] = useState({});
  const [orders, setOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pdfRef = useRef(); // Reference to the billing section

  useEffect(() => {
    fetchFruits();
    fetchOrders();
    fetchShops();
  }, []);

  const fetchFruits = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/fruits`);
      const fruitsMap = {};
      data.forEach((fruit) => {
        fruitsMap[fruit._id] = { 
          name: fruit.name, 
          priceKg: fruit.priceKg, 
          pricePiece: fruit.pricePiece 
        };
      });
      setFruits(fruitsMap);
    } catch (error) {
      console.error("Error fetching fruits:", error.response?.data || error.message);
    }
  };

  const fetchShops = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/shops`);
      const shopsMap = {};
      data.forEach((shop) => {
        shopsMap[shop._id] = { name: shop.name };
      });
      setShops(shopsMap);
    } catch (error) {
      console.error("Error fetching shops:", error.response?.data || error.message);
    }
  };

  const fetchOrders = async () => {
    if (!selectedDate) return;
    setLoading(true);
    setError(null);
    try {
      const istDate = formatDateForFilter(selectedDate)
      console.log(`${API_URL}/api/bills/${istDate}`)
      const { data } = await axios.get(`${API_URL}/api/bills/${istDate}`);
      console.log(data)
      setOrders(data);
    } catch (error) {
      setError("Failed to fetch orders.");
    }
    setLoading(false);
  };

  const updateFruitPrice = async (id, priceKg, pricePiece) => {
    try {
      await axios.put(`${API_URL}/api/fruits/${id}`, { priceKg, pricePiece });
      setFruits((prev) => ({
        ...prev,
        [id]: { ...prev[id], priceKg, priceKg },
      }));
    } catch (error) {
      console.error("Error updating price:", error.response?.data || error.message);
    }
  };

  const convertToIST = (utcDateString) => {
    const date = new Date(utcDateString);
    return new Intl.DateTimeFormat("en-IN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
       
        timeZone: "Asia/Kolkata",  // Converts to IST
    }).format(date);
  };

  const formatDateForFilter = (utcDateString) => {
    const date = new Date(utcDateString);
    date.setHours(date.getHours() + 5, date.getMinutes() + 30); // Manually shift to IST
    return date.toISOString().split("T")[0]; // Return YYYY-MM-DD format
};


  
  const generatePDF = async () => {
    const pdf = new jsPDF("l", "mm", "a4"); // Landscape mode for width
    const bills = document.querySelectorAll(".bill-card"); // Select all bill elements
  
    const imgWidth = 120; // Adjusted for two bills side by side
    const imgHeight = 200; // Height of the bill (adjust as needed)
    const marginX = 10; // Margin from left
    const marginY = 10; // Margin from top
    let x = marginX;
    let y = marginY;
  
    for (let i = 0; i < bills.length; i++) {
      const bill = bills[i];
  
      // Convert bill to image
      const canvas = await html2canvas(bill, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
  
      // Add the bill image to the PDF
      pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
  
      // Move to the right for second bill
      if (x === marginX) {
        x += imgWidth + 10; // Move right for the second bill
      } else {
        x = marginX; // Reset x position
        y += imgHeight + 10; // Move to the next row
  
        // If two bills are placed, add new page and reset positions
        if (i < bills.length - 1) {
          pdf.addPage();
          y = marginY; // Reset y for new page
        }
      }
    }
  
    pdf.save(`Billing_Report_${selectedDate}.pdf`);
  };
  
  //price logic
  const [localPrices, setLocalPrices] = useState({});

  useEffect(() => {
    setLocalPrices(
      Object.fromEntries(
        Object.entries(fruits).map(([id, fruit]) => [id, { priceKg: fruit.priceKg, pricePiece: fruit.pricePiece }])
      )
    );
  }, [fruits]);

  const handleChange = (id, field, value) => {
    setLocalPrices((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSave = () => {
    Object.entries(localPrices).forEach(([id, prices]) => {
      updateFruitPrice(id, prices.priceKg, prices.pricePiece);
    });
    alert("Prices Saved")
    setModalOpen(false);
  };

  

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen bg-white shadow-md rounded-lg ">
      <h2 className="text-2xl font-bold mb-8">Billing System</h2>
      
      <div className="mb-4 flex items-center space-x-4">
        <label className="font-semibold">Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchOrders}
          className="border bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          Fetch Bills
        </button>
      </div>

     {/* Edit Prices Modal */}
      <button
        onClick={() => setModalOpen(true)}
        className="border ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Edit Prices
      </button>

      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="bg-white p-10 rounded-lg shadow-lg max-w-md mx-auto mt-20 max-h-[80vh] overflow-y-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-xxl font-bold mb-4 text-center">Edit Prices</h2>

        {Object.keys(fruits).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(fruits).map(([id, fruit]) => (
              <div key={id} className="flex flex-col space-y-2">
                <label className="text-lg font-semibold">{fruit.name}:</label>
                <div>
                <span className="p-3">Kg</span>  
                <input
                  type="number"
                  value={localPrices[id]?.priceKg || ""}
                  onChange={(e) => handleChange(id, "priceKg", Number(e.target.value))}
                  placeholder="Price per Kg"
                  className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
                  />
                  </div>
                  <div>
                  <span className="p-3">Pc</span>
                <input
                  type="number"
                  value={localPrices[id]?.pricePiece || ""}
                  onChange={(e) => handleChange(id, "pricePiece", Number(e.target.value))}
                  placeholder="Price per Pc"
                  className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
                  />
                  </div>
              </div>
            ))}

            <div className="flex justify-end space-x-2">
              <button
                onClick={handleSave}
                className="border px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
              >
                Save
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="border px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading fruits...</p>
        )}
      </Modal>
      {loading && <p className="text-center text-gray-600">Loading orders...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}


      {/* Billing Cards */}
      <h2>Shop-wise Bills</h2>
      <div className="bill-container" ref={pdfRef} style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "20px" }}>
        {orders.length > 0 ? (
          orders.map((order) => {
            const shopName = shops[order.shop]?.name || "Unknown Shop";
            let grandTotal =0;
            return (
              <div className="bill-card"
                key={order._id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "10px",
                  width: "300px",
                  boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
                }}
              >
                <h3 style={{ textAlign: "center" }}>MALABAR FRUITS</h3>
                <h6 style={{ textAlign: "right" }}>9941333140</h6>
                <h4>Shop: {shopName}</h4>
                <p><strong>Order Date:</strong> {convertToIST(order.orderDate)}</p>
                <h5>Items:</h5>
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #000" }}>
                    <th style={{ textAlign: "left", padding: "5px" }}>Fruit</th>
                    <th style={{ textAlign: "center", padding: "5px" }}>Quantity</th>
                    <th style={{ textAlign: "right", padding: "5px" }}>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map(({ fruit, quantityKg, quantityPiece, total, _id }) => {
                    const fruitDetails = fruits[fruit] || { name: "Unknown Fruit" };
                    let quantity =quantityKg+quantityPiece;
                    let type="Pc"
                    if(quantityKg!=0){
                      type = "Kg"
                    }
                    grandTotal+= total;
                    return (
                      <tr key={_id} style={{ borderBottom: "1px solid #ddd" }}>
                        <td style={{ padding: "5px" }}>{fruitDetails.name}</td>
                        <td style={{ textAlign: "center", padding: "5px" }}>{quantity} {type}</td>
                        <td style={{ textAlign: "right", padding: "5px"}}>₹{total}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tr style={{ fontWeight: "bold", borderTop: "2px solid #000" }}>
                  <td style={{ padding: "5px" }}>Total</td>
                  <td></td>
                  <td style={{ textAlign: "right", padding: "5px" }}>
                    ₹{grandTotal}
                  </td>
                </tr>
                </table>
              </div>
            );
          })
        ) : (
          <p>No orders found for this date.</p>
        )}
      </div>

      {/* Generate PDF Button */}
      <div className="py-8  ml-2">
        {orders.length > 0 && (
          <button className=" border bg-green-700 text-white px-5 py-2 rounded hover:bg-green-900 transition"
          onClick={generatePDF}>
            Generate Bill (PDF)
          </button>
        )}
      </div>
    </div>
  );
};

export default Billing;
