import React, { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import '../../assets/css/customerPayment.css';
import logo from "../../assets/images/logo.png";
import adminLayout from '../../hoc/adminLayout';
import axios from "axios";
import { Form, Navigate, useParams } from "react-router-dom";
import { URL } from "../../Url";
import { Button, Col, Container, Row } from "react-bootstrap";
import * as XLSX from "xlsx";
import { Pagination } from "react-bootstrap";

// abhi bus itna krna hai table update hota rhe,
// usmein jab bhi generate bill pr click kre , to ek nya entry ban kar aa jaye
// jismein se hm, download bhi kr skte hai bill 

// to ise kaise krna hai?
// sabse phle to customer bill ki value jo hai wo set ho jaane chahiye, generate bill krte hi
// phle yeh kro uske baad ka batata hoon

//


const CustomerPaymentReceipt = (props) => {

    const [name, setName] = useState('')
    const [presentAddress,setPresentAddress] = useState('')
    const [contactNumber,setContactNumber] = useState('')
    const [srNo,setSrNo] = useState('1')
    const [customerCode, setCustomerCode] = useState('')
    const [customerData, setCustomerData] = useState(null)
    const [fromDate,setFromDate] = useState('')
    const [toDate,setToDate] = useState('')
    const [rate,setRate] = useState(0)
    const [customerId,setCustomerId] = useState('');
    const [generatedBill, setgeneratedBill] = useState(0);
    const [assignedAyaDetails,setAssignedAyaDetails] = useState([]);
    const [assignedAyaInBetween,setAssignedAyaInBetween] = useState([]);
    // const [searchQuery, setSearchQuery] = useState("");
    // const [customerpayment, setCustomerPayment] = useState([]);

    // const currentItems = customerpayment.slice(indexOfFirstItem, indexOfLastItem);

    const {id} = useParams();
    const fetchCustomerData = async()=>{
        try{
            const response = await axios.get(`${URL}/customerreg/${customerCode}`);
            console.log(response.data.data);
            // console.log(response.data.data._id);
            setCustomerId(response.data.data._id)
            setCustomerData(response.data.data);
            const data = response.data.data
            // setCustomerPayment(data.customerpayment);
            setPresentAddress(data.presentAddress);
            // setCustomerCode(data.customerCode)
            setContactNumber(data.contactNumber);
            setName(data.name);
            setAssignedAyaDetails(data.assignedAyaDetails)
            // console.log(presentAddress)
            // console.log(assignedAyaDetails)
        }
        catch(e){
            console.log("error in fetching customer data:",e)
        }
    }


    for(let i=0;i<assignedAyaDetails;i++){
        const ayaDetails = assignedAyaDetails[i];
        // console.log(ayaDetails)
        if(ayaDetails[1]<={toDate} && ayaDetails[2] >= {fromDate}){
            assignedAyaInBetween+=ayaDetails[0];
        }
    }

    // const fetchTotalBill = async () => {
    //     try {
    //       const response = await axios.get(`${URL}/customerreg/${id}`);
    //       const customerData = response.data.data;
    
    //       let totalCustomerBill = 0;
    //       let totalReceivedAmount = 0;
    
    //       if (Array.isArray(customerData.customerpayment)) {
    //         customerData.customerpayment.forEach((payment) => {
    //           totalCustomerBill += parseInt(payment.customerbill + customerbill);
    //           totalReceivedAmount += parseInt(payment.amount_received + amountRec);
    //         });
    
    //         setTotalCustomerBill(totalCustomerBill);
    //         setTotalReceived(totalReceivedAmount);
    
    //         // console.log("Total customer bill:", totalCustomerBill);
    //         // console.log("Total received amount:", totalReceivedAmount);
    //       } else {
    //         console.error(
    //           "Invalid customer payment data format:",
    //           customerData.customerpayment
    //         );
    //       }
    //     } catch (error) {
    //       console.error("Error fetching customer data:", error);
    //     }
    //   };


    // const filteredCustomerPayments = customerpayment.filter(
    //     (item) =>
    //       item.month.toLowerCase().includes(searchQuery.toLowerCase()) &&
    //       (item.customerbill || item.amount_received)
    //   );
    
    //   const pageNumbers = Array.from(
    //     { length: Math.ceil(filteredCustomerPayments.length / itemsPerPage) },
    //     (_, index) => index + 1
    //   );
    

    // useEffect[()=>{
    //     customerData()
    // },[customerCode]]
    const get_diff_days  =  () => {
        if(toDate && fromDate){
            let diff = parseFloat(new Date(toDate).getTime() - new Date(fromDate).getTime());
            console.log(Math.floor(diff/86400000) + 1);
            return diff/(1000*86400);
        }else{
            console.log('not a number')
        }
     
    }

    // const generatedBill = get_diff_days()*{rate};
    
    useEffect(()=>{
        // rate
        const calculatedgeneratedBill = get_diff_days() * rate;
        setgeneratedBill(calculatedgeneratedBill);
        fetchCustomerData();
        
    },[fromDate, toDate,rate,customerCode])

    const tableRef = useRef();

    // console.log(id)

    const handleGenerateBill = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch(`${URL}/customerreg/${customerId}`, {
            method: "PUT",
            body: JSON.stringify({

              generatedCustomerId : customerId,
              generatedTime : Date.now(),  
              generatedBill: generatedBill,
              generatedToDate : toDate,
              generatedFromDate : fromDate,
              generatedRate : rate,
              generatedAyaAssigned : "shakuntala"  
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
        //   await customerData();
    
          const data = await response.json();
          console.log(data);
          alert("data Submitted Succesfully");
        } catch (err) {
          console.log(customerId);

          console.log("error in submitting generatedBill",err);
        }
      };
    

    // const handlePrint = useReactToPrint({
    // content: () => tableRef.current,
    // });

    const convertNumberToWords = (number) => {
        // Define arrays for one-digit, two-digit, and tens multiples names
        const units = [
            "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
            "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
        ];
        const tens = [
            "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
        ];
        const scales = ["", "Thousand", "Million", "Billion", "Trillion"];

        // Split the number into groups of three digits
        const digits = number.toString().split(/(?=(?:\d{3})+(?:\.|$))/g);

        // Convert each group of three digits to words
        const words = digits.map((group, index) => {
            const [hundreds, tensUnits] = group.split(/(?=(?:\d{1})+(?:\.|$))/g);
            let result = "";
            if (hundreds > 0) {
                result += `${units[hundreds]} Hundred `;
            }
            if (tensUnits > 0) {
                if (tensUnits < 20) {
                    result += `${units[parseInt(tensUnits)]} `;
                } else {
                    const [tensDigit, unitsDigit] = tensUnits.split(/(?=(?:\d{1})+(?:\.|$))/g);
                    result += `${tens[parseInt(tensDigit)]} ${units[parseInt(unitsDigit)]} `;
                }
            }
            if (group > 0) {
                result += scales[index];
            }
            return result.trim();
        });

        // Join the groups of words together
        return words.reverse().join(" ");
    };

    const current = new Date();
    const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;

  return (
    <>
        
      <div className='container' ref={tableRef}>
        <div className="row">
            <form onSubmit={handleGenerateBill}>
            <div className="col-12">
                <div className="col-4 ms-3">
                    <div className="">
                    <label
                        style={{
                        display: "inline-block",
                        fontSize: "16px",
                        marginRight: "20px",
                        }}
                        className="fw-bold mb-1"
                    >
                        Customer Code :{" "}
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={customerCode}
                        onChange={(e) => setCustomerCode(e.target.value)}
                    />
                    {/* <button onClick={fetchCustomerData}>Fetch Data</button> */}
                    </div>
                </div>
                <div className="row receipt">
                    <div className="col-6">
                        <img src = {logo} className='companyLogo'/>
                    </div>
                    <div className="col-6 contactNumber">
                        <span>MOBILE NO : 97349-15314<br></br></span>
                        <span>70010-85855</span>
                    </div>
                    <div className="col-12 companyName">
                        <span>Joy Guru Janakalyan Trust <span style = {{color : "black",fontWeight:"lighter",fontFamily:"system-ui"}}>&</span> Service</span>
                    </div>
                    <div className="col-12 companyAddress">
                        <span>SARBAMANGALA PALLY, M.K ROAD, ENGLISH BAZAR, MALDA - 732101</span>
                    </div>
                    <div className="row-1 mb-2">
                        
                        <div className="serial col-5 ms-0">
                        
                            <span>SL NO. {customerCode}</span>
                        </div>
                        <div className="prop col-2 me-5">
                            <span> MR. ABHIJIT PODDAR</span>
                        </div>
                        <div className="date col-4 me-5">
                            <span>PAYMENT DATE: </span>{date}
                        </div>
                    </div>
                    <div className="col-12 row-2 mb-2">
                        <div className="partyName">
                            <span>PARTY NAME: {name}</span>
                        </div>
                    </div>
                    <div className="col-12 row-3 mb-2">
                        <div className="address">
                            <span>ADDRESS: {presentAddress}</span>
                        </div>
                    </div>
                    <div className="col-8 row-4  d-flex gap-3">
                        <div className="purpose">
                            <span>PURPOSE OF :</span>
                        </div>
                        {/* <div className="options"> */}
                        <select className="form-select options" aria-label="Default select example">
                            <option selected>Open this select menu</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                            </select>
                            {/* </div> */}
                    </div>
                    <div className="col-12 row-5 mb-2">
                        <div className="mobile col-6">
                            <span>MOBILE NO. {contactNumber}</span>
                        </div>
                        <div className="rate col-6">
                                <label>PER DAY RATE : 
                                    <input type="text" value={rate} onChange={(e)=>setRate(e.target.value)}/>
                                </label>
                            {/* <span></span> */}
                        </div>
                    </div>
                    <div className="col-12 row-6 mb-2">
                        <div className="duration col-6">
                            <label>DURATION DATE FROM :
                            <input type="date" value = {fromDate} onChange={(e)=>setFromDate(e.target.value)}/>
                            </label>
                        </div>
                        <div className="to col-3">
                            <label>TO :
                            <input type="date" value = {toDate} onChange={(e)=>setToDate(e.target.value)}/>
                            </label>
                        </div>
                        <div className="total col-3">
                            <span>TOTAL DAYS: </span>{get_diff_days()}
                        </div>
                    </div>

                    <div className="col-12 row-7 mb-2">
                        <div className="amountInWord">
                            <span>TOTAL AMOUNT (IN WORDS): {convertNumberToWords(generatedBill)}</span>
                        </div>
                    </div>
                    <div className="row text-center mt-3 mb-5">
                        <div className="col-3"></div>
                        <div className="col-6">
                            <div className="display text-start">
                                <span className='currency'>RS-</span>
                               
                                <span className='amount'> {generatedBill}/-</span>
                            </div>
                        </div>
                        <div className="col-3"></div>
                    </div>
                    <div className="col-6 text-center mb-2">
                        <div className="line">
                            <hr></hr>
                        </div>
                        <span>CUSTOMER SIGNATURE</span>
                    </div>
                    <div className="col-6 text-center mb-2">
                        <div className="line">
                            <hr></hr>
                        </div>
                        <span>FOR: JOY GURU JANAKALYAN TRUST & SERVICE</span>
                    </div>
                </div>

            </div>
            <div className="print-btn text-center">
            <button className='btn bg-primary text-white' >Generate Bill</button>
        </div>
            </form>
        </div>
      </div>

      <section>
            <Container>
              <Row>
                {/* <Col md="4">
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Search by month"
                      value={searchQuery}
                      className="form-control"
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </Col> */}
                <Col md="12" className="mt-2">
                  <div className="my-3 text-end"></div>
                  <div className="table-responsive rounded-3">
                    <table className="table table-responsive table-sm table-stripped table-bordered p-0">
                      <thead className="bg-blue text-white">
                        <tr className="text-uppercase">
                          <th className="">Customer Id</th>
                          <th className="">Generated Bill</th>
                          <th className="">Aya Assigned</th>
                          <th className="">To Data</th>
                          <th className="">From Date</th>
                          <th className="">Rate</th>
                          <th className="">Download Bill</th>
                          
                          {/* <th className="">Invoice</th> */}

                        </tr>
                      </thead>
                      <tbody>
                        {/* <tr>Customer ID</tr> */}
                        <td></td>
                      </tbody>
                    </table>
                  </div>
                  {/* <Pagination>
                    {pageNumbers.map((number) => (
                      <Pagination.Item
                        key={number}
                        active={number === currentPage}
                        onClick={() => setCurrentPage(number)}
                      >
                        {number}
                      </Pagination.Item>
                    ))}
                  </Pagination> */}
                </Col>
              </Row>
            </Container>
      </section>


    </>
  )
}


export default adminLayout(CustomerPaymentReceipt)