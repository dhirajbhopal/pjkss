import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Replace with your Django API base URL
const API_BASE_URL = 'http://pjkss.com/api';

const PartyMaster = () => {
  const [activeTab, setActiveTab] = useState('create-invoice'); // 'parties', 'create-invoice', 'invoices'

  // States for Party Management
  const [parties, setParties] = useState([]);
  const [partyForm, setPartyForm] = useState({ name: '', gstin: '', phone: '', address: '' });

  // States for Tax Invoice Creation
  const [invoiceHeader, setInvoiceHeader] = useState({
    party: '',
    invoice_number: '',
    invoice_date: new Date().toISOString().split('T')[0],
  });

  const [items, setItems] = useState([
    { description: '', hsn_sac: '', quantity: 1, rate: 0, tax_rate: 18 }
  ]);

  // States for Invoices List
  const [invoices, setInvoices] = useState([]);

  // Fetch initial data
  useEffect(() => {
    fetchParties();
    fetchInvoices();
  }, []);

  const fetchParties = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/parties/`);
      setParties(res.data);
    } catch (err) {
      console.error('Error fetching parties:', err);
    }
  };

  const fetchInvoices = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/tax-invoices/`);
      setInvoices(res.data);
    } catch (err) {
      console.error('Error fetching invoices:', err);
    }
  };

  // --- Party Handlers ---
  const handlePartySubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/parties/`, partyForm);
      alert('Party created successfully');
      setPartyForm({ name: '', gstin: '', phone: '', address: '' });
      fetchParties();
    } catch (err) {
      alert('Failed to save party: ' + JSON.stringify(err.response?.data || err.message));
    }
  };

  const handleDeleteParty = async (partyId) => {
    if (!window.confirm('Delete this party?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/parties/${partyId}/`);
      fetchParties();
    } catch (err) {
      alert('Failed to delete party');
    }
  };

  // --- Dynamic Items Handlers ---
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const addItemRow = () => {
    setItems([
      ...items,
      { description: '', hsn_sac: '', quantity: 1, rate: 0, tax_rate: 18 }
    ]);
  };

  const removeItemRow = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  // --- Invoice Submission ---
  const handleInvoiceSubmit = async (e) => {
    e.preventDefault();

    if (!invoiceHeader.party) {
      alert('Please select a party');
      return;
    }

    const payload = {
      ...invoiceHeader,
      items: items.map((item) => ({
        description: item.description,
        hsn_sac: item.hsn_sac,
        quantity: Number(item.quantity),
        rate: Number(item.rate),
        tax_rate: Number(item.tax_rate)
      }))
    };

    try {
      const res = await axios.post(`${API_BASE_URL}/tax-invoices/`, payload);
      alert(res.data.message || 'Invoice created successfully');
      // Reset form
      setInvoiceHeader({
        party: '',
        invoice_number: '',
        invoice_date: new Date().toISOString().split('T')[0]
      });
      setItems([{ description: '', hsn_sac: '', quantity: 1, rate: 0, tax_rate: 18 }]);
      fetchInvoices();
    } catch (err) {
      alert('Failed to create invoice: ' + JSON.stringify(err.response?.data || err.message));
    }
  };

  // --- Calculation Helpers ---
  const calculateItemAmount = (qty, rate) => (Number(qty) || 0) * (Number(rate) || 0);
  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const subtotal = calculateItemAmount(item.quantity, item.rate);
      const tax = (subtotal * (Number(item.tax_rate) || 0)) / 100;
      return sum + subtotal + tax;
    }, 0);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1100px', margin: '0 auto' }}>
      <h2>GST Billing & Invoice Management</h2>

      {/* Tab Navigation */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button
          onClick={() => setActiveTab('create-invoice')}
          style={{ padding: '8px 16px', fontWeight: activeTab === 'create-invoice' ? 'bold' : 'normal' }}
        >
          Create Tax Invoice
        </button>
        <button
          onClick={() => setActiveTab('parties')}
          style={{ padding: '8px 16px', fontWeight: activeTab === 'parties' ? 'bold' : 'normal' }}
        >
          Manage Parties
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          style={{ padding: '8px 16px', fontWeight: activeTab === 'invoices' ? 'bold' : 'normal' }}
        >
          View Invoices
        </button>
      </div>

      <hr />

      {/* TAB 1: CREATE TAX INVOICE WITH MULTIPLE ITEMS */}
      {activeTab === 'create-invoice' && (
        <div>
          <h3>Create New Tax Invoice</h3>
          <form onSubmit={handleInvoiceSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
              <div>
                <label><strong>Select Party:</strong></label><br />
                <select
                  style={{ width: '100%', padding: '8px' }}
                  value={invoiceHeader.party}
                  onChange={(e) => setInvoiceHeader({ ...invoiceHeader, party: e.target.value })}
                  required
                >
                  <option value="">-- Choose Party --</option>
                  {parties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.gstin ? `(${p.gstin})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label><strong>Invoice Number:</strong></label><br />
                <input
                  type="text"
                  style={{ width: '100%', padding: '8px' }}
                  value={invoiceHeader.invoice_number}
                  onChange={(e) => setInvoiceHeader({ ...invoiceHeader, invoice_number: e.target.value })}
                  required
                />
              </div>

              <div>
                <label><strong>Invoice Date:</strong></label><br />
                <input
                  type="date"
                  style={{ width: '100%', padding: '8px' }}
                  value={invoiceHeader.invoice_date}
                  onChange={(e) => setInvoiceHeader({ ...invoiceHeader, invoice_date: e.target.value })}
                  required
                />
              </div>
            </div>

            <h4>Invoice Items</h4>
            <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '15px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f2f2f2' }}>
                  <th>Description</th>
                  <th>HSN/SAC</th>
                  <th>Qty</th>
                  <th>Rate (₹)</th>
                  <th>Tax (%)</th>
                  <th>Total (₹)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => {
                  const lineSubtotal = calculateItemAmount(item.quantity, item.rate);
                  const lineTax = (lineSubtotal * (Number(item.tax_rate) || 0)) / 100;
                  const lineTotal = lineSubtotal + lineTax;

                  return (
                    <tr key={idx}>
                      <td>
                        <input
                          type="text"
                          style={{ width: '95%' }}
                          value={item.description}
                          onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          style={{ width: '80px' }}
                          value={item.hsn_sac}
                          onChange={(e) => handleItemChange(idx, 'hsn_sac', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          style={{ width: '60px' }}
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          style={{ width: '80px' }}
                          value={item.rate}
                          onChange={(e) => handleItemChange(idx, 'rate', e.target.value)}
                          required
                        />
                      </td>
                      <td>
                        <select
                          value={item.tax_rate}
                          onChange={(e) => handleItemChange(idx, 'tax_rate', e.target.value)}
                        >
                          <option value="0">0%</option>
                          <option value="5">5%</option>
                          <option value="12">12%</option>
                          <option value="18">18%</option>
                          <option value="28">28%</option>
                        </select>
                      </td>
                      <td>{lineTotal.toFixed(2)}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => removeItemRow(idx)}
                          disabled={items.length === 1}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button type="button" onClick={addItemRow} style={{ padding: '8px 12px' }}>
                + Add Another Item
              </button>
              <h3>Grand Total: ₹{calculateTotal().toFixed(2)}</h3>
            </div>

            <br />
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Save & Create Invoice
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: PARTY MANAGEMENT */}
      {activeTab === 'parties' && (
        <div>
          <h3>Add New Party</h3>
          <form onSubmit={handlePartySubmit} style={{ display: 'grid', gap: '10px', maxWidth: '400px', marginBottom: '30px' }}>
            <input
              type="text"
              placeholder="Party Name"
              value={partyForm.name}
              onChange={(e) => setPartyForm({ ...partyForm, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="GSTIN"
              value={partyForm.gstin}
              onChange={(e) => setPartyForm({ ...partyForm, gstin: e.target.value })}
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={partyForm.phone}
              onChange={(e) => setPartyForm({ ...partyForm, phone: e.target.value })}
            />
            <textarea
              placeholder="Address"
              value={partyForm.address}
              onChange={(e) => setPartyForm({ ...partyForm, address: e.target.value })}
            />
            <button type="submit" style={{ padding: '8px' }}>Save Party</button>
          </form>

          <h3>Party Directory</h3>
          <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th>ID</th>
                <th>Name</th>
                <th>GSTIN</th>
                <th>Phone</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {parties.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.gstin || 'N/A'}</td>
                  <td>{p.phone || 'N/A'}</td>
                  <td>
                    <button onClick={() => handleDeleteParty(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: INVOICES LIST */}
      {activeTab === 'invoices' && (
        <div>
          <h3>Generated Tax Invoices</h3>
          {invoices.length === 0 ? (
            <p>No invoices found.</p>
          ) : (
            invoices.map((inv) => (
              <div key={inv.id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h4>Invoice #: {inv.invoice_number}</h4>
                  <span>Date: {inv.invoice_date}</span>
                </div>
                <p><strong>Party ID/Details:</strong> {inv.party}</p>
                
                <h5>Items:</h5>
                <ul>
                  {inv.items && inv.items.map((item, idx) => (
                    <li key={idx}>
                      {item.description} — Qty: {item.quantity} x ₹{item.rate} (Tax: {item.tax_rate}%)
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PartyMaster;