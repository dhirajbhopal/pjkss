import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./style.css";

// =========================================
// API CONFIGURATION
// =========================================

const API_BASE_URL = "https://pjkss.pythonanywhere.com";

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json"
    }
});

// =========================================
// INITIAL DATA
// =========================================

const emptyParty = {
    name: "",
    email: "",
    mobilno: "",
    address: "",
    shipping_add: "",
    gstin_uin: ""
};

const emptyItem = {
    item_name: "",
    hsn_code: "",
    quantity: 1,
    unit: "PCS",
    rate: 0,
    cgst_rate: 9,
    sgst_rate: 9,
    discount: 0
};

const getToday = () => {
    const date = new Date();
    const localDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
    );
    return localDate.toISOString().split("T")[0];
};

const emptyInvoice = () => ({
    name: "",
    email: "",
    mobile_no: "",
    address: "",
    shipping_add: "",
    gstin_uin: "",
    invoice_date: getToday()
});

// =========================================
// HELPER FUNCTIONS
// =========================================

const money = (value) => {
    return Number(value || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

const errorMessage = (error) => {
    const data = error.response && error.response.data;

    if (!data) {
        return error.message || "Something went wrong";
    }

    if (typeof data === "string") {
        return data;
    }

    return JSON.stringify(data);
};

// =========================================
// ITEM CALCULATION
// Discount is a fixed amount per item row
// =========================================

const itemCalculation = (item) => {
    const quantity = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;
    const discount = Number(item.discount) || 0;

    const subtotal = quantity * rate;

    const taxable = Math.max(0, subtotal - discount);

    const cgst =
        taxable * (Number(item.cgst_rate) || 0) / 100;

    const sgst =
        taxable * (Number(item.sgst_rate) || 0) / 100;

    return {
        subtotal: subtotal,
        discount: discount,
        taxable: taxable,
        cgst: cgst,
        sgst: sgst,
        total: taxable + cgst + sgst
    };
};

// =========================================
// INVOICE CALCULATION
// =========================================

const invoiceCalculation = (items) => {
    return items.reduce((total, item) => {
        const calc = itemCalculation(item);

        total.subtotal += calc.subtotal;
        total.discount += calc.discount;
        total.taxable += calc.taxable;
        total.cgst += calc.cgst;
        total.sgst += calc.sgst;
        total.grandTotal += calc.total;

        return total;
    }, {
        subtotal: 0,
        discount: 0,
        taxable: 0,
        cgst: 0,
        sgst: 0,
        grandTotal: 0
    });
};

// =========================================
// MAIN COMPONENT
// =========================================

export default function PartyMaster() {

    // =====================================
    // AUTHENTICATION
    // =====================================

    const [user, setUser] = useState(null);
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        try {
            const savedUser = localStorage.getItem("user");

            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
        } catch (error) {
            console.error("Authentication Error:", error);
            setUser(null);
        } finally {
            setAuthChecked(true);
        }
    }, []);

    const isABEWStaff =
        user?.is_abewstaff === true ||
        String(user?.role || "").toLowerCase() === "abewstaff" ||
        String(user?.user_type || "").toLowerCase() === "abewstaff";

    // =====================================
    // STATES
    // =====================================

    const [activeTab, setActiveTab] = useState("create-invoice");

    const [parties, setParties] = useState([]);
    const [partyForm, setPartyForm] = useState({ ...emptyParty });
    const [partyLoading, setPartyLoading] = useState(false);

    const [invoiceHeader, setInvoiceHeader] = useState(emptyInvoice());
    const [selectedPartyId, setSelectedPartyId] = useState("");
    const [items, setItems] = useState([{ ...emptyItem }]);
    const [invoiceLoading, setInvoiceLoading] = useState(false);

    const [invoices, setInvoices] = useState([]);
    const [invoiceListLoading, setInvoiceListLoading] = useState(false);

    // =====================================
    // FETCH PARTIES
    // =====================================

    const fetchParties = useCallback(async () => {
        if (!isABEWStaff) return;

        try {
            const response = await api.get("/parties/");

            const data = response.data;

            if (Array.isArray(data)) {
                setParties(data);
            } else if (Array.isArray(data.results)) {
                setParties(data.results);
            } else if (Array.isArray(data.parties)) {
                setParties(data.parties);
            } else {
                setParties([]);
            }

        } catch (error) {
            console.error("Fetch Parties Error:", error);
            alert("Unable to load parties: " + errorMessage(error));
        }
    }, [isABEWStaff]);

    // =====================================
    // FETCH INVOICES
    // =====================================

    const fetchInvoices = useCallback(async () => {
        if (!isABEWStaff) return;

        setInvoiceListLoading(true);

        try {
            const response = await api.get("/abewinvoice/");

            const data = response.data;

            if (Array.isArray(data)) {
                setInvoices(data);
            } else if (Array.isArray(data.results)) {
                setInvoices(data.results);
            } else if (Array.isArray(data.invoices)) {
                setInvoices(data.invoices);
            } else {
                setInvoices([]);
            }

        } catch (error) {
            console.error("Fetch Invoices Error:", error);
            alert("Unable to load invoices: " + errorMessage(error));
        } finally {
            setInvoiceListLoading(false);
        }
    }, [isABEWStaff]);

    // =====================================
    // INITIAL DATA LOAD
    // =====================================

    useEffect(() => {
        if (authChecked && isABEWStaff) {
            fetchParties();
            fetchInvoices();
        }
    }, [
        authChecked,
        isABEWStaff,
        fetchParties,
        fetchInvoices
    ]);

    // =====================================
    // PARTY FORM CHANGE
    // =====================================

    const handlePartyChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setPartyForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // =====================================
    // SAVE PARTY
    // =====================================

    const handlePartySubmit = async (e) => {
        e.preventDefault();

        if (!isABEWStaff) return;

        if (!partyForm.name.trim()) {
            alert("Please enter party name");
            return;
        }

        setPartyLoading(true);

        try {
            const response = await api.post("/parties/", partyForm);

            alert(
                response.data.message ||
                "Party saved successfully"
            );

            setPartyForm({ ...emptyParty });

            await fetchParties();

        } catch (error) {
            console.error("Save Party Error:", error);

            alert(
                "Party Save Failed:\n" +
                errorMessage(error)
            );
        } finally {
            setPartyLoading(false);
        }
    };

    // =====================================
    // DELETE PARTY - CORRECTED
    // =====================================

    const handleDeleteParty = async (id) => {

        if (!isABEWStaff) {
            alert("Access denied");
            return;
        }

        if (!id) {
            alert("Party ID is missing");
            return;
        }

        if (!window.confirm(
            "Are you sure you want to delete this party?"
        )) {
            return;
        }

        try {

            console.log("Deleting Party ID:", id);

            const response = await api.delete(
                "/parties/" + id + "/"
            );

            console.log("Delete Response:", response.data);

            alert("Party deleted successfully");

            if (String(selectedPartyId) === String(id)) {
                setSelectedPartyId("");
                setInvoiceHeader(emptyInvoice());
            }

            await fetchParties();

        } catch (error) {

            console.error(
                "Delete Party Error:",
                error.response || error
            );

            const status =
                error.response?.status || "Network Error";

            alert(
                "Delete Failed!\nHTTP Status: " +
                status +
                "\nError: " +
                errorMessage(error)
            );
        }
    };

    // =====================================
    // SELECT PARTY
    // =====================================

    const handlePartySelect = (e) => {
        const partyId = e.target.value;

        setSelectedPartyId(partyId);

        const party = parties.find(
            (p) => String(p.id) === String(partyId)
        );

        if (party) {
            setInvoiceHeader((prev) => ({
                ...prev,
                name: party.name || "",
                email: party.email || "",
                mobile_no: party.mobilno || "",
                address: party.address || "",
                shipping_add: party.shipping_add || "",
                gstin_uin: party.gstin_uin || ""
            }));
        } else {
            setInvoiceHeader(emptyInvoice());
        }
    };

    // =====================================
    // INVOICE HEADER CHANGE
    // =====================================

    const handleInvoiceHeaderChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setInvoiceHeader((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // =====================================
    // ITEM CHANGE
    // =====================================

    const handleItemChange = (index, field, value) => {
        setItems((prev) =>
            prev.map((item, i) => {
                if (i === index) {
                    return {
                        ...item,
                        [field]: value
                    };
                }
                return item;
            })
        );
    };

    // =====================================
    // ADD ITEM
    // =====================================

    const addItemRow = () => {
        setItems((prev) => [
            ...prev,
            { ...emptyItem }
        ]);
    };

    // =====================================
    // REMOVE ITEM
    // =====================================

    const removeItemRow = (index) => {
        if (items.length === 1) {
            alert("At least one item is required");
            return;
        }

        setItems((prev) =>
            prev.filter((item, i) => i !== index)
        );
    };

    // =====================================
    // CREATE INVOICE
    // =====================================

    const handleInvoiceSubmit = async (e) => {
        e.preventDefault();

        if (!isABEWStaff) return;

        if (!selectedPartyId) {
            alert("Please select a party");
            return;
        }

        if (!invoiceHeader.name.trim()) {
            alert("Party name is required");
            return;
        }

        for (let i = 0; i < items.length; i++) {

            if (!items[i].item_name.trim()) {
                alert("Please enter item name in row " + (i + 1));
                return;
            }

            if (Number(items[i].quantity) <= 0) {
                alert("Quantity must be greater than zero in row " + (i + 1));
                return;
            }

            const itemAmount =
                Number(items[i].quantity) * Number(items[i].rate);

            if (Number(items[i].discount) > itemAmount) {
                alert("Discount cannot exceed item amount in row " + (i + 1));
                return;
            }
        }

        const payload = {
            name: invoiceHeader.name,
            email: invoiceHeader.email || null,
            mobile_no: invoiceHeader.mobile_no || null,
            address: invoiceHeader.address || null,
            shipping_add: invoiceHeader.shipping_add || null,
            gstin_uin: invoiceHeader.gstin_uin || null,

            invoice_date: new Date(
                invoiceHeader.invoice_date + "T00:00:00"
            ).toISOString(),

            items: items.map((item) => ({
                item_name: item.item_name,
                hsn_code: item.hsn_code || null,
                quantity: Number(item.quantity),
                unit: item.unit || null,
                rate: Number(item.rate),
                cgst_rate: Number(item.cgst_rate),
                sgst_rate: Number(item.sgst_rate),
                discount: Number(item.discount)
            }))
        };

        setInvoiceLoading(true);

        try {

            const response = await api.post(
                "/abewinvoice/",
                payload
            );

            const invoice =
                response.data.invoice || response.data;

            alert(
                "Invoice created successfully!\nInvoice No: " +
                (invoice.serial_no || "Created")
            );

            setSelectedPartyId("");
            setInvoiceHeader(emptyInvoice());
            setItems([{ ...emptyItem }]);

            await fetchInvoices();

            setActiveTab("invoices");

        } catch (error) {

            console.error(
                "Invoice Creation Error:",
                error.response?.data || error
            );

            alert(
                "Invoice Creation Failed:\n" +
                errorMessage(error)
            );

        } finally {
            setInvoiceLoading(false);
        }
    };

    // =====================================
    // DIRECT PRINT
    // =====================================

    const handleDirectPrint = (serialNo) => {

        if (!serialNo) {
            alert("Invoice serial number is missing");
            return;
        }

        const printUrl =
            "/invoice-print?serial_no=" +
            encodeURIComponent(serialNo);

        window.open(printUrl, "_blank");
    };

    // =====================================
    // TOTALS
    // =====================================

    const totals = invoiceCalculation(items);

    // =====================================
    // REFRESH
    // =====================================

    const refreshAll = async () => {
        await Promise.all([
            fetchParties(),
            fetchInvoices()
        ]);
    };

    // =====================================
    // AUTHENTICATION CHECK
    // =====================================

    if (!authChecked) {
        return (
            <div className="invoice-app">
                <div className="invoice-container">
                    <h2>Checking Authentication...</h2>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="invoice-app">
                <div className="invoice-container">
                    <h2>Login Required</h2>
                    <p>Please login to access Ajay Bijay Electrical Works Invoice Management.</p>

                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            window.location.href = "/login";
                        }}
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    if (!isABEWStaff) {
        return (
            <div className="invoice-app">
                <div className="invoice-container">
                    <h2>Access Denied</h2>
                    <p>Only ABEWStaff can access this application.</p>
                </div>
            </div>
        );
    }

    // =====================================
    // MAIN UI
    // =====================================

    return (
        <div className="invoice-app">

            <div className="invoice-container">

                <h2 className="page-title">
                    Ajay Bijay Electrical Works Tax Invoice Management
                </h2>

                <p>
                    Welcome,{" "}
                    <strong>
                        {user.username || user.email || "ABEWStaff"}
                    </strong>
                </p>

                {/* NAVIGATION */}

                <div className="tabs">

                    <button
                        className={
                            activeTab === "create-invoice"
                                ? "tab-btn active"
                                : "tab-btn"
                        }
                        onClick={() => setActiveTab("create-invoice")}
                    >
                        Create Invoice
                    </button>

                    <button
                        className={
                            activeTab === "parties"
                                ? "tab-btn active"
                                : "tab-btn"
                        }
                        onClick={() => setActiveTab("parties")}
                    >
                        Manage Parties ({parties.length})
                    </button>

                    <button
                        className={
                            activeTab === "invoices"
                                ? "tab-btn active"
                                : "tab-btn"
                        }
                        onClick={() => setActiveTab("invoices")}
                    >
                        Show All Invoice ({invoices.length})
                    </button>

                    <button
                        className="tab-btn"
                        onClick={() => {
                            window.location.href = "/invoice-search";
                        }}
                    >
                        Search Invoice No.
                    </button>

                    <button
                        className="tab-btn"
                        onClick={refreshAll}
                    >
                        Refresh
                    </button>

                </div>

                {/* =====================================
                    CREATE INVOICE TAB
                ===================================== */}

                {activeTab === "create-invoice" && (

                    <form onSubmit={handleInvoiceSubmit}>

                        <div className="panel">

                            <h3>Invoice Details</h3>

                            <div className="form-grid">

                                <div className="form-group">
                                    <label>Select Party *</label>

                                    <select
                                        value={selectedPartyId}
                                        onChange={handlePartySelect}
                                        required
                                    >
                                        <option value="">
                                            -- Select Party --
                                        </option>

                                        {parties.map((party) => (
                                            <option
                                                key={party.id}
                                                value={party.id}
                                            >
                                                {party.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Invoice Date *</label>

                                    <input
                                        type="date"
                                        name="invoice_date"
                                        value={invoiceHeader.invoice_date}
                                        onChange={handleInvoiceHeaderChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Party Name</label>
                                    <input
                                        value={invoiceHeader.name}
                                        readOnly
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        value={invoiceHeader.email}
                                        readOnly
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Mobile Number</label>
                                    <input
                                        value={invoiceHeader.mobile_no}
                                        readOnly
                                    />
                                </div>

                                <div className="form-group">
                                    <label>GSTIN / UIN</label>
                                    <input
                                        value={invoiceHeader.gstin_uin}
                                        readOnly
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Billing Address</label>
                                    <textarea
                                        value={invoiceHeader.address}
                                        readOnly
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Shipping Address</label>
                                    <textarea
                                        value={invoiceHeader.shipping_add}
                                        readOnly
                                    />
                                </div>

                            </div>
                        </div>

                        {/* ITEMS TABLE */}

                        <div className="panel">

                            <h3>Invoice Items</h3>

                            <div className="table-wrap">

                                <table className="data-table">

                                    <thead>
                                        <tr>
                                            <th>Item Name</th>
                                            <th>HSN Code</th>
                                            <th>Qty</th>
                                            <th>Unit</th>
                                            <th>Rate (₹)</th>
                                            <th>Discount (₹)</th>
                                            <th>CGST %</th>
                                            <th>SGST %</th>
                                            <th>Total (₹)</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {items.map((item, index) => {

                                            const calc = itemCalculation(item);

                                            return (
                                                <tr key={index}>

                                                    <td>
                                                        <input
                                                            type="text"
                                                            value={item.item_name}
                                                            onChange={(e) =>
                                                                handleItemChange(
                                                                    index,
                                                                    "item_name",
                                                                    e.target.value
                                                                )
                                                            }
                                                            required
                                                        />
                                                    </td>

                                                    <td>
                                                        <input
                                                            type="text"
                                                            value={item.hsn_code}
                                                            onChange={(e) =>
                                                                handleItemChange(
                                                                    index,
                                                                    "hsn_code",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </td>

                                                    <td>
                                                        <input
                                                            type="number"
                                                            min="0.01"
                                                            step="0.01"
                                                            value={item.quantity}
                                                            onChange={(e) =>
                                                                handleItemChange(
                                                                    index,
                                                                    "quantity",
                                                                    e.target.value
                                                                )
                                                            }
                                                            required
                                                        />
                                                    </td>

                                                    <td>
                                                        <input
                                                            type="text"
                                                            value={item.unit}
                                                            onChange={(e) =>
                                                                handleItemChange(
                                                                    index,
                                                                    "unit",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </td>

                                                    <td>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            value={item.rate}
                                                            onChange={(e) =>
                                                                handleItemChange(
                                                                    index,
                                                                    "rate",
                                                                    e.target.value
                                                                )
                                                            }
                                                            required
                                                        />
                                                    </td>

                                                    <td>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            value={item.discount}
                                                            onChange={(e) =>
                                                                handleItemChange(
                                                                    index,
                                                                    "discount",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </td>

                                                    <td>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            value={item.cgst_rate}
                                                            onChange={(e) =>
                                                                handleItemChange(
                                                                    index,
                                                                    "cgst_rate",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </td>

                                                    <td>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            value={item.sgst_rate}
                                                            onChange={(e) =>
                                                                handleItemChange(
                                                                    index,
                                                                    "sgst_rate",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </td>

                                                    <td>
                                                        <strong>
                                                            {money(calc.total)}
                                                        </strong>
                                                    </td>

                                                    <td>
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger"
                                                            onClick={() =>
                                                                removeItemRow(index)
                                                            }
                                                        >
                                                            X
                                                        </button>
                                                    </td>

                                                </tr>
                                            );
                                        })}

                                    </tbody>

                                </table>
                            </div>

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={addItemRow}
                            >
                                + Add Item
                            </button>

                            {/* TOTAL SUMMARY */}

                            <div className="total-box">

                                <div className="total-row">
                                    <span>Subtotal:</span>
                                    <span>₹ {money(totals.subtotal)}</span>
                                </div>

                                <div className="total-row">
                                    <span>Discount:</span>
                                    <span>₹ {money(totals.discount)}</span>
                                </div>

                                <div className="total-row">
                                    <span>Taxable Amount:</span>
                                    <span>₹ {money(totals.taxable)}</span>
                                </div>

                                <div className="total-row">
                                    <span>Total CGST:</span>
                                    <span>₹ {money(totals.cgst)}</span>
                                </div>

                                <div className="total-row">
                                    <span>Total SGST:</span>
                                    <span>₹ {money(totals.sgst)}</span>
                                </div>

                                <div className="total-row grand-total">
                                    <span>Grand Total:</span>
                                    <span>₹ {money(totals.grandTotal)}</span>
                                </div>

                            </div>

                            <div style={{ marginTop: "20px", textAlign: "right" }}>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={invoiceLoading}
                                >
                                    {invoiceLoading
                                        ? "Saving Invoice..."
                                        : "Save & Generate Invoice"}
                                </button>
                            </div>

                        </div>

                    </form>
                )}

                {/* =====================================
                    MANAGE PARTIES TAB
                ===================================== */}

                {activeTab === "parties" && (

                    <div>

                        <div className="panel">

                            <h3>Add New Party</h3>

                            <form onSubmit={handlePartySubmit}>

                                <div className="form-grid">

                                    <div className="form-group">
                                        <label>Party Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={partyForm.name}
                                            onChange={handlePartyChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={partyForm.email}
                                            onChange={handlePartyChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Mobile Number</label>
                                        <input
                                            type="text"
                                            name="mobilno"
                                            value={partyForm.mobilno}
                                            onChange={handlePartyChange}
                                            maxLength="12"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>GSTIN / UIN</label>
                                        <input
                                            type="text"
                                            name="gstin_uin"
                                            value={partyForm.gstin_uin}
                                            onChange={handlePartyChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Billing Address</label>
                                        <textarea
                                            name="address"
                                            value={partyForm.address}
                                            onChange={handlePartyChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Shipping Address</label>
                                        <textarea
                                            name="shipping_add"
                                            value={partyForm.shipping_add}
                                            onChange={handlePartyChange}
                                        />
                                    </div>

                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-success"
                                    disabled={partyLoading}
                                >
                                    {partyLoading ? "Saving..." : "Save Party"}
                                </button>

                            </form>
                        </div>

                        {/* PARTY LIST */}

                        <div className="panel">

                            <h3>Saved Parties List</h3>

                            {parties.length === 0 ? (
                                <p>No parties found.</p>
                            ) : (

                                <div className="table-wrap">

                                    <table className="data-table">

                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Mobile</th>
                                                <th>GSTIN</th>
                                                <th>Address</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {parties.map((party) => (
                                                <tr key={party.id}>

                                                    <td>{party.id}</td>
                                                    <td>{party.name}</td>
                                                    <td>{party.mobilno || "-"}</td>
                                                    <td>{party.gstin_uin || "-"}</td>
                                                    <td>{party.address || "-"}</td>

                                                    <td>
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger"
                                                            onClick={() =>
                                                                handleDeleteParty(party.id)
                                                            }
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>

                                                </tr>
                                            ))}

                                        </tbody>

                                    </table>

                                </div>
                            )}

                        </div>

                    </div>
                )}

                {/* =====================================
                    INVOICE HISTORY TAB
                ===================================== */}

                {activeTab === "invoices" && (

                    <div className="panel">

                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "10px"
                        }}>

                            <h3>Invoice History</h3>

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={fetchInvoices}
                                disabled={invoiceListLoading}
                            >
                                {invoiceListLoading ? "Loading..." : "Refresh"}
                            </button>

                        </div>

                        {invoiceListLoading ? (
                            <p>Loading invoices...</p>
                        ) : invoices.length === 0 ? (
                            <p>No invoices generated yet.</p>
                        ) : (

                            invoices.map((inv) => (

                                <div
                                    key={inv.id}
                                    className="invoice-card"
                                >

                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                        gap: "10px"
                                    }}>

                                        <h4>
                                            Invoice No:{" "}
                                            {inv.serial_no || inv.id}
                                        </h4>

                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            disabled={!inv.serial_no}
                                            onClick={() =>
                                                handleDirectPrint(inv.serial_no)
                                            }
                                        >
                                            <i class="fa-solid fa-eye"></i> View
                                        </button>

                                    </div>

                                    <p>
                                        <strong>Party:</strong>{" "}
                                        {inv.name || inv.customer_name || "-"}
                                    </p>

                                    <p>
                                        <strong>Mobile:</strong>{" "}
                                        {inv.mobile_no || "-"}
                                    </p>

                                    <p>
                                        <strong>GSTIN:</strong>{" "}
                                        {inv.gstin_uin || "-"}
                                    </p>

                                    <p>
                                        <strong>Date:</strong>{" "}
                                        {inv.invoice_date
                                            ? new Date(
                                                inv.invoice_date
                                            ).toLocaleDateString("en-IN")
                                            : "-"}
                                    </p>

                                    <div className="table-wrap">

                                        <table className="invoice-items">

                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Item Name</th>
                                                    <th>HSN</th>
                                                    <th>Qty</th>
                                                    <th>Rate</th>
                                                    <th>Discount</th>
                                                    <th>Total</th>
                                                </tr>
                                            </thead>

                                            <tbody>

                                                {(inv.items || []).map(
                                                    (item, index) => (
                                                        <tr key={item.id || index}>

                                                            <td>
                                                                {item.item_no || index + 1}
                                                            </td>

                                                            <td>
                                                                {item.item_name}
                                                            </td>

                                                            <td>
                                                                {item.hsn_code || "-"}
                                                            </td>

                                                            <td>
                                                                {item.quantity}{" "}
                                                                {item.unit || ""}
                                                            </td>

                                                            <td>
                                                                ₹ {money(item.rate)}
                                                            </td>

                                                            <td>
                                                                ₹ {money(item.discount)}
                                                            </td>

                                                            <td>
                                                                ₹ {money(
                                                                    item.total_amount ??
                                                                    item.total_amunt
                                                                )}
                                                            </td>

                                                        </tr>
                                                    )
                                                )}

                                            </tbody>

                                        </table>

                                    </div>

                                </div>

                            ))
                        )}

                    </div>
                )}

            </div>
        </div>
    );
}