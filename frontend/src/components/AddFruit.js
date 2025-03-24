import React, {useState} from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

const AddFruit = ()=>{

    const [fruitName, setFruitName] = useState("");

    const handleSubmit = async (e)=>{

        e.preventDefault();
        if(!fruitName.trim()){
            alert("cant be empty")
        }
        try{
            const {data} = await axios.post(`${API_URL}/fruits`, {name: fruitName})
            console.log(data)
            alert(`Fruit "${data.name}" added successfully`);
            setFruitName("");
        }
        catch(error){
            console.error("Error adding fruit:", error);
            alert("Error adding fruit. Please try again.");
        }

    };

    return (
        <div>
            <h2>Add a New Fruit</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={fruitName}
                    onChange={(e) => setFruitName(e.target.value)}
                    placeholder="Enter fruit name"
                    required
                />
                <button type="submit">Add Fruit</button>
            </form>
        </div>
    )
}
export default AddFruit