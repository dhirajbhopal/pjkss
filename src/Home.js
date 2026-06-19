import './style.css';
import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
   // Updates State
  const [updates, setUpdates] = useState([]);

  // Fetch Data Automatically on Page Load
  useEffect(() => {
    fetchUpdates();
  }, []);

  // API Function
  const fetchUpdates = async () => {
    try {

      const response = await axios.get(
        "https://pjkss.pythonanywhere.com/HomeApi/"
      );


      if (response.data.success) {
        setUpdates(response.data.updates);
      }

    } catch (error) {
    }
  };

  const mainMembers = [
    { name: "मान्ती देवी", role: "अध्यक्ष", img: "/images/maantidevi.jpeg" },
    { name: "राज पटेल उर्फ बंटी", role: "सचिव", img: "/images/bantipatel.jpeg" },
    { name: "अमित पटेल", role: "कोषाध्यक्ष", img: "/images/amitpatel.jpeg" },
    { name: "विनोद कुमार सिंह", role: "उपाध्यक्ष", img: "/images/PATEL_LOGO.png" },
    { name: "गुड्डू पटेल", role: "कार्यकारी अध्यक्ष", img: "/images/guddupatel.png" },
    { name: "धीरज पटेल", role: "संचालक", img: "/images/dhirajpatel.png" },
    { name: "कृष्णा पटेल", role: "संरक्षक", img: "/images/krishnapatel.png" },
    { name: "विशाल पटेल", role: "संगठन कर्ता", img: "/images/vishalpatel.png" },
  ];

  const seniorMembers = [
    "1. अरविंद सिंह (ढेलाबाद)", "2. संजय पटेल (तरबंगला)", "3. संजय पटेल (NTPC)", 
    "4. सुदामा सिंह (उचैला)", "5. राजू पटेल (गांधी नगर)", "6. संजय पटेल (राजपुर)", 
    "7. अनिल कुमार (कांकेर)", "8. मिथिलेश पटेल", "9. प्रतीक पटेल (रिउर)"
  ];

  return (  
    <>
<table className="table m-2 p-1">
<tr>
 {/* Left Column: News & Committee */}
<td width="45%"><div> <h2 style={{ color: 'red' }}>
           <i className="fa fa-bullhorn"></i>News & Committee Updates</h2><hr /> </div></td>

          {/* Right Column: Founder Biography */}
<td> <div> <h2 style={{ color: 'red' }}> Founder Mod Narayan Singh</h2> <hr /> </div> </td>
</tr>
<tr>
<td >
            {/* News Marquee */}
            <div className="vertical-marquee" align="left">
              {updates.length > 0 ? (
              <div
                className="marquee-content"
                style={{ animationDuration: "20s" }}
              >
                {updates.map((item) => (
                  <li
                    key={item.id}
                    style={{
                      color: "black",
                      fontSize: "15px",
                      listStyle: "none",
                      marginBottom: "15px",
                    }}
                  >
                    🔴 {item.topic}
                  </li>
                ))}
              </div>
              ) : (
              <p>Loading updates...</p>
              )}
              </div>

            {/* Main Members Section */}
            <div className="container-fluid mt-4">
              <h2 style={{ color: 'red' }}>पटेल स्मारक के मुख्य सदस्य</h2>
              <hr />
              <div className="row g-3">
                {mainMembers.map((member, index) => (
                  <div key={index} className="col-md-3 col-sm-6">
                    <div className="member-card">
                      <img src={member.img} alt={member.name} className="member-img" />
                      <p className="member-role">{member.role}</p>
                      <p className="member-name">{member.name}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Senior Members */}
              <div className="row mt-4">
                <div className="col-12">
                  <div className="member-card">
                    <h3 style={{ color: 'red' }}>वरिष्ठ सदस्य</h3>
                    <div className="row text-start mt-3">
                      <div className="col-md-6">
                        {seniorMembers.slice(0, 5).map((m, i) => <p key={i} className="member-name mb-3">{m}</p>)}
                      </div>
                      <div className="col-md-6">
                        {seniorMembers.slice(5).map((m, i) => <p key={i} className="member-name mb-3">{m}</p>)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br/> 
</td>
<td>
{/* Right Column: Founder Biography */}
        <div className=" container-fluid">
        <h2 style={{ color: 'green' }}>मोद नारायण सिंह पटेल – जीवनी</h2>
          <div className="clearfix">
          <a href="/images/modnarayanfounder.jpeg" target="blank">
            <img 
              src="/images/modnarayanfounder.jpeg" 
              className="founder-img shadow" 
              alt="Founder" 
            />
            </a>
            <div className="p-1">
              <div className="mt-1">
                <p><strong>पूरा नाम:</strong> मोद नारायण सिंह</p>
                <p><strong>जन्म तिथि:</strong> 24 जनवरी 1953</p>
                <p><strong>पुण्य तिथि:</strong> 18 जनवरी 2025</p>
                <p><strong>पद:</strong> जेडीयू रोहतास के पूर्व जिला अध्यक्ष</p>
                <p><strong>संस्थापक:</strong> "(पटेल स्मारक) पटेल जन कल्याण सेवा समिति" एवं "शिवाजी सेना डेहरी" </p>
              </div>
            </div>
          </div>

          <div className="mt-1">
            <h4 style={{ color: 'green' }}>प्रारंभिक जीवन</h4>
            <p>मोद नारायण सिंह पटेल जी का जन्म 24 जनवरी 1953 को हुआ था। साधारण पारिवारिक पृष्ठभूमि से आने के बावजूद उन्होंने कम उम्र से ही समाज सेवा को अपना लक्ष्य बना लिया। शिक्षा और जागरूकता 
            के माध्यम से समाज को आगे बढ़ाने की उनकी सोच शुरू से ही स्पष्ट थी।</p>
            
            <h4 style={{ color: 'green' }} className="mt-1">राजनीतिक जीवन</h4>
            <p>पटेल जी ने अपने राजनीतिक जीवन की शुरुआत समाजवादी विचारधारा के साथ की। बाद में वे जेडीयू (जनता दल यूनाइटेड) से जुड़े और पार्टी में विभिन्न महत्वपूर्ण पदों पर कार्य करते हुए जिला अध्यक्ष भी बने। उनका राजनीतिक सफर
             हमेशा जनता की समस्याओं को उठाने और उनके समाधान की दिशा में काम करने के लिए जाना जाता है।</p>

            <h4 style={{ color: 'green' }} className="mt-1">समाज सेवा और योगदान</h4>
            <p>अपने पूरे जीवनकाल में उन्होंने समाज सेवा को सर्वोपरि माना। पटेल स्मारक पटेल जन कल्याण सेवा समिति की स्थापना की, जिसके माध्यम से उन्होंने शिक्षा, स्वास्थ्य और सामाजिक एकता पर विशेष कार्य किए। उन्होंने पटेल समाज की एकजुटता और उत्थान के लिए विशेष प्रयास किए। ग्रामीण विकास,
             शिक्षा प्रसार और गरीब वर्ग की सहायता उनके जीवन का मुख्य उद्देश्य रहा। </p>
            
            <h4 style={{ color: 'green' }} className="mt-1">व्यक्तित्व और विचारधारा</h4>
            <p>मोद नारायण सिंह पटेल जी का जीवन सादगी, ईमानदारी और समाजहित की भावना से परिपूर्ण था। वे मानते थे कि समाज की प्रगति ही व्यक्ति की असली सफलता है। उनका जीवन संघर्ष और सेवा का अद्भुत उदाहरण है,
             जिसने आने वाली पीढ़ियों के लिए प्रेरणा का स्रोत बनने का काम किया। </p>


            <h4 style={{ color: 'green' }} className="mt-0">निधन</h4>
            <p>18 जनवरी 2025 को मोद नारायण सिंह पटेल जी का सासाराम सड़क दुर्घटना हुआ उसके बाद उन्हें बीएचयू ट्रॉमा सेंटर बनारस में आईसीयू में भर्ती किया गया , 45 दिनों तक इलाज के दौरान उनका निधन हो गया। उनके जाने से पटेल समाज और क्षेत्रीय राजनीति को गहरी क्षति हुई। 
            लेकिन उनके द्वारा किए गए कार्य और समाज सेवा की विरासत हमेशा लोगों को प्रेरित करती रहेगी।</p>
          </div>
      </div>
 </td>
</tr>
</table>
      {/* Goal Section */}
      <div className="container-fluid mt-5 text-center">
        <h2 style={{ color: 'red' }}>
          “हमारा लक्ष्य: सरदार वल्लभभाई पटेल जी की मूर्ति स्थापना और कुर्मी पटेल समाज का सर्वांगीण विकास”
        </h2>
        <hr />
      </div>

       {/* Organization Needs Section */}
      <div className=" container-fluid row mt-4">
        <div className="col-md-1">
            <img src="/images/pateljifullphoto.png" className="img-fluid" alt="Patel ji"/>
        </div>
        <div className="col-md-10 px-2">
            <h3 className="content-heading">संगठन की आवश्यकता</h3>
             पटेल जन कल्याण सेवा समिति इसी विचार को लेकर स्थापित की गई है कि 
            समाज तभी आगे बढ़ सकता है जब वह एक संगठित शक्ति बने।आज के युग में शिक्षा, तकनीकी, रोजगार और सामाजिक सम्मान 
           ही किसी समुदाय की प्रगति का आधार हैं। हमारी समिति का संकल्प है कि कुर्मी पटेल समाज का हर व्यक्ति इन सभी क्षेत्रों में 
           आत्मनिर्भर बने। संगठन के माध्यम से हर गाँव, हर शहर और हर राज्य में समाज के युवाओं, 
            महिलाओं और वरिष्ठ नागरिकों को जोड़कर एक सशक्त सामाजिक संरचना खड़ी की जा सके।
            
            <h3 className="content-heading mt-4">शिक्षा के क्षेत्र में प्रगति</h3>
            कुर्मी पटेल समाज की प्रगति शिक्षा के बिना अधूरी है। समिति का एक प्रमुख उद्देश्य है 
            कि हर बच्चे को गुणवत्तापूर्ण शिक्षा मिले। हम शिक्षा के लिए जागरूकता अभियान चलाएँगे, छात्रवृत्तियाँ उपलब्ध कराएँगे, और गाँव-गाँव में शिक्षा केंद्र स्थापित करेंगे। हमारा मानना है कि जब समाज शिक्षित होगा, तभी वह सशक्त बनेगा। हमारे बच्चे डॉक्टर, इंजीनियर, अधिकारी, शिक्षक,
             किसान और उद्यमी बनकर देश और समाज का गौरव बढ़ाएँगे।

             <h3 className="content-heading mt-4">रोजगार और आत्मनिर्भरता</h3>
             हमारा एक और प्रमुख लक्ष्य है कि कुर्मी पटेल समाज का हर युवक और युवती रोजगार के अवसरों से जुड़ सके। 
             इसके लिए समिति कौशल विकास केंद्र, स्वरोजगार योजनाएँ और कृषि-उद्योग प्रशिक्षण कार्यक्रम शुरू करेगी। हम चाहते हैं कि हमारे लोग न केवल नौकरी पाने वाले बनें, बल्कि नौकरी देने वाले भी बनें। 
             आत्मनिर्भरता ही असली स्वतंत्रता है, और यही पटेल जी की सच्ची भावना का अनुसरण है।

             <h3 className="content-heading mt-4">महिला सशक्तिकरण </h3>
कोई भी समाज तब तक आगे नहीं बढ़ सकता जब तक उसकी महिलाएँ सशक्त न हों। समिति का एक विशेष उद्देश्य है कि कुर्मी पटेल समाज की महिलाएँ शिक्षा, स्वावलंबन और नेतृत्व के क्षेत्र में आगे आएँ। 
हम महिला स्वयं सहायता समूह, प्रशिक्षण शिविर और सामाजिक जागरूकता कार्यक्रमों के माध्यम से उन्हें नई दिशा देंगे। सरदार पटेल जी ने भी कहा था कि “राष्ट्र की शक्ति उसकी माताओं में निहित होती है।”
 इसलिए हमारी समिति महिलाओं को समाज की मुख्यधारा में लाने के लिए हर संभव कदम उठाएगी।
  
<h3 className="content-heading mt-4">युवा जागरूकता और नेतृत्व विकास </h3>
युवा किसी भी समाज की रीढ़ होते हैं। हमारा लक्ष्य है कि समाज के युवाओं को नेतृत्व, अनुशासन और सेवा की भावना से जोड़ा जाए। समिति हर जिले में “पटेल युवा मंच” 
बनाएगी, जहाँ से युवा समाजसेवा, शिक्षा, खेल और सांस्कृतिक गतिविधियों में हिस्सा ले सकें। उन्हें इतिहास, संविधान और सामाजिक मूल्यों की जानकारी दी जाएगी ताकि
 वे न केवल अपने समाज बल्कि राष्ट्र के भी सच्चे नागरिक बन सकें।

 <h3 className="content-heading mt-4">सामाजिक एकता और सहयोग</h3>
कुर्मी पटेल समाज देश के हर कोने में फैला हुआ है, लेकिन उसकी असली ताकत तब दिखेगी जब सब एक साथ आएँगे। समिति का उद्देश्य है कि समाज के 
सभी वर्ग — किसान, मजदूर, व्यापारी, विद्यार्थी — एक मंच पर एकजुट होकर अपने अधिकारों और दायित्वों को समझें। आपसी मतभेदों को भुलाकर अगर
 हम एक झंडे के नीचे खड़े होंगे, तो कोई ताकत हमें कमजोर नहीं कर सकती। यही सरदार पटेल जी की एकता की भावना है।

 <h3 className="content-heading mt-4"> मूर्ति स्थापना का ऐतिहासिक महत्व   </h3>
सरदार वल्लभभाई पटेल जी की मूर्ति हमारी आत्मा का प्रतीक होगी। यह केवल एक श्रद्धांजलि नहीं बल्कि समाज की एकता, त्याग और गौरव की
 गवाही होगी। जब यह मूर्ति स्थापित होगी, तब हर कुर्मी पटेल परिवार को गर्व होगा कि हमने अपने महापुरुष की विरासत को जीवित रखा। 
यह स्थल भावी पीढ़ियों के लिए प्रेरणा केंद्र बनेगा, जहाँ लोग यह सीखेंगे कि “एकता में ही शक्ति है।

<h3 className="content-heading mt-4">संकल्प और समर्पण</h3>
   हमारा यह संकल्प है कि चाहे कितनी भी चुनौतियाँ आएँ, हम अपने लक्ष्य से पीछे नहीं हटेंगे। पटेल जन कल्याण सेवा समिति समाज के हर सदस्य को साथ लेकर आगे बढ़ेगी।
 सरदार पटेल जी की मूर्ति हमारे आत्मसम्मान का प्रतीक बनेगी और हमारा कार्य समाज के हर व्यक्ति तक विकास की किरण पहुँचाने का माध्यम बनेगा। हम यह प्रण लेते हैं कि अपने कर्म, 
अपने विचार और अपने संगठन से कुर्मी पटेल समाज को भारत के सर्वाधिक प्रगतिशील समुदायों में शामिल करेंगे। यही हमारा मिशन, यही हमारी श्रद्धांजलि और यही हमारा भविष्य है।
  </div>
        <div className="col-md-1">
            <img src="/images/pateljiphotofull2.png" className="img-fluid" alt="Patel ji" />
        </div>
      </div>
 <div className="container-fluid">
   {/* Kurgi Sacrify Section */}
      <div className="container-fluid mt-5 text-center">
        <h2 style={{ color: 'red' }}>
          “पटेल कुर्मी समाज की महानता”
        </h2>
        <hr />
      </div>
      <h4  style={{ color: 'green' }} className="container-fluid" align="left"> सामाजिक एकता और सौहार्द:</h4>
  <p className="container-fluid mb-4"> कुर्मी समाज ने सदियों से सामाजिक एकता और सौहार्द का प्रतीक है। इस समाज ने हमेशा अपने सदस्यों के बीच एकता और भाईचारे की भावना को बनाए रखा है, जो आज भी एक आदर्श उदाहरण है।
   कुर्मी समाज के लोगों ने अपने समाज और देश के लिए एकजुट होकर काम किया है और आगे भी करते रहेंगे।</p>
  
  <h4  style={{ color: 'green' }} align="left" className="container-fluid"> सामाजिक एकता और सौहार्द:</h4>
  <p className="container-fluid mb-4">कुर्मी समाज की कृषि परंपरा और योगदान को कभी भुलाया नहीं जा सकता। इस समाज के लोगों ने सदियों से खेती और 
  पशुपालन को अपनी आजीविका का मुख्य साधन बनाया है और देश की खाद्य सुरक्षा में महत्वपूर्ण योगदान दिया है। 
  कुर्मी समाज के लोगों ने कृषि के क्षेत्र में नए तरीकों और तकनीकों को अपनाकर उत्पादन बढ़ाने का प्रयास किया है।</p>

  <h4  style={{ color: 'green' }} align="left" className="container-fluid">कृषि परंपरा और योगदान:</h4>
   <p className="container-fluid mb-4">कुर्मी समाज की सांस्कृतिक धरोहर और परंपराएं अद्वितीय हैं। इस समाज के लोग अपनी समृद्ध संस्कृति और 
   परंपराओं को सहेजकर रखे हुए हैं और नई पीढ़ी को भी इनके बारे में बताते हैं। 
   कुर्मी समाज के लोग अपने त्योहारों और उत्सवों को बड़े उत्साह और उल्लास के साथ मनाते हैं।</p>

  <h4  style={{ color: 'green' }} align="left" className="container-fluid"> सांस्कृतिक धरोहर और परंपराएं:</h4>

  <p className="container-fluid mb-4">कुर्मी समाज की सांस्कृतिक धरोहर और परंपराएं अद्वितीय हैं। इस समाज के लोग अपनी समृद्ध संस्कृति और
   परंपराओं को सहेजकर रखे हुए हैं और नए पीढ़ी को भी इनके बारे में बताते हैं। 
  कुर्मी समाज के लोग अपने त्योहारों और उत्सवों को बड़े उत्साह और उल्लास के साथ मनाते हैं।</p>


  <h4  style={{ color: 'green' }} align="left" className="container-fluid"> शिक्षा और सामाजिक सुधार:</h4>
  <p className="container-fluid mb-4">कुर्मी समाज ने शिक्षा और सामाजिक सुधार में महत्वपूर्ण योगदान दिया है। इस समाज के लोगों ने शिक्षा के क्षेत्र में उल्लेखनीय कार्य किए हैं और सामाजिक सुधार के लिए भी काम किया है। कुर्मी समाज के लोगों ने शिक्षा के प्रसार के लिए स्कूल और कॉलेज खोले हैं और समाज के वंचित वर्गों को शिक्षा प्रदान करने का प्रयास किया है। </p>

  <h4  style={{ color: 'green' }} align="left" className="container-fluid"> राजनीतिक नेतृत्व और योगदान:</h4>
  <p className="container-fluid mb-4">कुर्मी समाज के नेताओं ने देश की राजनीति में महत्वपूर्ण भूमिका निभाई है। सरदार वल्लभभाई पटेल जैसे महान नेता इसी समाज से थे, जिन्होंने देश की आजादी और एकता में महत्वपूर्ण योगदान दिया। कुर्मी समाज के नेताओं ने देश के विकास और समाज के हितों की रक्षा के लिए काम किया है। </p>
 

 <h4  style={{ color: 'green' }} align="left" className="container-fluid"> आर्थिक योगदान और उद्यमिता:</h4>
  <p className="container-fluid mb-4"> कुर्मी समाज के लोगों ने देश की अर्थव्यवस्था में महत्वपूर्ण योगदान दिया है। इस समाज के लोग विभिन्न क्षेत्रों में उद्यमी के रूप में भी कार्य कर रहे हैं और रोजगार के अवसर प्रदान कर रहे हैं। कुर्मी समाज के लोगों ने अपने उद्यमों के माध्यम से देश की आर्थिक प्रगति में योगदान दिया है। </p>


  <h4  style={{ color: 'green' }} align="left" className="container-fluid">सामाजिक न्याय और समानता:  </h4>
 <p className="container-fluid mb-3"> कुर्मी समाज ने हमेशा सामाजिक न्याय और समानता के लिए आवाज उठाई है। इस समाज के लोगों ने समाज में व्याप्त कुरीतियों और असमानताओं को दूर करने के लिए काम किया है। कुर्मी समाज के लोगों ने सामाजिक न्याय और समानता के लिए संघर्ष किया है और आगे भी करते रहेंगे। </p>

 
 <h4  style={{ color: 'green' }} align="left" className="container-fluid">सांस्कृतिक विविधता और समृद्धि:</h4>
 <p className="container-fluid mb-3"> कुर्मी समाज की सांस्कृतिक विविधता और परंपराएं देश की समृद्धि हैं। इस समाज के लोग अपनी संस्कृति और परंपराओं को सहेजकर रखे हुए हैं और देश की सांस्कृतिक विविधता में योगदान दे रहे हैं। कुर्मी समाज के लोग अपनी संस्कृति और परंपराओं को दुनिया भर में फैलाने का प्रयास कर रहे हैं।</p>


  <h4  style={{ color: 'green' }} align="left" className="container-fluid"> शिक्षा और स्वास्थ्य के क्षेत्र में योगदान:</h4>
   <p className="container-fluid mb-3">कुर्मी समाज ने शिक्षा और स्वास्थ्य के क्षेत्र में भी महत्वपूर्ण कार्य किए हैं। इस समाज के लोग शिक्षा और स्वास्थ्य के क्षेत्र में उल्लेखनीय कार्य कर रहे हैं और समाज की सेवा कर रहे हैं। कुर्मी समाज के लोगों ने शिक्षा और स्वास्थ्य के क्षेत्र में नए आयाम स्थापित किए हैं।</p>


  <h4  style={{ color: 'green' }} align="left" className="container-fluid"> राष्ट्रीय एकता और अखंडता:</h4>
 <p className="container-fluid mb-3"> कुर्मी समाज ने राष्ट्रीय एकता और अखंडता के लिए हमेशा काम किया है। इस समाज के लोगों ने देश की एकता और अखंडता के लिए महत्वपूर्ण योगदान दिया है और आगे भी देते रहेंगे। कुर्मी समाज के लोग देश की एकता और अखंडता के समाज के लोग देश की एकता और अखंडता के लिए काम करते रहेंगे और देश के विकास में योगदान देंगे।</p>
 
 </div>
      <div className="container-fluid">
      <br />
        <img src="/images/hrline.png" width="100%" alt="separator" />
      </div>
              {/* gallery section */}

        <h2 style={{ color: 'red' }} className="m-0 p-0 text-center">Gallery</h2>
        <hr />
        <div className="container-fluid m-2 p-2">
          <div className="container-fluid" align="center">
            <a href="/gallery1">
              <button className="btn btn-outline-danger rounded-4 m-2">
                15-August-2025 More Images <br/>
                <span className="m-2">
                <img src="/images/15-August-25/1.jpeg" height="50px" width="80px" className="rounded-4" alt="event" />
                </span>
                <img src="/images/15-August-25/2.jpeg" height="50px" width="80px" className="rounded-4" alt="event" />
              </button>
            </a>

            <a href="/gallery2">
              <button className="btn btn-outline-danger rounded-4 m-2">
                31-Jan-2025 More Images <br/>
                <span className="m-2">
                <img src="/images/31jan_BrahmanBhoj/1.jpg" height="50px" width="80px" className="rounded-4" alt="event" />
                </span>
                <img src="/images/31jan_BrahmanBhoj/21.jpg" height="50px" width="80px" className="rounded-4" alt="event" />
              </button>
            </a>

            <a href="/gallery3">
              <button className="btn btn-outline-danger rounded-4">
                Patel Jayanti_2025 More Images <br/>
                <span className="m-2">
                <img src="/images/31-Oct-25_Patel_Jyanti/1.jpeg" height="50px" width="80px" className="rounded-4" alt="event" />
                </span>
                <img src="/images/31-Oct-25_Patel_Jyanti/26.jpeg" height="50px" width="80px" className="rounded-4" alt="event" />
              </button>
            </a>
          </div>
        </div>
    </>
  );
};

export default Home;