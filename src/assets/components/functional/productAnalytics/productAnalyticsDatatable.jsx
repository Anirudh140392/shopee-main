import React, { useEffect, useContext, useState, useRef } from "react";
import MuiDataTableComponent from "../../common/muidatatableComponent";
import '../../../styles/keywordsComponent/keywordsComponent.less';
import { Typography, Snackbar, Alert } from "@mui/material";
import overviewContext from "../../../../store/overview/overviewContext";
import { useSearchParams } from "react-router";
import ColumnPercentageDataComponent from "../../common/columnPercentageDataComponent";
import FlightLandIcon from '@mui/icons-material/FlightLand';
import DeepDiveDrawer from "./deepDiveDrawer";

const ProductAnalyticsDatatable = () => {

    const { dateRange, formatDate } = useContext(overviewContext)

    const [productAnalyticsData, setProductAnalyticsData] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [deepDiveOpen, setDeepDiveOpen] = React.useState(false);
    const [searchParams] = useSearchParams();
    const operator = searchParams.get("operator");

    const getProductAnalyticsData = async () => {
        if (!operator) return;

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        setProductAnalyticsData({});
        setIsLoading(true);

        const token = localStorage.getItem("accessToken");
        if (!token) {
            console.error("No access token found");
            setIsLoading(false);
            return;
        }

        const startDate = formatDate(dateRange[0].startDate);
        const endDate = formatDate(dateRange[0].endDate);

        try {
            const response = await fetch(`https://react-api-script.onrender.com/app/productAnalytics?platform=${operator}&start_date=2025-04-22&end_date=2025-05-25
            `, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                signal: controller.signal,
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            setProductAnalyticsData(data);
        } catch (error) {
            if (error.name === "AbortError") {
                console.log("Previous request aborted due to operator change.");
            } else {
                console.error("Failed to fetch product analytics data:", error.message);
                setProductAnalyticsData({});
            }
        } finally {
            setIsLoading(false);
        }
    };

    const abortControllerRef = useRef(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            getProductAnalyticsData();
        }, 100);

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            clearTimeout(timeout);
        }
    }, [operator, dateRange]);

    const ProductAnalyticsColumnFlipkart = [
        {
            field: "product_name",
            headerName: "PRODUCT",
            minWidth: 150,
            renderCell: (params) => (
                <div className="text-icon-div">
                    <Typography variant="body2">{params.row.product_name}</Typography>
                </div>
            ),
        },
        {
            field: "deep_dive", headerName: "DEEP DIVE", minWidth: 100, renderCell: () => (
                <div style={{ width: "100%", textAlign: "center" }}><span onClick={()=>{}}><FlightLandIcon className="cursor-pointer" /></span></div>
            ),
        },
        { field: "category", headerName: "CATEGORY", minWidth: 100 },
        { field: "ad_groups", headerName: "# AD GROUPS", minWidth: 150 },
        {
            field: "bsr",
            headerName: "BSR",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.bsr} percentValue={params.row.bsr_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "bsr_change",
            headerName: "BSR % CHANGE",
            hideable: false
        },
        {
            field: "spends",
            headerName: "SPENDS",
            minWidth: 200,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.spends} percentValue={params.row.spends_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "spends_change",
            headerName: "SPENDS % CHANGE",
            hideable: false
        },
        {
            field: "direct_revenue",
            headerName: "SALES",
            minWidth: 200,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.direct_revenue} percentValue={params.row.direct_revenue_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "direct_revenue_change",
            headerName: "SALES % CHANGE",
            hideable: false
        },
        {
            field: "ctr",
            headerName: "CTR",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.ctr} percentValue={params.row.ctr_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "ctr_change",
            headerName: "CTR % CHANGE",
            hideable: false
        },
        {
            field: "troas",
            headerName: "TROAS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.troas} percentValue={params.row.troas_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "troas_change",
            headerName: "TROAS % CHANGE",
            hideable: false
        },
        {
            field: "roas_direct",
            headerName: "ROAS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.roas_direct} percentValue={params.row.roas_direct_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "roas_direct_change",
            headerName: "ROAS % CHANGE",
            hideable: false
        },
        {
            field: "rating",
            headerName: "RATING",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.rating} percentValue={params.row.rating_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "rating_change",
            headerName: "RATING % CHANGE",
            hideable: false
        },
        {
            field: "price",
            headerName: "PRICE",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.price} percentValue={params.row.price_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "price_change",
            headerName: "PRICE % CHANGE",
            hideable: false
        },
        {
            field: "availability",
            headerName: "AVL %",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.availability} percentValue={params.row.availability_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "availability_change",
            headerName: "AVL % % CHANGE",
            hideable: false
        },
    ];

    const handleSnackbarOpen = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <React.Fragment>
            <DeepDiveDrawer open={deepDiveOpen} setOpen={setDeepDiveOpen} />
            <div className="shadow-box-con-keywords aggregated-view-con">
                <div className="datatable-con-product-analytics">
                    <MuiDataTableComponent
                        isLoading={isLoading}
                        isExport={true}
                        columns={ProductAnalyticsColumnFlipkart}
                        data={productAnalyticsData.data || []} />
                </div>
            </div>
            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={snackbar.open} autoHideDuration={4000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </React.Fragment>
    )
}

export default ProductAnalyticsDatatable;