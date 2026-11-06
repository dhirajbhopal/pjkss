
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";

// =========================================
// API CONFIGURATION
// =========================================

const API_BASE_URL = "https://pjkss.pythonanywhere.com";

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000
});

// =========================================
// HELPER FUNCTIONS
// =========================================

const money = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

const getInvoices = (data) =>
    Array.isArray(data)
        ? data
        : (data?.results || data?.invoices || []);

const amountInWords = (amount) => {
    const n = Math.round(Number(amount || 0));

    if (n === 0) return "Zero Rupees Only";

    const ones = [
        "", "One", "Two", "Three", "Four",
        "Five", "Six", "Seven", "Eight", "Nine",
        "Ten", "Eleven", "Twelve", "Thirteen",
        "Fourteen", "Fifteen", "Sixteen",
        "Seventeen", "Eighteen", "Nineteen"
    ];

    const tens = [
        "", "", "Twenty", "Thirty", "Forty",
        "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
    ];

    const under100 = (num) =>
        num < 20
            ? ones[num]
            : tens[Math.floor(num / 10)] +
              (num % 10 ? " " + ones[num % 10] : "");

    const under1000 = (num) =>
        (num >= 100
            ? ones[Math.floor(num / 100)] + " Hundred "
            : "") +
        (num % 100 ? under100(num % 100) : "");

    let result = "";
    let remaining = n;

    const parts = [
        [10000000, "Crore"],
        [100000, "Lakh"],
        [1000, "Thousand"],
        [100, "Hundred"]
    ];

    parts.forEach(([value, label]) => {
        if (remaining >= value) {
            const count = Math.floor(remaining / value);

            result += (
                value === 100
                    ? under1000(count)
                    : under100(count)
            ) + " " + label + " ";

            remaining %= value;
        }
    });

    if (remaining) {
        result += under100(remaining);
    }

    return result.trim() + " Rupees Only";
};

// =========================================
// DATE FORMAT
// =========================================

const dateFormat = (date) => {
    if (!date) return "";

    const d = new Date(date);

    if (isNaN(d.getTime())) return "";

    return d.toLocaleDateString("en-GB");
};

// =========================================
// ITEM CALCULATION
// =========================================

const calculateItem = (item) => {
    const qty = Number(item.quantity || 0);
    const rate = Number(item.rate || 0);
    const discount = Number(item.discount || 0);

    const taxable = Math.max(0, qty * rate - discount);

    const cgstRate = Number(item.cgst_rate || 0);
    const sgstRate = Number(item.sgst_rate || 0);

    const cgst = taxable * cgstRate / 100;
    const sgst = taxable * sgstRate / 100;

    return {
        taxable,
        cgst,
        sgst,
        cgstRate,
        sgstRate,
        total: taxable + cgst + sgst
    };
};

// =========================================
// MAIN COMPONENT
// =========================================

export default function InvoicePrint() {

    // =====================================
    // USER AUTHENTICATION
    // =====================================

    const [user, setUser] = useState(null);
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        try {
            const loggedInUser = JSON.parse(
                localStorage.getItem("user")
            );

            if (loggedInUser) {
                setUser(loggedInUser);
            }
        } catch (error) {
            console.error("Authentication Error:", error);
            setUser(null);
        } finally {
            setAuthChecked(true);
        }
    }, []);

    // =====================================
    // ABEW STAFF CHECK
    // =====================================

    const isABEWStaff =
        user?.is_abewstaff === true ||
        String(user?.role || "").toLowerCase() === "abewstaff" ||
        String(user?.user_type || "").toLowerCase() === "abewstaff";

    // =====================================
    // INVOICE STATES
    // =====================================

    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================
    // FETCH INVOICE
    // =====================================

    useEffect(() => {

        if (!authChecked || !isABEWStaff) {
            return;
        }

        const fetchInvoice = async () => {

            try {

                const params = new URLSearchParams(
                    window.location.search
                );

                const serialNo = params.get("serial_no");

                if (!serialNo) {
                    setError("Invoice Number is missing");
                    return;
                }

                const response = await api.get("/abewinvoice/");

                const invoices = getInvoices(response.data);

                const found = invoices.find(inv =>
                    String(inv.serial_no || "")
                        .trim()
                        .toLowerCase() ===
                    serialNo.trim().toLowerCase()
                );

                if (!found) {
                    setError("Invoice not found");
                    return;
                }

                setInvoice(found);

            } catch (err) {

                console.error(
                    "Invoice Fetch Error:",
                    err.response?.data || err
                );

                setError(
                    err.response?.data?.detail ||
                    "Unable to load invoice details"
                );

            } finally {
                setLoading(false);
            }
        };

        fetchInvoice();

    }, [authChecked, isABEWStaff]);

    // =====================================
    // AUTHENTICATION CHECK
    // =====================================

    if (!authChecked) {
        return (
            <div style={authStyle}>
                <h2>Checking Authentication...</h2>
            </div>
        );
    }

    // =====================================
    // NOT LOGGED IN
    // =====================================

    if (!user) {
        return (
            <div style={authStyle}>
                <h2>Login Required</h2>

                <p>Please login to access Invoice Print.</p>

                <button
                    onClick={() => {
                        window.location.href = "/login";
                    }}
                >
                    Go to Login
                </button>
            </div>
        );
    }

    // =====================================
    // NON ABEWSTAFF USER
    // =====================================

    if (!isABEWStaff) {
        return (
            <div style={authStyle}>
                <h2 style={{ color: "red" }}>
                    Access Denied
                </h2>

                <p>
                    Only ABEWStaff can access Invoice Print.
                </p>

                <button
                    onClick={() => window.history.back()}
                >
                    Go Back
                </button>
            </div>
        );
    }

    // =====================================
    // LOADING / ERROR
    // =====================================

    if (loading) {
        return (
            <h3 style={{ textAlign: "center" }}>
                Loading Invoice...
            </h3>
        );
    }

    if (error) {
        return (
            <h3 style={{
                textAlign: "center",
                color: "red"
            }}>
                {error}
            </h3>
        );
    }

    if (!invoice) return null;

    // =====================================
    // INVOICE ITEMS & TOTALS
    // =====================================

    const items = invoice.items || [];

    const totals = items.reduce(
        (acc, item) => {

            const calc = calculateItem(item);

            acc.taxable += calc.taxable;
            acc.cgst += calc.cgst;
            acc.sgst += calc.sgst;
            acc.total += calc.total;

            return acc;
        },
        {
            taxable: 0,
            cgst: 0,
            sgst: 0,
            total: 0
        }
    );

    // =====================================
    // GST RATE LABELS
    // =====================================

    const uniqueCgstRates = [
        ...new Set(
            items.map(item =>
                Number(item.cgst_rate || 0)
            )
        )
    ];

    const uniqueSgstRates = [
        ...new Set(
            items.map(item =>
                Number(item.sgst_rate || 0)
            )
        )
    ];

    const cgstLabel = uniqueCgstRates.length === 1
        ? `CGST (${uniqueCgstRates[0]}%)`
        : "CGST (Multiple Rates)";

    const sgstLabel = uniqueSgstRates.length === 1
        ? `SGST (${uniqueSgstRates[0]}%)`
        : "SGST (Multiple Rates)";

    // =====================================
    // RENDER
    // =====================================

    return (

        <div className="print-page">

            <div className="print-actions">

                <button onClick={() => window.print()}>
                    Print Invoice
                </button>

                <button onClick={() => window.close()}>
                    Close
                </button>

            </div>

            <div className="invoice-paper">

                <div className="invoice-title">
                    TAXABLE INVOICE
                </div>

                {/* SELLER DETAILS */}

                <div className="top-row">

                    <div className="seller">

                        <strong>AB ELECTRICAL WORKS</strong>
                        <br />

                        Plot No 7 Narkra Bokaro Steel City
                        <br />

                        Bokaro Steel City 827014
                        <br />

                        Mob No : 9431378910, 7870865028, 6200919537
                        <br />

                        GSTIN NO : 20IPEPS5760G1ZR

                    </div>

                    <div className="copies">

                        Original for Recipient
                        <br />

                        Duplicate for Transporter
                        <br />

                        Triplicate for Supplier

                    </div>

                </div>

                {/* INVOICE DETAILS */}

                <div className="invoice-meta">

                    <div>

                        <strong>Invoice No :</strong>
                        {" "}{invoice.serial_no}

                        <br />

                        <strong>Invoice Date :</strong>
                        {" "}{dateFormat(invoice.invoice_date)}

                        <br />

                        <strong>State :</strong> JHARKHAND

                    </div>

                    <div style={{
                        textAlign: "right",
                        marginRight: "50px"
                    }}>

                        <strong>Challan :</strong>
                        {" "}{invoice.id}

                    </div>

                </div>

                {/* PARTY DETAILS */}

                <div className="parties">

                    <div className="party">

                        <div className="party-title">
                            Details of Receiver (Billed To)
                        </div>

                        <strong>Name :</strong>
                        {" "}{invoice.name || invoice.customer_name}

                        <br />

                        <strong>Address :</strong>
                        {" "}{invoice.address}

                        <br />

                        <strong>GSTIN/UIN :</strong>
                        {" "}{invoice.gstin_uin}

                    </div>

                    <div className="party">

                        <div className="party-title">
                            Details of Consignee (Shipped To)
                        </div>

                        <strong>Name :</strong>
                        {" "}{invoice.name || invoice.customer_name}

                        <br />

                        <strong>Address :</strong>
                        {" "}{invoice.shipping_add || invoice.address}

                        <br />

                        <strong>GSTIN/UIN :</strong>
                        {" "}{invoice.gstin_uin}

                    </div>

                </div>

                {/* ITEM DETAILS */}

                <table className="items-table">

                    <thead>
                        <tr>
                            <th>Sl. No.</th>
                            <th>Description</th>
                            <th>HSN Code</th>
                            <th>Qty</th>
                            <th>Rate Per Unit (Rs.)</th>
                            <th>Amount (Rs.)</th>
                        </tr>
                    </thead>

                    <tbody>

                        {items.map((item, index) => {

                            const calc = calculateItem(item);

                            return (

                                <tr key={item.id || index}>

                                    <td>{index + 1}</td>

                                    <td className="description">

                                        {item.item_name}

                                        {item.description && (
                                            <small>
                                                {item.description}
                                            </small>
                                        )}

                                    </td>

                                    <td>
                                        {item.hsn_code || "-"}
                                    </td>

                                    <td>
                                        {item.quantity} {item.unit || ""}
                                    </td>

                                    <td>
                                        {money(item.rate)}
                                    </td>

                                    <td>
                                        {money(calc.taxable)}
                                    </td>

                                </tr>

                            );

                        })}

                        <tr>

                            <td
                                colSpan="5"
                                style={{ textAlign: "right" }}
                            >
                                <strong>Total Amount</strong>
                            </td>

                            <td>
                                <strong>
                                    {money(totals.taxable)}
                                </strong>
                            </td>

                        </tr>

                    </tbody>

                </table>

                {/* AMOUNT IN WORDS */}

                <div className="words">

                </div>

                {/* BANK DETAILS AND TAX SUMMARY */}

                <div className="bottom-section">

                    <div className="bank-details">

                        <strong>Bank Name :</strong>
                        {" "}State Bank of India
                        <br />

                        <strong>Branch Name :</strong>
                        {" "}Balidih Industrial Area
                        <br />

                        <strong>Account No :</strong>
                        {" "}40934859984
                        <br />

                        <strong>IFSC Code :</strong>
                        {" "}SBIN0001734

                    </div>

                    <table className="amount-box">

                        <tbody>

                            <tr>
                                <td>Subtotal</td>
                                <td>{money(totals.taxable)}</td>
                            </tr>

                            <tr>
                                <td>{cgstLabel}</td>
                                <td>{money(totals.cgst)}</td>
                            </tr>

                            <tr>
                                <td>{sgstLabel}</td>
                                <td>{money(totals.sgst)}</td>
                            </tr>

                            <tr className="grand-total">
                                <td>Grand Total Amount</td>
                                <td>{money(totals.total)}</td>
                            </tr>

                        </tbody>

                    </table>

                </div>
                <div className="words">

                    Total Amount In Words :
                    {" "}{amountInWords(totals.total)} /-

                </div>

                {/* DECLARATION AND SIGNATURE */}

                <div className="footer">

                    <div className="declaration">

                        <strong>Declaration :</strong>

                        {" "}Certified that the particulars given are true
                        and correct and the amount indicated represents
                        the price actually charged and there is no
                        additional consideration flowing directly or
                        indirectly from the buyer.

                    </div>

                    <div className="signature">

                        For AB Electrical Works

                        <br /><br /><br /><br />

                        Authorised Signatory

                    </div>

                </div>

            </div>

        </div>
    );
}

// =========================================
// AUTHENTICATION PAGE STYLE
// =========================================

const authStyle = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#f2f4f8",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    padding: "20px"
};
