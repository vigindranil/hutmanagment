import React from 'react';
import biswaBangla from '../assets/biswaBangla.png';
import zillaParishadLogo from '../assets/JPLogo.png';

// Define a type for the data prop to ensure type safety.
interface CertificateData {
    licenseNo: string;
    licenseeName: string;
    relativeName: string;
    addressLine1: string;
    po: string;
    ps: string;
    block: string;
    dist: string;
    licenseType: 'Commercial Only' | 'Commercial with Residential';
    rent: string;
    fromDate: string;
    toDate: string;
    landDetails: {
        mouza: string;
        khatianNo: string;
        jlNo: string;
        plotNo: string;
        boundaries: string;
        holdingNo: string;
        area: string;
        inLocation: string;
        policeStation: string;
    };
}
interface CertificateTemplateProps {
    data: CertificateData;
}

export const CertificateTemplate: React.FC<CertificateTemplateProps> = ({ data }) => {
    // Helper function to safely display data
    const safeDisplay = (value: any) => {
        if (value === null || value === undefined || value === '') {
            return '';
        }
        return String(value);
    };

    // Helper to add the 'selected' class for the license type radio button simulation
    const licenseTypeCommercialClass = data.licenseType === 'Commercial Only' ? 'selected' : '';
    const licenseTypeResidentialClass = data.licenseType === 'Commercial with Residential' ? 'selected' : '';
    console.log("data", data);

    return (
        <div id="certificate-to-print" className="certificate-container">
           <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Tiro+Bangla&family=Roboto:wght@400;700&display=swap');

                    .certificate-container {
                        max-width: 800px;
                        margin: 0 auto;
                        background-color: #fff;
                        padding: 20px;
                        font-family: 'Roboto', sans-serif;
                        color: #333;
                        font-size: 11px;
                        line-height: 1.5;
                        box-sizing: border-box;
                    }

                    .certificate-container * {
                        box-sizing: border-box;
                    }

                    .header { 
                        background-color: #e6f2e6; 
                        border-radius: 8px; 
                        padding: 15px; 
                        margin-bottom: 20px; 
                    }

                    .header-top { 
                        display: flex; 
                        justify-content: space-between; 
                        align-items: center; 
                        padding-bottom: 10px; 
                        border-bottom: 1px solid #c8dcc8; 
                    }

                    .header-col { 
                        display: flex; 
                        flex-direction: column; 
                        align-items: center; 
                    }

                    .header-col.left img { 
                        height: 50px; 
                        width: auto;
                    }

                    .header-col.center { 
                        flex-grow: 1; 
                        text-align: center; 
                        margin: 0 20px;
                    }

                    .header-col.right img { 
                        height: 60px; 
                        width: auto;
                    }

                    .header-title { 
                        font-size: 22px; 
                        font-weight: 700; 
                        color: #006400; 
                        margin: 0; 
                        margin-bottom: 5px;
                    }

                    .bengali-title { 
                        font-family: 'Tiro Bangla', serif; 
                        font-size: 16px; 
                        color: #333; 
                        margin: 0;
                    }

                    .contact-info { 
                        display: flex; 
                        justify-content: space-between; 
                        padding: 10px 20px 0; 
                        font-size: 12px; 
                    }

                    .license-no-box { 
                        text-align: center; 
                        border: 1px solid #ccc; 
                        border-radius: 8px; 
                        padding: 8px; 
                        margin: 25px 0; 
                        font-weight: bold; 
                        font-size: 14px;
                    }

                    .section-title-box { 
                        background-color: #d9e6d9; 
                        text-align: center; 
                        padding: 10px; 
                        border-radius: 8px; 
                        font-weight: 700; 
                        font-size: 16px; 
                        margin-bottom: 25px; 
                    }

                    .details-section, .terms-section { 
                        margin-bottom: 25px; 
                    }

                    .detail-line { 
                        display: flex; 
                        margin-bottom: 6px; 
                        align-items: flex-end; 
                        flex-wrap: wrap;
                    }

                    .detail-label { 
                        min-width: 120px; 
                        white-space: nowrap; 
                        font-weight: 500;
                        margin-right: 5px;
                    }

                    .data-field { 
                        border-bottom: 1px dotted #555; 
                        padding: 0 5px; 
                        font-weight: 700; 
                        flex-grow: 1; 
                        min-height: 18px; 
                        word-break: break-word;
                    }

                    .license-type-container { 
                        display: flex; 
                        align-items: center; 
                        gap: 40px; 
                        margin-top: 20px; 
                        flex-wrap: wrap;
                    }

                    .license-type-option { 
                        display: flex; 
                        align-items: center; 
                        gap: 8px; 
                    }

                    .circle { 
                        width: 16px; 
                        height: 16px; 
                        border: 2px solid #333; 
                        border-radius: 50%; 
                        display: flex; 
                        justify-content: center; 
                        align-items: center; 
                        flex-shrink: 0;
                    }

                    .circle.selected::after { 
                        content: ''; 
                        display: block; 
                        width: 8px; 
                        height: 8px; 
                        background-color: #333; 
                        border-radius: 50%; 
                    }

                    .terms-list { 
                        padding-left: 20px; 
                        margin: 0; 
                    }

                    .terms-list li { 
                        margin-bottom: 10px; 
                        text-align: justify; 
                    }

                    .schedule-title { 
                        text-align: center; 
                        border: 1px solid black; 
                        padding: 8px; 
                        margin: 30px auto 20px; 
                        font-weight: 700; 
                        max-width: 300px; 
                    }

                    .grid-layout { 
                        display: grid; 
                        grid-template-columns: repeat(2, 1fr); 
                        gap: 10px; 
                        margin-bottom: 10px; 
                    }

                    .grid-item { 
                        display: flex; 
                        align-items: baseline; 
                    }

                    .grid-item .detail-label { 
                        min-width: auto; 
                        margin-right: 5px; 
                        font-weight: 600;
                    }

                    .signature-area { 
                        display: flex; 
                        justify-content: space-between; 
                        margin-top: 60px; 
                        padding-top: 20px; 
                        border-top: 1px solid #eee; 
                    }

                    .signature-block { 
                        width: 45%; 
                        text-align: left; 
                    }

                    .signature-block.right { 
                        text-align: right; 
                    }

                    .signature-block p { 
                        margin: 0; 
                        font-weight: 700; 
                        margin-bottom: 2px;
                    }

                    /* Print-specific styles */
                    @media print {
                        .certificate-container {
                            padding: 10px;
                        }

                        .header {
                            break-inside: avoid;
                        }
                    }
                `}
            </style>

            <header className="header p-6 border-b-4 border-green-600" style={{ backgroundColor: '#C7D2B4' }}>
                <div className="header-top flex items-center justify-between">
                    <div className="header-col left flex flex-col items-center" style={{ minWidth: 0 }}>
                        <img
                            src={biswaBangla}
                            alt="Govt. of West Bengal Logo"
                            style={{ width: 110, height: 110, objectFit: 'contain', marginBottom: 4 }}
                        />
                    </div>
                    <div className="header-col center flex-1 flex items-center justify-center">
                        <h1
                            className="header-title"
                            style={{
                                fontFamily: "'ITC Garamond Std Bold Narrow', Garamond, 'Times New Roman', serif",
                                color: ' #333399',
                                fontSize: '2rem',
                                fontWeight: 700,
                                margin: 0,
                                letterSpacing: 1,
                                whiteSpace: 'nowrap'
                            }}
                        >
                            JALPAIGURI ZILLA PARISHAD
                        </h1>
                    </div>
                    <div className="header-col right flex flex-col items-center" style={{ minWidth: 0 }}>
                        <img
                            src={zillaParishadLogo}
                            alt="Zilla Parishad Logo"
                            style={{ width: 110, height: 110, objectFit: 'contain', marginBottom: 4 }}
                        />
                    </div>
                </div>
                <div className="contact-info flex justify-center gap-8 mt-2 text-sm font-semibold text-gray-700">
                    <span>aeo.jalzp@gmail.com</span>
                    <span>www.jalpaigurizp.in</span>
                </div>
            </header>

            <section className="license-no-box">
                LICENSE No. <span className="">{safeDisplay(data.licenseNo)}</span>
            </section>

            <section className="section-title-box" style={{ backgroundColor: '#C7D2B4' }}>
                LICENSE FOR SHOP KEEPERS ON THE ZILLA PARISHAD LAND
            </section>

            <section className="details-section">
                <p>License for Commercial Activity for Shopkeepers on the land of Jalpaiguri Zilla Parishad is hereby issued to:</p>
                <div className="detail-line" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="detail-label" style={{ minWidth: 80 }}>Sri/Smt.</span>
                    <span
                        style={{
                            flex: 1,
                            borderBottom: '1px dotted #333',
                            minWidth: 120,
                            display: 'inline-block',
                            padding: '0 8px',
                            fontWeight: 600,
                            letterSpacing: 1,
                            textAlign: 'left'
                        }}
                    >
                        {safeDisplay(data.licenseeName)}
                    </span>
                </div>
                <div className="detail-line" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="detail-label" style={{ minWidth: 160 }}>S/o or W/o or D/o Sri/Smt.</span>
                    <span
                        style={{
                            flex: 1,
                            display: 'inline-flex',
                            alignItems: 'center',
                            minWidth: 120,
                            padding: '0 8px',
                            fontWeight: 600,
                            letterSpacing: 1,
                            textAlign: 'left',
                            borderBottom: '1px dotted #333',
                        }}
                    >
                        {safeDisplay(data.relativeName)}
                    </span>
                </div>
                <div className="detail-line" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                        style={{
                            flex: 1,
                            borderBottom: '1px dotted #333',
                            minWidth: 120,
                            display: 'inline-block',
                            padding: '0 8px',
                            fontWeight: 600,
                            letterSpacing: 1,
                            textAlign: 'left'
                        }}
                    >
                        {safeDisplay(data.addressLine1)}
                    </span>
                </div>
                <div className="detail-line" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="detail-label" style={{ minWidth: 80 }}>Hat, P.O. :</span>
                    <span
                        style={{
                            flex: 1,
                            borderBottom: '1px dotted #333',
                            minWidth: 80,
                            display: 'inline-block',
                            padding: '0 8px',
                            fontWeight: 600,
                            letterSpacing: 1,
                            textAlign: 'left'
                        }}
                    >
                        {safeDisplay(data.po)}
                    </span>
                    <span className="detail-label" style={{ marginLeft: 20, minWidth: 40 }}>P.S. :</span>
                    <span
                        style={{
                            flex: 1,
                            borderBottom: '1px dotted #333',
                            minWidth: 80,
                            display: 'inline-block',
                            padding: '0 8px',
                            fontWeight: 600,
                            letterSpacing: 1,
                            textAlign: 'left'
                        }}
                    >
                        {safeDisplay(data.ps)}
                    </span>
                </div>
                <div className="detail-line" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="detail-label" style={{ minWidth: 60 }}>Block :</span>
                    <span
                        style={{
                            flex: 1,
                            borderBottom: '1px dotted #333',
                            minWidth: 80,
                            display: 'inline-block',
                            padding: '0 8px',
                            fontWeight: 600,
                            letterSpacing: 1,
                            textAlign: 'left'
                        }}
                    >
                        {safeDisplay(data.block)}
                    </span>
                    <span className="detail-label" style={{ marginLeft: 20, minWidth: 50 }}>Dist. :</span>
                    <span
                        style={{
                            flex: 1,
                            borderBottom: '1px dotted #333',
                            minWidth: 80,
                            display: 'inline-block',
                            padding: '0 8px',
                            fontWeight: 600,
                            letterSpacing: 1,
                            textAlign: 'left'
                        }}
                    >
                        {safeDisplay(data.dist)}
                    </span>
                </div>
                <div className="license-type-container" style={{ marginTop: 16 }}>
                    <strong>Type of License :</strong>
                    <div className="license-type-option" style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 16 }}>
                        <div className={`circle ${licenseTypeCommercialClass}`}></div>
                        <span style={{ marginLeft: 6 }}>Commercial Only</span>
                    </div>
                    <div className="license-type-option" style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 16 }}>
                        <div className={`circle ${licenseTypeResidentialClass}`}></div>
                        <span style={{ marginLeft: 6 }}>Commercial with Residential</span>
                    </div>
                </div>
            </section>

            <section className="terms-section">
                <h3>Subject to the following terms and Conditions :</h3>
                <ol className="terms-list">
                    <li>
                        The Zilla Parishad authority hereby issues this 'License' only for conducting his/her shop/business including his/her dwelling house and for no other purpose whatever it may be at an annual rent of
                        <span
                            style={{
                                borderBottom: '1px dotted #333',
                                display: 'inline-block',
                                minWidth: 80,
                                padding: '0 8px',
                                fontWeight: 600,
                                margin: '0 4px'
                            }}
                        >
                            {safeDisplay(data.rent)}
                        </span>
                        for a period of ten (10) years with effect from
                        <span
                            style={{
                                borderBottom: '1px dotted #333',
                                display: 'inline-block',
                                minWidth: 80,
                                padding: '0 8px',
                                fontWeight: 600,
                                margin: '0 4px'
                            }}
                        >
                            {safeDisplay(data.fromDate)}
                        </span>
                        to
                        <span
                            style={{
                                borderBottom: '1px dotted #333',
                                display: 'inline-block',
                                minWidth: 80,
                                padding: '0 8px',
                                fontWeight: 600,
                                margin: '0 4px'
                            }}
                        >
                            {safeDisplay(data.toDate)}
                        </span>
                        , subject to renewal of this 'License\' before the date of expiry.
                    </li>
                    <li>The 'Licensee' shall pay the Annual Fees as per the Amended Bye-Law, 2021 of Jalpaiguri Zilla Parishad. Such yearly rent/fees will be payable / fixed from the 1st April of each year to the 31st March of the following year. Yearly rent /fees may be increased from time to time as per the decision of the Jalpaiguri Zilla Parishad. The 'Licensee' shall pay this rent/fees to the Jalpaiguri Zilla Parishad in time, failing which a delayed penalty will be imposed. The Zilla Parishad reserves the right to cancel the license if the rent/ dues remain pending for more than six months.</li>
                    <li>The 'Licensee' shall not transfer the land (as scheduled in the overleaf) under this 'License' or any part thereof to any other person without the previous sanction/permission of the Zilla Parishad authority in writing.</li>
                    <li>The 'Licensee' shall build/construct his / her pucca house/building after getting prior approval from the Zilla Parishad authority in writing. For getting such approval, he/she has to apply before the Zilla Parishad authority for getting building plan approval with necessary documents. For Municipal areas the building plan shall be approved by the concerned municipality subject to No Objection Certificate from the Jalpaiguri Zilla Parishad.</li>
                    <li>The 'Licensee' shall maintain his/her building/shop/house in proper condition and shall repair it all times during the said period as may require.</li>
                    <li>The 'Licensee' shall use the land exclusively for the purpose of carrying on his/her legally permissible business. The 'Licensee' shall not store/operate any offensive or dangerous goods and not conduct such types of commercial activities at the said premises.</li>
                    <li>The 'Licensee' shall obtain appropriate / necessary license or approval or permission for doing his/her business at his/her own cost from the competent authority / govt. department as per his/her requirements.</li>
                    <li>The 'Licensee' shall neither sublet the premise / building in total or part thereof nor involve any partnership with any entity in the said premises.</li>
                    <li>The 'Licensee' shall peacefully handover possession of the land/premises to the Jalpaiguri Zilla Parishad authority at the end of the tenure of the License period if not renewed the same for further period as per the Bye-Law of the Zilla Parishad. The 'Licensee' intending to vacate the land/premise at an earlier date shall give a notice mentioning his/her intention to the Zilla Parishad authority before the expiry of the 'License' period as mentioned in his / her 'License' for the said land/premises.</li>
                    <li>The 'Licensee' shall obtain electric connection in his/her land/premises from the WBSEDCL authority (nearest Customer Care Centre) in favor of his/her name. The charges of electricity connection for this purpose shall be exclusively borne by the 'Licensee'.</li>
                    <li>The 'Licensee' shall be responsible for payment of existing taxes/fees/service charges, etc., for his/her building/shop/establishment as fixed by the local Gram Panchayat authority or the Municipality, as the case may be.</li>
                    <li>The 'Licensee' shall maintain cleanliness in his/her building/stall/shop/vacant portion upon the said land regularly. The Zilla Parishad authority or any other respective department/ office reserves the right to inspect the building /stall/premises at any point of time.</li>
                    <li>The 'Licensee' shall possess no authority to transfer the possession of the said land/premises to any other person in any manner or what so ever and any other person on his/her behalf shall be allowed to run the business on the said land/premises except with prior approval of the Jalpaiguri Zilla Parishad.</li>
                    <li>The 'Licensee' shall not by reason of this 'License' be entitled to ownership of the said land at any cost.</li>
                    <li>Any violation of these terms and conditions shall attract penal provisions, including cancellation of the 'License' as decided by the Zilla Parishad on a case-to-case basis. The Zilla Parishad authority may demolish/remove any construction/structure erected on the said land on violation of the terms and conditions of this license if it is felt necessary or so by issuing a 'Notice' to the 'Licensee' beforehand. In such cases, the 'Licensee' shall remove all the rubbish & debris and clear the site/land by his/her own expense. He/she will not be entitled and will not claim to get any compensation for this. Further, the 'Licensee' will be terminated before its expiry period in accordance with the Bye-Law of the Zilla Parishad.</li>
                    <li>If the 'Licensee' shall duly observe all the terms & conditions of this 'License', then on the expiry of this 'License' he/she may be entitled to prior consideration for further renewals thereof for further period upon such terms as may be offered and on payment of such fees as may be assessed.</li>
                </ol>
            </section>

            <section className="schedule-section">
                <div className="schedule-title">: SCHEDULE OF THE LAND :</div>
                <p><strong>PARTICULARS OF THE HOLDING / LAND :</strong></p>
                <div className="grid-layout">
                    <div className="grid-item" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="detail-label" style={{ minWidth: 80 }}>MOUZA:</span>
                        <span
                            style={{
                                flex: 1,
                                borderBottom: '1px dotted #333',
                                minWidth: 80,
                                display: 'inline-block',
                                padding: '0 8px',
                                fontWeight: 600,
                                textAlign: 'left'
                            }}
                        >
                            {safeDisplay(data.landDetails.mouza)}
                        </span>
                    </div>
                    <div className="grid-item" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="detail-label" style={{ minWidth: 100 }}>KHATIAN NO:</span>
                        <span
                            style={{
                                flex: 1,
                                borderBottom: '1px dotted #333',
                                minWidth: 80,
                                display: 'inline-block',
                                padding: '0 8px',
                                fontWeight: 600,
                                textAlign: 'left'
                            }}
                        >
                            {safeDisplay(data.landDetails.khatianNo)}
                        </span>
                    </div>
                    <div className="grid-item" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="detail-label" style={{ minWidth: 80 }}>JL. NO.:</span>
                        <span
                            style={{
                                flex: 1,
                                borderBottom: '1px dotted #333',
                                minWidth: 80,
                                display: 'inline-block',
                                padding: '0 8px',
                                fontWeight: 600,
                                textAlign: 'left'
                            }}
                        >
                            {safeDisplay(data.landDetails.jlNo)}
                        </span>
                    </div>
                    <div className="grid-item" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="detail-label" style={{ minWidth: 90 }}>PLOTNO/s:</span>
                        <span
                            style={{
                                flex: 1,
                                borderBottom: '1px dotted #333',
                                minWidth: 80,
                                display: 'inline-block',
                                padding: '0 8px',
                                fontWeight: 600,
                                textAlign: 'left'
                            }}
                        >
                            {safeDisplay(data.landDetails.plotNo)}
                        </span>
                    </div>
                </div>

                <p><strong>BOUNDARIES OF PLOT :</strong></p>
                <div className="grid-item" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="detail-label" style={{ minWidth: 80 }}>MOUZA:</span>
                        <span
                            style={{
                                flex: 1,
                                borderBottom: '1px dotted #333',
                                minWidth: 80,
                                display: 'inline-block',
                                padding: '0 8px',
                                fontWeight: 600,
                                textAlign: 'left'
                            }}
                        >
                            {safeDisplay(data.landDetails.boundaries)}
                        </span>
                    </div>

                <div className="detail-line" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 20 }}>
                    <span className="detail-label" style={{ minWidth: 160 }}>HOLDING NO/STALL NO :</span>
                    <span
                        style={{
                            flex: 1,
                            borderBottom: '1px dotted #333',
                            minWidth: 80,
                            display: 'inline-block',
                            padding: '0 8px',
                            fontWeight: 600,
                            textAlign: 'left'
                        }}
                    >
                        {safeDisplay(data.landDetails.holdingNo)}
                    </span>
                </div>
                <div className="detail-line" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="detail-label" style={{ minWidth: 180 }}>AREA OF THE HOLDING/LAND :</span>
                    <span
                        style={{
                            flex: 1,
                            borderBottom: '1px dotted #333',
                            minWidth: 80,
                            display: 'inline-block',
                            padding: '0 8px',
                            fontWeight: 600,
                            textAlign: 'left'
                        }}
                    >
                        {safeDisplay(data.landDetails.area)} Sq. Ft.
                    </span>
                </div>
                <div className="detail-line" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="detail-label" style={{ minWidth: 30 }}>in</span>
                    <span
                        style={{
                            flex: 1,
                            borderBottom: '1px dotted #333',
                            minWidth: 80,
                            display: 'inline-block',
                            padding: '0 8px',
                            fontWeight: 600,
                            textAlign: 'left'
                        }}
                    >
                        {safeDisplay(data.landDetails.inLocation)}
                    </span>
                    <span className="detail-label" style={{ marginLeft: 20, minWidth: 30 }}>Hat</span>
                </div>
                <div className="detail-line" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="detail-label" style={{ minWidth: 120 }}>POLICE STATION :</span>
                    <span
                        style={{
                            flex: 1,
                            borderBottom: '1px dotted #333',
                            minWidth: 80,
                            display: 'inline-block',
                            padding: '0 8px',
                            fontWeight: 600,
                            textAlign: 'left'
                        }}
                    >
                        {safeDisplay(data.landDetails.policeStation)}
                    </span>
                    <span className="detail-label" style={{ marginLeft: 20, minWidth: 120 }}>DISTRICT : JALPAIGURI</span>
                </div>
            </section>

            <footer className="signature-area">
                <div className="signature-block">
                    <p>Secretary</p>
                    <p>Jalpaiguri Zilla Parishad</p>
                </div>
                <div className="signature-block right">
                    <p>Additional District Magistrate, Jalpaiguri</p>
                    <p>&</p>
                    <p>Additional Executive Officer</p>
                    <p>Jalpaiguri Zilla Parishad</p>
                </div>
            </footer>
        </div>
    );
};


