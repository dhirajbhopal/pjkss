
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://pjkss.pythonanywhere.com";

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json"
    }
});

export default function InvoiceSearch() {

    // =====================================
    // USER AUTHENTICATION
    // =====================================

    const [user, setUser] = useState(null);
    const [authChecked, setAuthChecked] = useState(false);

    // Load logged-in user
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
    // ABEW STAFF VERIFICATION
    // =====================================

    const isABEWStaff =
        user?.is_abewstaff === true ||
        String(user?.role || "").toLowerCase() === "abewstaff" ||
        String(user?.user_type || "").toLowerCase() === "abewstaff";

    // =====================================
    // SEARCH STATES
    // =====================================

    const [invoiceNo, setInvoiceNo] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // =====================================
    // SEARCH INVOICE
    // =====================================

    const handleSearch = async (e) => {

        e.preventDefault();

        // ABEWStaff protection
        if (!isABEWStaff) {
            setError(
                "You are not authorized to search invoices."
            );
            return;
        }

        if (!invoiceNo.trim()) {
            setError("Please enter Invoice Number");
            return;
        }

        setLoading(true);
        setError("");

        // Open new page immediately to avoid popup blocking
        const printWindow = window.open(
            "about:blank",
            "_blank"
        );

        try {

            const response = await api.get("/abewinvoice/");

            const data = response.data;

            const invoices = Array.isArray(data)
                ? data
                : (data.results || data.invoices || []);

            const searchValue = invoiceNo
                .trim()
                .toLowerCase();

            const found = invoices.find(inv =>
                String(inv.serial_no || "")
                    .trim()
                    .toLowerCase() === searchValue
            );

            if (!found) {

                if (printWindow) {
                    printWindow.close();
                }

                setError("Invoice not found!");
                return;
            }

            // Open invoice print page
            if (printWindow) {

                printWindow.location.href =
                    `/invoice-print?serial_no=${encodeURIComponent(
                        found.serial_no
                    )}`;

            } else {

                window.location.href =
                    `/invoice-print?serial_no=${encodeURIComponent(
                        found.serial_no
                    )}`;
            }

        } catch (err) {

            if (printWindow) {
                printWindow.close();
            }

            console.error(
                "Invoice Search Error:",
                err
            );

            setError(
                err.response?.data?.detail ||
                err.message ||
                "Unable to search invoice"
            );

        } finally {
            setLoading(false);
        }
    };

    // =====================================
    // AUTHENTICATION CHECKING
    // =====================================

    if (!authChecked) {

        return (
            <div className="search-invoice-page">
                <div className="search-box">
                    <h2>Checking Authentication...</h2>
                </div>
            </div>
        );
    }

    // =====================================
    // LOGIN REQUIRED
    // =====================================

    if (!user) {

        return (
            <div className="search-invoice-page">

                <div className="search-box">

                    <h2>Login Required</h2>

                    <p>
                        Please login to access
                        ABEW Invoice Search.
                    </p>

                    <button
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

    // =====================================
    // ABEWSTAFF ACCESS ONLY
    // =====================================

    if (!isABEWStaff) {

        return (
            <div className="search-invoice-page">

                <div className="search-box">

                    <h2>Access Denied</h2>

                    <p>
                        Only ABEWStaff can access
                        ABEW Invoice Search.
                    </p>

                    <p>
                        Logged in as:{" "}
                        <strong>
                            {user.username || user.email || "User"}
                        </strong>
                    </p>

                </div>

            </div>
        );
    }

    // =====================================
    // ABEWSTAFF SEARCH PAGE
    // =====================================

    return (

        <div className="search-invoice-page">

            <style>{`

                .search-invoice-page {
                    min-height: 100vh;
                    padding: 35px 15px;
                    background: #f2f4f8;
                    font-family: Arial, sans-serif;
                }

                .search-box {
                    max-width: 650px;
                    margin: 60px auto;
                    padding: 35px;
                    background: white;
                    border-radius: 10px;
                    box-shadow: 0 4px 18px rgba(0,0,0,.09);
                }

                .search-box h2 {
                    color: #17365d;
                    margin-top: 0;
                    text-align: center;
                }

                .search-box input {
                    width: 100%;
                    padding: 14px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    font-size: 16px;
                    margin: 12px 0;
                    box-sizing: border-box;
                }

                .search-box button {
                    width: 100%;
                    padding: 13px;
                    background: #17365d;
                    color: white;
                    border: 0;
                    border-radius: 5px;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                }

                .search-box button:disabled {
                    opacity: .6;
                    cursor: not-allowed;
                }

                .search-error {
                    color: #dc3545;
                    text-align: center;
                    margin-top: 15px;
                }

                .user-info {
                    text-align: center;
                    color: #555;
                    margin-bottom: 20px;
                    font-size: 14px;
                }

            `}</style>

            <div className="search-box">

                <h2>ABEW Invoice Search</h2>

                <div className="user-info">

                    Logged in as:{" "}
                    <strong>
                        {user.username || user.email || "ABEWStaff"}
                    </strong>

                    {" "} (ABEWStaff)

                </div>

                <p
                    style={{
                        textAlign: "center",
                        color: "#777"
                    }}
                >
                    Search and Print Tax Invoice
                </p>

                <form onSubmit={handleSearch}>

                    <label>
                        <strong>
                            Enter Invoice Number
                        </strong>
                    </label>

                    <input
                        type="text"
                        placeholder="Example: ABEW0000001"
                        value={invoiceNo}
                        onChange={e => {
                            setInvoiceNo(e.target.value);
                            setError("");
                        }}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Searching..."
                            : "Search Invoice"}
                    </button>

                </form>

                {error && (
                    <div className="search-error">
                        {error}
                    </div>
                )}

            </div>

        </div>
    );
}
