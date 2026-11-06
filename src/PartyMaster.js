
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

const today = () => {
    const d = new Date();
    const local = new Date(
        d.getTime() - d.getTimezoneOffset() * 60000
    );
    return local.toISOString().split("T")[0];
};

const emptyInvoice = () => ({
    name: "",
    email: "",
    mobile_no: "",
    address: "",
    shipping_add: "",
    gstin_uin: "",
    invoice_date: today()
});

// =========================================
// HELPER FUNCTIONS
// =========================================

const money = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

const itemCalculation = (item) => {
    const qty = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;
    const discount = Number(item.discount) || 0;

    const subtotal = qty * rate;
    const taxable = Math.max(0, subtotal - discount);

    const cgst =
        taxable * (Number(item.cgst_rate) || 0) / 100;

    const sgst =
        taxable * (Number(item.sgst_rate) || 0) / 100;

    return {
        subtotal,
        taxable,
        cgst,
        sgst,
        total: taxable + cgst + sgst
    };
};

const invoiceCalculation = (items) => {
    return items.reduce(
        (total, item) => {
            const calc = itemCalculation(item);

            total.subtotal += calc.subtotal;
            total.discount += Number(item.discount) || 0;
            total.taxable += calc.taxable;
            total.cgst += calc.cgst;
            total.sgst += calc.sgst;
            total.grandTotal += calc.total;

            return total;
        },
        {
            subtotal: 0,
            discount: 0,
            taxable: 0,
            cgst: 0,
            sgst: 0,
            grandTotal: 0
        }
    );
};

const errorMessage = (error) => {
    const data = error.response?.data;

    if (!data) {
        return error.message || "Something went wrong";
    }

    if (typeof data === "string") return data;

    return JSON.stringify(data, null, 2);
};

// =========================================
// MAIN COMPONENT
// =========================================

export default function PartyMaster() {

    // =====================================
    // USER AUTHENTICATION
    // =====================================

    const [user, setUser] = useState(null);
    const [authChecked, setAuthChecked] = useState(false);

    // Read logged-in user from localStorage
    useEffect(() => {
        try {
            const loggedInUser = JSON.parse(
                localStorage.getItem("user")
            );

            if (loggedInUser) {
                setUser(loggedInUser);
            }
        } catch (error) {
            console.error(
                "User Authentication Error:",
                error
            );

            setUser(null);
        } finally {
            setAuthChecked(true);
        }
    }, []);

    // =====================================
    // ABEW STAFF VERIFICATION
    // =====================================

    const isABEWStaff =
        user?.is_abewstaff === true ||
        String(user?.role || "").toLowerCase() === "abewstaff" ||
        String(user?.user_type || "").toLowerCase() === "abewstaff";

    // =====================================
    // APPLICATION STATES
    // =====================================

    const [activeTab, setActiveTab] =
        useState("create-invoice");

    // Party states
    const [parties, setParties] = useState([]);
    const [partyForm, setPartyForm] =
        useState({ ...emptyParty });

    const [partyLoading, setPartyLoading] =
        useState(false);

    // Invoice states
    const [invoiceHeader, setInvoiceHeader] =
        useState(emptyInvoice());

    const [selectedPartyId, setSelectedPartyId] =
        useState("");

    const [items, setItems] = useState([
        { ...emptyItem }
    ]);

    const [invoiceLoading, setInvoiceLoading] =
        useState(false);

    // Invoice list states
    const [invoices, setInvoices] = useState([]);

    const [invoiceListLoading, setInvoiceListLoading] =
        useState(false);

    // =====================================
    // FETCH PARTIES
    // =====================================

    const fetchParties = useCallback(async () => {

        if (!isABEWStaff) return;

        try {
            const response = await api.get("/parties/");

            setParties(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {
            console.error("Party Fetch Error:", error);
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

            setInvoices(
                Array.isArray(response.data)
                    ? response.data
                    : Array.isArray(response.data.results)
                        ? response.data.results
                        : Array.isArray(response.data.invoices)
                            ? response.data.invoices
                            : []
            );

        } catch (error) {
            console.error("Invoice Fetch Error:", error);

        } finally {
            setInvoiceListLoading(false);
        }

    }, [isABEWStaff]);

    // Fetch only after ABEWStaff authentication
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
        const { name, value } = e.target;

        setPartyForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // =====================================
    // SAVE NEW PARTY
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
            const response = await api.post(
                "/parties/",
                partyForm
            );

            alert(
                response.data.message ||
                "Party saved successfully"
            );

            setPartyForm({ ...emptyParty });

            await fetchParties();

        } catch (error) {
            console.error("Party Save Error:", error);

            alert(
                "Party Save Failed:\n" +
                errorMessage(error)
            );

        } finally {
            setPartyLoading(false);
        }
    };

    // =====================================
    // DELETE PARTY
    // =====================================

    const handleDeleteParty = async (id) => {

        if (!isABEWStaff) return;

        if (!window.confirm(
            "Are you sure you want to delete this party?"
        )) {
            return;
        }

        try {
            await api.delete(`/parties/${id}/`);

            alert("Party deleted successfully");

            if (Number(selectedPartyId) === Number(id)) {
                setSelectedPartyId("");
                setInvoiceHeader(emptyInvoice());
            }

            await fetchParties();

        } catch (error) {
            console.error("Party Delete Error:", error);

            alert(
                "Party Delete Failed:\n" +
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
            (p) => String(p.id) === partyId
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

            setInvoiceHeader((prev) => ({
                ...emptyInvoice(),
                invoice_date: prev.invoice_date
            }));
        }
    };

    // =====================================
    // INVOICE HEADER CHANGE
    // =====================================

    const handleInvoiceHeaderChange = (e) => {

        const { name, value } = e.target;

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
            prev.map((item, i) =>
                i === index
                    ? { ...item, [field]: value }
                    : item
            )
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
            prev.filter((_, i) => i !== index)
        );
    };

    // =====================================
    // CREATE TAX INVOICE
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
                alert(
                    `Please enter item name in row ${i + 1}`
                );
                return;
            }

            if (Number(items[i].quantity) <= 0) {
                alert(
                    `Quantity must be greater than zero in row ${i + 1}`
                );
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
                `${invoiceHeader.invoice_date}T00:00:00`
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
                `Invoice created successfully!\nInvoice No: ${
                    invoice.serial_no || "Created"
                }`
            );

            setSelectedPartyId("");

            setInvoiceHeader(emptyInvoice());

            setItems([{ ...emptyItem }]);

            await fetchInvoices();

            setActiveTab("invoices");

        } catch (error) {

            console.error(
                "Invoice Create Error:",
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
    // TOTAL CALCULATION
    // =====================================

    const totals = invoiceCalculation(items);

    // =====================================
    // REFRESH ALL
    // =====================================

    const refreshAll = async () => {

        if (!isABEWStaff) return;

        await Promise.all([
            fetchParties(),
            fetchInvoices()
        ]);
    };

    // =====================================
    // AUTHENTICATION UI
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

    // No logged-in user
    if (!user) {

        return (
            <div className="invoice-app">
                <div className="invoice-container">

                    <h2>Login Required</h2>

                    <p>
                        Please login to access
                        ABEW Tax Invoice Management.
                    </p>

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

    // Logged-in but not ABEWStaff
    if (!isABEWStaff) {

        return (
            <div className="invoice-app">
                <div className="invoice-container">

                    <h2>Access Denied</h2>

                    <p>
                        Only ABEWStaff can access
                        ABEW Tax Invoice Management.
                    </p>

                    <p>
                        Logged in as:{" "}
                        {user.username || user.email || "User"}
                    </p>

                </div>
            </div>
        );
    }

    // =====================================
    // ABEWSTAFF APPLICATION UI
    // =====================================

    return (

        <div className="invoice-app">

            <div className="invoice-container">

                <h2 className="page-title">
                    ABEW Tax Invoice Management
                </h2>

                <p>
                    Welcome,{" "}
                    <strong>
                        {user.username || user.email || "ABEWStaff"}
                    </strong>
                    {" "}(ABEWStaff)
                </p>

                {/* NAVIGATION TABS */}

                <div className="tabs">

                    <button
                        className={`tab-btn ${
                            activeTab === "create-invoice"
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            setActiveTab("create-invoice")
                        }
                    >
                        Create Invoice
                    </button>

                    <button
                        className={`tab-btn ${
                            activeTab === "parties"
                                ? "active"
                                : ""
                        }`}
                        onClick={() => setActiveTab("parties")}
                    >
                        Manage Parties ({parties.length})
                    </button>

                    <button
                        className={`tab-btn ${
                            activeTab === "invoices"
                                ? "active"
                                : ""
                        }`}
                        onClick={() => setActiveTab("invoices")}
                    >
                        Invoice History ({invoices.length})
                    </button>

                    <button
                        className="tab-btn"
                        onClick={() => {
                            window.location.href = "/invoice-search";
                        }}
                    >
                        Search Invoice
                    </button>

                    <button
                        className="tab-btn"
                        onClick={refreshAll}
                    >
                        ↻ Refresh
                    </button>

                </div>

                {/* =====================================
                    TAB 1: CREATE INVOICE
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
                                                {party.name}{" "}
                                                {party.gstin_uin
                                                    ? `(${party.gstin_uin})`
                                                    : ""}
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

                        {/* INVOICE ITEMS */}

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

                                            const calc =
                                                itemCalculation(item);

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
                                style={{ marginTop: "12px" }}
                            >
                                + Add Item
                            </button>

                            {/* TOTALS */}

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

                            <div
                                style={{
                                    marginTop: "20px",
                                    textAlign: "right"
                                }}
                            >

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
                    TAB 2: MANAGE PARTIES
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

                                <div style={{ marginTop: "15px" }}>

                                    <button
                                        type="submit"
                                        className="btn btn-success"
                                        disabled={partyLoading}
                                    >
                                        {partyLoading
                                            ? "Saving..."
                                            : "Save Party"}
                                    </button>

                                </div>

                            </form>

                        </div>

                        {/* SAVED PARTIES */}

                        <div className="panel">

                            <h3>Saved Parties List</h3>

                            {parties.length === 0 ? (

                                <p className="muted">
                                    No parties found.
                                </p>

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

                                            {parties.map((p) => (

                                                <tr key={p.id}>

                                                    <td>{p.id}</td>

                                                    <td>{p.name}</td>

                                                    <td>
                                                        {p.mobilno || "-"}
                                                    </td>

                                                    <td>
                                                        {p.gstin_uin || "-"}
                                                    </td>

                                                    <td>
                                                        {p.address || "-"}
                                                    </td>

                                                    <td>
                                                        <button
                                                            className="btn btn-danger"
                                                            onClick={() =>
                                                                handleDeleteParty(p.id)
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
                    TAB 3: INVOICE HISTORY
                ===================================== */}

                {activeTab === "invoices" && (

                    <div className="panel">

                        <h3>Invoice History</h3>

                        {invoiceListLoading ? (

                            <p>Loading invoices...</p>

                        ) : invoices.length === 0 ? (

                            <p className="muted">
                                No invoices generated yet.
                            </p>

                        ) : (

                            invoices.map((inv) => (

                                <div
                                    key={inv.id}
                                    className="invoice-card"
                                >

                                    <h4>
                                        Invoice No:{" "}
                                        {inv.serial_no || inv.id}
                                    </h4>

                                    <p>
                                        <strong>Party:</strong>{" "}
                                        {inv.name || inv.customer_name}
                                        {" | "}
                                        <strong>Mobile:</strong>{" "}
                                        {inv.mobile_no || "-"}
                                        {" | "}
                                        <strong>GSTIN:</strong>{" "}
                                        {inv.gstin_uin || "-"}
                                    </p>

                                    <p>
                                        <strong>Date:</strong>{" "}
                                        {new Date(
                                            inv.invoice_date
                                        ).toLocaleDateString()}
                                    </p>

                                    <table className="invoice-items">

                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Item Name</th>
                                                <th>HSN</th>
                                                <th>Qty</th>
                                                <th>Rate</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {inv.items &&
                                                inv.items.map((item) => (

                                                    <tr key={item.id}>

                                                        <td>
                                                            {item.item_no}
                                                        </td>

                                                        <td>
                                                            {item.item_name}
                                                        </td>

                                                        <td>
                                                            {item.hsn_code || "-"}
                                                        </td>

                                                        <td>
                                                            {item.quantity}{" "}
                                                            {item.unit}
                                                        </td>

                                                        <td>
                                                            ₹ {money(item.rate)}
                                                        </td>

                                                        <td>
                                                            ₹ {money(
                                                                item.total_amount ??
                                                                item.total_amunt
                                                            )}
                                                        </td>

                                                    </tr>

                                                ))}

                                        </tbody>

                                    </table>

                                </div>

                            ))

                        )}

                    </div>

                )}

            </div>

        </div>

    );
}
