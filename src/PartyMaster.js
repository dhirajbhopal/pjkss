
import React, { useEffect, useState } from "react";
import "./style.css";

const API_URL =
  process.env.REACT_APP_API_BASE_URL ||
  "http://pjkss.com/api";

const emptyForm = {
  name: "",
  email: "",
  mobilno: "",
  address: "",
  shipping_add: "",
  gstin_uin: "",
};

export default function PartyMaster() {
  const [form, setForm] = useState(emptyForm);
  const [parties, setParties] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadParties();
  }, []);

  // Load all parties
  const loadParties = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/parties/`);

      if (!response.ok) {
        throw new Error("Unable to load parties");
      }

      const data = await response.json();
      setParties(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Save or update party
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.name.trim()) {
      setMessage("Party name is required.");
      return;
    }

    try {
      setLoading(true);

      const url = editId
        ? `${API_URL}/parties/${editId}/`
        : `${API_URL}/parties/`;

      const response = await fetch(url, {
        method: editId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          JSON.stringify(data) || "Unable to save party"
        );
      }

      setMessage(
        editId
          ? "Party updated successfully."
          : "Party saved successfully."
      );

      setForm({ ...emptyForm });
      setEditId(null);

      await loadParties();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Edit party
  const handleEdit = (party) => {
    setForm({
      name: party.name || "",
      email: party.email || "",
      mobilno: party.mobilno || "",
      address: party.address || "",
      shipping_add: party.shipping_add || "",
      gstin_uin: party.gstin_uin || "",
    });

    setEditId(party.id);
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Delete party
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this party?")) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/parties/${id}/`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Unable to delete party");
      }

      setMessage("Party deleted successfully.");

      if (editId === id) {
        handleReset();
      }

      await loadParties();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setForm({ ...emptyForm });
    setEditId(null);
    setMessage("");
  };

  // Search filter
  const filteredParties = parties.filter((party) => {
    const searchText = search.toLowerCase();

    return (
      (party.name || "").toLowerCase().includes(searchText) ||
      (party.mobilno || "").toLowerCase().includes(searchText) ||
      (party.gstin_uin || "").toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="party-page">

      <div className="party-header">
        <div>
          <h2>Party Master</h2>
          <p>Manage customer and party details</p>
        </div>

        <div className="party-count">
          Total Parties: {parties.length}
        </div>
      </div>

      {message && (
        <div className="party-message">
          {message}
        </div>
      )}

      {/* Party Form */}
      <form className="party-form" onSubmit={handleSubmit}>

        <h3>{editId ? "Update Party" : "Add New Party"}</h3>

        <div className="party-grid">

          <div className="party-field">
            <label>Party / Customer Name *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter party name"
              maxLength={100}
              required
            />
          </div>

          <div className="party-field">
            <label>Mobile Number</label>
            <input
              type="tel"
              name="mobilno"
              value={form.mobilno}
              onChange={handleChange}
              placeholder="Enter mobile number"
              maxLength={12}
            />
          </div>

          <div className="party-field">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email address"
            />
          </div>

          <div className="party-field">
            <label>GSTIN / UIN</label>
            <input
              type="text"
              name="gstin_uin"
              value={form.gstin_uin}
              onChange={handleChange}
              placeholder="Enter GSTIN / UIN"
              maxLength={20}
            />
          </div>

          <div className="party-field party-full">
            <label>Billing Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter billing address"
              rows="3"
            />
          </div>

          <div className="party-field party-full">
            <label>Shipping Address</label>
            <textarea
              name="shipping_add"
              value={form.shipping_add}
              onChange={handleChange}
              placeholder="Enter shipping address"
              rows="3"
            />
          </div>

        </div>

        <div className="party-actions">
          <button
            type="submit"
            className="party-save"
            disabled={loading}
          >
            {loading
              ? "Please Wait..."
              : editId
              ? "Update Party"
              : "Save Party"}
          </button>

          <button
            type="button"
            className="party-reset"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>

      </form>

      {/* Party List */}
      <div className="party-list-section">

        <div className="party-list-header">
          <h3>Party List</h3>

          <input
            type="text"
            className="party-search"
            placeholder="Search name, mobile or GSTIN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="party-table-wrapper">
          <table className="party-table">

            <thead>
              <tr>
                <th>Sr.</th>
                <th>Party Name</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>GSTIN / UIN</th>
                <th>Billing Address</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredParties.map((party, index) => (
                <tr key={party.id}>
                  <td>{index + 1}</td>
                  <td>{party.name}</td>
                  <td>{party.mobilno || "-"}</td>
                  <td>{party.email || "-"}</td>
                  <td>{party.gstin_uin || "-"}</td>
                  <td>{party.address || "-"}</td>

                  <td className="party-row-actions">
                    <button
                      type="button"
                      className="party-edit"
                      onClick={() => handleEdit(party)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="party-delete"
                      onClick={() => handleDelete(party.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredParties.length === 0 && (
                <tr>
                  <td colSpan="7" className="party-empty">
                    {loading
                      ? "Loading..."
                      : "No party records found"}
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

      </div>
    </div>
  );
}
