
import React, { useState } from "react";
import "./style.css";

const API_URL =
    process.env.REACT_APP_API_BASE_URL ||
    "https://www.pjkss.com/api";


const newItem = () => ({
    item_name: "",
    hsn_code: "",
    quantity: "1",
    unit: "PCS",
    rate: "0",
    cgst_rate: "9",
    sgst_rate: "9",
    discount: "0"
});


const getLocalDateTime = () => {
    const d = new Date();

    const pad = n => String(n).padStart(2, "0");

    return (
        `${d.getFullYear()}-${pad(d.getMonth() + 1)}-` +
        `${pad(d.getDate())}T${pad(d.getHours())}:` +
        `${pad(d.getMinutes())}`
    );
};


const calculateItem = (item) => {

    const qty = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;
    const discount = Number(item.discount) || 0;

    const taxable = Math.max(0, qty * rate - discount);

    const cgst = taxable * (Number(item.cgst_rate) || 0) / 100;

    const sgst = taxable * (Number(item.sgst_rate) || 0) / 100;

    const total = taxable + cgst + sgst;

    return {
        taxable,
        cgst,
        sgst,
        total
    };
};


const money = value =>
    Number(value || 0).toFixed(2);


function TaxInvoicePage() {

    const [form, setForm] = useState({
        invoice_date: getLocalDateTime(),
        customer_name: "",
        email: "",
        mobile_no: "",
        address: "",
        shipping_add: "",
        gstin_uin: ""
    });

    const [items, setItems] = useState([newItem()]);

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");

    const [createdInvoice, setCreatedInvoice] = useState(null);


    // Customer input handler
    const handleFormChange = (e) => {

        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };


    // Item input handler
    const handleItemChange = (index, e) => {

        const { name, value } = e.target;

        setItems(prev =>
            prev.map((item, i) =>
                i === index
                    ? { ...item, [name]: value }
                    : item
            )
        );
    };


    // Add new item
    const addItem = () => {

        setItems(prev => [
            ...prev,
            newItem()
        ]);
    };


    // Remove item
    const removeItem = (index) => {

        if (items.length === 1) return;

        setItems(prev =>
            prev.filter((_, i) => i !== index)
        );
    };


    // Invoice calculations
    const totals = items.reduce((acc, item) => {

        const result = calculateItem(item);

        acc.taxable += result.taxable;
        acc.cgst += result.cgst;
        acc.sgst += result.sgst;
        acc.grand += result.total;

        return acc;

    }, {
        taxable: 0,
        cgst: 0,
        sgst: 0,
        grand: 0
    });


    // Submit invoice
    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);
        setError("");
        setMessage("");
        setCreatedInvoice(null);

        try {

            const payload = {
                ...form,

                items: items.map(item => ({
                    ...item
                }))
            };

            const response = await fetch(
                `${API_URL}/tax-invoices/`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(payload)
                }
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    JSON.stringify(data.errors || data)
                );
            }

            setCreatedInvoice(data.invoice);

            setMessage(data.message);

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="tax-invoice-page">

            <div className="tax-invoice-header">

                <h2>CREATE TAX INVOICE</h2>

                <p>New Invoice Entry</p>

            </div>


            <form onSubmit={handleSubmit}>

                {/* CUSTOMER DETAILS */}

                <div className="invoice-section">

                    <h3>Customer Details</h3>

                    <div className="invoice-grid">

                        <div>
                            <label>Customer Name *</label>

                            <input
                                type="text"
                                name="customer_name"
                                value={form.customer_name}
                                onChange={handleFormChange}
                                required
                            />
                        </div>


                        <div>
                            <label>Invoice Date & Time</label>

                            <input
                                type="datetime-local"
                                name="invoice_date"
                                value={form.invoice_date}
                                onChange={handleFormChange}
                            />
                        </div>


                        <div>
                            <label>Email</label>

                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleFormChange}
                            />
                        </div>


                        <div>
                            <label>Mobile Number</label>

                            <input
                                type="text"
                                name="mobile_no"
                                value={form.mobile_no}
                                onChange={handleFormChange}
                            />
                        </div>


                        <div>
                            <label>GSTIN / UIN</label>

                            <input
                                type="text"
                                name="gstin_uin"
                                value={form.gstin_uin}
                                onChange={handleFormChange}
                            />
                        </div>


                        <div>
                            <label>Billing Address</label>

                            <input
                                type="text"
                                name="address"
                                value={form.address}
                                onChange={handleFormChange}
                            />
                        </div>


                        <div className="invoice-full">

                            <label>Shipping Address</label>

                            <input
                                type="text"
                                name="shipping_add"
                                value={form.shipping_add}
                                onChange={handleFormChange}
                            />

                        </div>

                    </div>

                </div>


                {/* INVOICE ITEMS */}

                <div className="invoice-section">

                    <div className="invoice-item-heading">

                        <h3>Invoice Items</h3>

                        <button
                            type="button"
                            onClick={addItem}
                            className="add-item-btn"
                        >
                            + Add Item
                        </button>

                    </div>


                    {items.map((item, index) => {

                        const result = calculateItem(item);

                        return (

                            <div
                                className="invoice-item-card"
                                key={index}
                            >

                                <div className="invoice-item-title">

                                    <strong>
                                        Item No. {index + 1}
                                    </strong>

                                    <button
                                        type="button"
                                        className="remove-item-btn"
                                        onClick={() => removeItem(index)}
                                        disabled={items.length === 1}
                                    >
                                        Remove
                                    </button>

                                </div>


                                <div className="invoice-grid">

                                    <div>
                                        <label>Item Name *</label>

                                        <input
                                            name="item_name"
                                            value={item.item_name}
                                            onChange={e => handleItemChange(index, e)}
                                            required
                                        />
                                    </div>


                                    <div>
                                        <label>HSN Code</label>

                                        <input
                                            name="hsn_code"
                                            value={item.hsn_code}
                                            onChange={e => handleItemChange(index, e)}
                                        />
                                    </div>


                                    <div>
                                        <label>Quantity</label>

                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            name="quantity"
                                            value={item.quantity}
                                            onChange={e => handleItemChange(index, e)}
                                            required
                                        />
                                    </div>


                                    <div>
                                        <label>Unit</label>

                                        <input
                                            name="unit"
                                            value={item.unit}
                                            onChange={e => handleItemChange(index, e)}
                                            placeholder="PCS / KG / MTR"
                                        />
                                    </div>


                                    <div>
                                        <label>Rate (₹)</label>

                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            name="rate"
                                            value={item.rate}
                                            onChange={e => handleItemChange(index, e)}
                                            required
                                        />
                                    </div>


                                    <div>
                                        <label>Discount (₹)</label>

                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            name="discount"
                                            value={item.discount}
                                            onChange={e => handleItemChange(index, e)}
                                        />
                                    </div>


                                    <div>
                                        <label>CGST (%)</label>

                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            name="cgst_rate"
                                            value={item.cgst_rate}
                                            onChange={e => handleItemChange(index, e)}
                                        />
                                    </div>


                                    <div>
                                        <label>SGST (%)</label>

                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            name="sgst_rate"
                                            value={item.sgst_rate}
                                            onChange={e => handleItemChange(index, e)}
                                        />
                                    </div>

                                </div>


                                <div className="item-calculation">

                                    <span>
                                        Taxable: ₹{money(result.taxable)}
                                    </span>

                                    <span>
                                        CGST: ₹{money(result.cgst)}
                                    </span>

                                    <span>
                                        SGST: ₹{money(result.sgst)}
                                    </span>

                                    <strong>
                                        Item Total: ₹{money(result.total)}
                                    </strong>

                                </div>

                            </div>

                        );

                    })}

                </div>


                {/* INVOICE SUMMARY */}

                <div className="invoice-summary">

                    <h3>Invoice Summary</h3>

                    <p>
                        Taxable Amount:
                        <strong> ₹{money(totals.taxable)}</strong>
                    </p>

                    <p>
                        Total CGST:
                        <strong> ₹{money(totals.cgst)}</strong>
                    </p>

                    <p>
                        Total SGST:
                        <strong> ₹{money(totals.sgst)}</strong>
                    </p>

                    <h2>
                        Grand Total: ₹{money(totals.grand)}
                    </h2>

                </div>


                {/* SUBMIT */}

                <button
                    type="submit"
                    className="save-invoice-btn"
                    disabled={loading}
                >

                    {loading
                        ? "Saving Invoice..."
                        : "SAVE TAX INVOICE"
                    }

                </button>


                {message && (

                    <div className="invoice-success">
                        {message}

                        <h3>
                            Invoice No: {createdInvoice?.serial_no}
                        </h3>

                    </div>

                )}


                {error && (

                    <div className="invoice-error">
                        Error: {error}
                    </div>

                )}

            </form>

        </div>
    );
}

export default TaxInvoicePage;
