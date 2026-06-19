import './style.css'
import React from 'react';

const Contact = () => {
  return (
    <div style={{ overflowX: 'auto' }}>
      <div className="container-fluid pt-3">
        <div 
          className="bg-transparent my-1 p-3 pt-3 border border-warning border-5 rounded-4" 
          style={{ width: '100%' }}
        >
          <h1 style={{ color: 'red', padding: '5px' }}>
            PATEL JAN KALYAN SEVA SAMITI <br /> 
            पटेल जन कल्याण सेवा समिति
          </h1>
          
          <span style={{ color: 'green', fontSize: '30px' }}>
            <table>
              <tbody>
                <tr>
                  <td style={{ fontSize: '30px', color: 'blue', padding: '5px' }}>
                    Address &nbsp;
                  </td>
                  <td style={{ fontSize: '30px', color: 'blue', padding: '5px' }}>
                    :- &nbsp;
                  </td>
                  <td style={{ fontSize: '20px' }}>
                    पटेल स्मारक, जी.टी रोड, मोहन बिगहा, बस स्टैंड, पिन कोड 821307
                  </td>
                </tr>
                <tr>
                  <td style={{ fontSize: '30px', color: 'blue', padding: '5px' }}>
                    Mobile No
                  </td>
                  <td style={{ fontSize: '30px', color: 'blue', padding: '5px' }}>
                    :- &nbsp;
                  </td>
                  <td style={{ fontSize: '20px' }}>
                    +91 7869527457, 9135265354
                  </td>
                </tr>
                <tr>
                  <td style={{ fontSize: '30px', color: 'blue', padding: '5px' }}>
                    Email Id
                  </td>
                  <td style={{ fontSize: '30px', color: 'blue', padding: '5px' }}>
                    :- &nbsp;
                  </td>
                  <td style={{ fontSize: '20px' }}>
                    pjkssinfo@gmail.com, pjkssdehri@gmail.com
                  </td>
                </tr>
              </tbody>
            </table>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Contact;