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

  // const convertToFJT = (utcDateString) => {
  //   const date = new Date(utcDateString);
  //   date.setHours(date.getHours() + 12);
  //   return new Intl.DateTimeFormat("en-GB", {
  //     year: "numeric",
  //     month: "2-digit",
  //     day: "2-digit",
  //     hour12: true,
  //     timeZone: "Pacific/Fiji",
  //   }).format(date);
  // };

  // Function to generate PDF
  // const generatePDF = () => {
  //   const input = pdfRef.current; // Reference to the billing cards section
  //   html2canvas(input, { scale: 2 }).then((canvas) => {
  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF("p", "mm", "a4");
  //     const imgWidth = 190;
  //     const imgHeight = (canvas.height * imgWidth) / canvas.width;
  //     pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
  //     pdf.save(`Billing_Report_${selectedDate}.pdf`);
  //   });
  // };
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
    <div style={{ padding: "20px" }}>
      <h2>Billing System</h2>

      {/* Date Selector */}
      <label><strong>Select Date:</strong></label>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        style={{ marginLeft: "10px", padding: "5px" }}
      />
      <button onClick={fetchOrders} style={{ marginLeft: "10px" }}>Fetch Bills</button>

            {/* Edit Prices Modal */}
            <button onClick={() => setModalOpen(true)} style={{ marginLeft: "10px" }}>Edit Prices</button>
      <Modal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)}>
        <h2>Edit Prices</h2>
        {Object.keys(fruits).length > 0 ? (
          <>
            {Object.entries(fruits).map(([id, fruit]) => (
              <div key={id}>
                <label>{fruit.name}: </label>
                <input
                  type="number"
                  value={localPrices[id]?.priceKg || ""}
                  onChange={(e) => handleChange(id, "priceKg", Number(e.target.value))}
                  placeholder="Price per Kg"
                />
                <input
                  type="number"
                  value={localPrices[id]?.pricePiece || ""}
                  onChange={(e) => handleChange(id, "pricePiece", Number(e.target.value))}
                  placeholder="Price per Pc"
                />
              </div>
            ))}
            <button onClick={handleSave}>Save</button>
          </>
        ) : (
          <p>Loading fruits...</p>
        )}
        <button onClick={() => setModalOpen(false)}>Close</button>
      </Modal>

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
                <h6 style={{ textAlign: "right" }}>6374633152</h6>
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
      {orders.length > 0 && (
        <button onClick={generatePDF} style={{ marginTop: "20px", padding: "10px 20px", backgroundColor: "green", color: "white", border: "none", cursor: "pointer" }}>
          Generate Bill (PDF)
        </button>
      )}
    </div>
  );
};

export default Billing;
