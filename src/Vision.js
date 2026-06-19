import React from "react";

const Vision = () => {
  const today = new Date();

  const formattedDate = today.toLocaleDateString("hi-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = today.toLocaleTimeString("hi-IN");

  return (
    <>
      <div style={{ overflowX: "auto" }}>
        <div className="container-fluid pt-3">
          <div
            className="bg-transparent my-1 p-3 pt-3 border border-warning border-5 rounded-4"
            style={{ width: "100%" }}
          >
            <h1 style={{ color: "red", padding: "5px" }}>
              PATEL JAN KALYAN SEVA SAMITI
              <br />
              पटेल जन कल्याण सेवा समिति
            </h1>

            <span style={{ color: "green", fontSize: "30px" }}>
              <table>
                <tbody>
                  <tr>
                    <td
                      style={{
                        fontSize: "30px",
                        color: "green",
                        padding: "5px",
                      }}
                    >
                      नमस्कार, आज {formattedDate} {formattedTime} है,
                      हमलोगों का लक्ष्य है 31 अक्टूबर 2025 को पटेल जी का
                      मूर्ति स्थापित करना। इसी लिए आप लोगों के आग्रह है कि
                      सहयोग राशि जल्द से जल्द देने का कष्ट करे। ताकि
                      हमलोगों का लक्ष्य पूरा हो सके। यही समय है कुर्मी एकता
                      का ताकत दिखाये। जितना जल्द हम लोग लक्ष्य को पूरा करेंगे
                      उतना ही ज्यादा हमारे डेहरी ,सासाराम , औरंगाबाद एवं पूरे
                      बिहार में पटेल समाज का नाम रौशन होगा। यह मूर्ति भारत के
                      सबसे ऊंचा दूसरे स्थान पर है। हम लोग एक इतिहास रचने जा
                      रहे है।
                    </td>
                  </tr>
                </tbody>
              </table>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Vision;