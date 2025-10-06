import React, { useEffect, useState } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonBackButton,
    IonButtons,
} from "@ionic/react";
import Header from './head';
import moment from 'moment';
import Axios, { baseURL } from "../service/jwtAuth";
import { useLocation } from 'react-router-dom';
import Bottom from './bottomtab';


const WebHistorytable = ({isAuthenticated}) => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const isFetching = { current: false };
    const [pageSize, setPageSize] = useState(200);
    const [currentPage, setCurrentPage] = useState(1);
    const [count, setcount] = useState({});

    useEffect(() => {
        if (isFetching.current) return;
        isFetching.current = true;
        const fetchData = async () => {
            try {
                const startDate = searchParams.get('startDate');
                const endDate = searchParams.get('endDate');
                const transactionType = searchParams.get('transactionType');

                console.log("sddssd", transactionType)

                if (!startDate || !endDate) {
                    setIsLoading(false);
                    return;
                }

                const payload = {
                    startDate,
                    endDate,
                    ...(transactionType && { transactionType: transactionType.split(",").map((value) => Number(value)) }),
                }

                console.log(payload);

                const response = await Axios.post(`transation/getuserOutwardTransactionData?page=${currentPage}&pageSize=${pageSize}`, payload);

                if (!response.ok) {
                    console.log('Failed to fetch invoice data');
                }

                setData(response.data?.Data);
                setcount(response?.data?.count)
            } catch (err) {
                console.log(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setIsLoading(false);
                isFetching.current = false;
            }
        };

        fetchData();
    }, [currentPage, searchParams.toString()]);

    const calculateDays = (transactionDate) => {
        const today = new Date();
        const transDate = new Date(transactionDate);
        const diffTime = Math.abs(today - transDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const totals = {
        pcs: data?.reduce((sum, row) => sum + row.PCS, 0),
        cts: data?.reduce((sum, row) => sum + row.CTS, 0),
        invoiceTotal: data?.reduce((sum, row) => sum + row.INV_AMT, 0),
        totalAmtS: data?.reduce((sum, row) => sum + row.INV_AMT, 0),
    };

    const totalRecords = count.COUNT;
    const totalPages = Math.ceil(totalRecords / pageSize);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        console.log('currentPage', currentPage)
    }, [currentPage])

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

        const handledownloadpdf = (row) =>{
        window.open(`${baseURL}/accreport/report?t=${token}&trno=${row.FL_TRANS_NO}&brid=${row.FL_BRID}&trtype=${row.FL_TRANS_TYPE}&report=LB_Memo_Diamond.rdf&outfile=${row.FL_BILL_NO}`)
    }

    return (
        <>
            <IonPage>
                <Header />
                <IonContent style={{ paddingBottom: '80x', marginBottom: '150px', marginTop: '10px' }}>
                    <div style={{ marginTop: '20px' }}>
                        <h5 class="text-center mb-5 element">Web History Table</h5>
                    </div>
                    <IonGrid style={{ marginBottom: "70px" }}>
                        <IonRow>
                            <IonCol>
                                <div className='table-responsive pt-10'>
                                    <table striped bordered hover style={{ width: '100%', color: 'black' }}>
                                        {/* Table Header */}
                                        <thead className="tablecss" style={{ backgroundColor: "#C19A6B", color: "white" }}>
                                            <tr>
                                                <th>No</th>
                                                <th>Order No</th>
                                                <th>No. Of Days</th>
                                                <th>CreatedBy</th>
                                                <th>Customer Name</th>
                                                <th>Pcs</th>
                                                <th>Cts</th>
                                                <th>Invoice Total</th>
                                                <th>Total Amt $</th>
                                                <th>Inv Report</th>
                                                <th>Memo Report</th>
                                                <th>Sale Inv</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data?.length > 0 ? (
                                                data.map((row, index) => (
                                                    <tr key={row.no}>
                                                        <td>{(currentPage - 1) * pageSize + index + 1}</td>
                                                        <td>{row.FL_BILL_NO}</td>
                                                        <td>{calculateDays(row.FL_TRANS_DATE)}</td>
                                                        <td>{row?.USERID}</td>
                                                        <td>{row?.PARTY_NAME}</td>
                                                        <td>{row?.PCS}</td>
                                                        <td>{row?.CTS?.toFixed(2)}</td>
                                                        <td>{row?.INV_AMT?.toFixed(2)}</td>
                                                        <td>{row?.INV_AMT?.toFixed(2)}</td>
                                                        <td>{row?.INV_TYPE}</td>
                                                        <td>{row?.memoReport}</td>
                                                        <td  style={{ cursor: 'pointer', color: 'blue', textDecoration: "underline"  }} onClick={() => {
                                                            handledownloadpdf(row)
                                                        }}>PDF</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={11} style={{ textAlign: 'center' }}>
                                                        No data found
                                                    </td>
                                                </tr>
                                            )}
                                            {/* Total Row */}
                                            <tr className="tablecss">
                                                <th colSpan="5">Total</th>
                                                <th>{totals?.pcs}</th>
                                                <th>{totals?.cts?.toFixed(2)}</th>
                                                <th>{totals?.invoiceTotal?.toFixed(2)}</th>
                                                <th>{totals?.totalAmtS?.toFixed(2)}</th>
                                                <th colSpan={3}></th>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </IonCol>
                            <div style={{ marginBottom: "15px" }}>
                                <IonRow style={{ display: 'flex', textAlign: 'center', margin: '0px 0px 0px 0px' }}>
                                    <IonCol size='12' style={{ display: "flex", alignItems: 'center', justifyContent: "center" }}>
                                        <button onClick={() => handlePageChange(1)} disabled={currentPage === 1} className='Pagination'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left" viewBox="0 0 16 16">
                                                <path d="M10 12.796V3.204L4.519 8zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753" />
                                            </svg>
                                        </button>
                                        <button onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)} disabled={currentPage === 1} className='Pagination'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
                                                <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                                            </svg>
                                        </button>
                                        {(() => {
                                            const maxButtons = 4;
                                            let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
                                            let endPage = startPage + maxButtons - 1;

                                            if (endPage > totalPages) {
                                                endPage = totalPages;
                                                startPage = Math.max(1, endPage - maxButtons + 1);
                                            }

                                            const pageButtons = [];
                                            for (let i = startPage; i <= endPage; i++) {
                                                pageButtons.push(
                                                    <button

                                                        key={i}
                                                        onClick={() => handlePageChange(i)}
                                                        className={`Pagination ${i === currentPage ? 'active' : ''}`}

                                                    >
                                                        {i}
                                                    </button>
                                                );
                                            }

                                            return pageButtons;
                                        })()}



                                        <button onClick={() => handlePageChange(currentPage < totalPages ? currentPage + 1 : totalPages)} disabled={currentPage === totalPages} className='Pagination'>

                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
                                                <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708" />
                                            </svg>
                                        </button>
                                        <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} className='Pagination'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right" viewBox="0 0 16 16">
                                                <path d="M6 12.796V3.204L11.481 8zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753" />
                                            </svg>
                                        </button>
                                    </IonCol>
                                </IonRow>
                            </div>
                        </IonRow>
                    </IonGrid>

                </IonContent>
                <Bottom isAuthenticated={isAuthenticated}/>
            </IonPage>
        </>
    );
};

export default WebHistorytable;