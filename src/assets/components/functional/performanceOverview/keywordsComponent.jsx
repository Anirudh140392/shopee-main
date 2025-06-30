import React, { useEffect, useContext, useState, useRef } from "react";
import MuiDataTableComponent from "../../common/muidatatableComponent";
import '../../../styles/keywordsComponent/keywordsComponent.less';
import { Typography, Snackbar, Alert } from "@mui/material";
import overviewContext from "../../../../store/overview/overviewContext";
import { useSearchParams, useNavigate } from "react-router";
import ColumnPercentageDataComponent from "../../common/columnPercentageDataComponent";
import TrendsModal from "./modal/trendsModal";
import BidCell from "./overview/bidCell";

const KeywordsComponent = () => {

    const { dateRange, getBrandsData, formatDate, campaignName } = useContext(overviewContext)

    const [showTrendsModal, setShowTrendsModal] = useState({ name: '', show: false, date: [] })
    const [keywordsData, setKeywordsData] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const [searchParams] = useSearchParams();
    const operator = searchParams.get("operator");
    const navigate = useNavigate()

    const getKeywordsData = async () => {
        if (!operator) return;

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        setKeywordsData({});
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
            const response = await fetch(`https://react-api-script.onrender.com/app/keyword?start_date=${startDate}&end_date=${endDate}&platform=${operator}&campaign_name=${campaignName}`, {
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
            setKeywordsData(data);
        } catch (error) {
            if (error.name === "AbortError") {
                console.log("Previous request aborted due to operator change.");
            } else {
                console.error("Failed to fetch keywords data:", error.message);
                setKeywordsData({});
            }
        } finally {
            setIsLoading(false);
        }
    };

    const abortControllerRef = useRef(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            getKeywordsData();
        }, 100);

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            clearTimeout(timeout);
        }
    }, [operator, dateRange, campaignName]);

    useEffect(() => {
        getBrandsData()
    }, [operator])

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            navigate("/login");
            window.location.reload();
        }
    }, []);

    const KeywordsColumnFlipkart = [
        {
            field: "placement_type",
            headerName: "TARGET",
            minWidth: 150,
            renderCell: (params) => (
                <div className="text-icon-div cursor-pointer" onClick={() => handleKeywordClick(params.row.placement_type, params.row.campaign_id)}>
                    <Typography className="redirect" variant="body2">{params.row.placement_type}</Typography>
                </div>
            ),
        },
        {
            field: "campaign_name",
            headerName: "CAMPAIGN",
            minWidth: 300,
        },
        {
            field: "bid",
            headerName: "BID",
            minWidth: 150,
            renderCell: (params) => (
                <BidCell
                    value={params.row.bid}
                    campaignId={params.row.campaign_id}
                    platform={operator}
                    keyword={params.row.placement_type}
                    onUpdate={(campaignId, keyword, newBid) => {
                        console.log("Updating bid:", { campaignId, keyword, newBid });
                        setKeywordsData(prevData => {
                            const updatedData = {
                                ...prevData,
                                data: prevData.data.map(row =>
                                    row.campaign_id === campaignId &&
                                        row.placement_type === keyword
                                        ? { ...row, bid: newBid }
                                        : row
                                )
                            };
                            console.log("Updated keywordsData:", updatedData);
                            return updatedData;
                        });
                    }} onSnackbarOpen={handleSnackbarOpen}
                />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        { field: "ad_group_name", headerName: "AD GROUP", minWidth: 150, },
        {
            field: "views",
            headerName: "IMPRESSIONS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.views} percentValue={params.row.views_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "views_diff",
            headerName: "IMPRESSIONS % CHANGE",
            hideable: false
        },
        {
            field: "clicks",
            headerName: "CLICKS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.clicks} percentValue={params.row.clicks_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "clicks_diff",
            headerName: "CLICKS % CHANGE",
            hideable: false
        },
        {
            field: "cpc",
            headerName: "CPC",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.cpc} percentValue={params.row.cpc_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "cpc_diff",
            headerName: "CPC % CHANGE",
            hideable: false
        },
        {
            field: "direct_orders",
            headerName: "DIRECT ORDERS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.direct_orders} percentValue={params.row.direct_orders_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "direct_orders_diff",
            headerName: "DIRECT ORDERS % CHANGE",
            hideable: false
        },
        {
            field: "indirect_orders",
            headerName: "INDIRECT ORDERS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.indirect_orders} percentValue={params.row.indirect_orders_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "indirect_orders_diff",
            headerName: "INDIRECT ORDERS % CHANGE",
            hideable: false
        },
        {
            field: "cost",
            headerName: "SPENDS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.cost} percentValue={params.row.cost_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "cost_diff",
            headerName: "SPENDS % CHANGE",
            hideable: false
        },
        {
            field: "total_converted_revenue",
            headerName: "DIRECT SALES",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.total_converted_revenue} percentValue={params.row.total_converted_revenue_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "total_converted_revenue_diff",
            headerName: "DIRECT SALES % CHANGE",
            hideable: false
        },
        {
            field: "indirect_sales",
            headerName: "INDIRECT SALES",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.indirect_sales} percentValue={params.row.indirect_sales_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "indirect_sales_diff",
            headerName: "INDIRECT SALES % CHANGE",
            hideable: false
        },
        {
            field: "acos",
            headerName: "ACOS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.acos} percentValue={params.row.acos_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "acos_diff",
            headerName: "ACOS % CHANGE",
            hideable: false
        },
        {
            field: "roi",
            headerName: "ROAS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.roi} percentValue={params.row.roi_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "roi_diff",
            headerName: "ROAS % CHANGE",
            hideable: false
        },
        {
            field: "roi_direct",
            headerName: "DIRECT ROAS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.roi_direct} percentValue={params.row.roi_direct_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "roi_direct_diff",
            headerName: "DIRECT ROAS % CHANGE",
            hideable: false
        },
        {
            field: "ctr",
            headerName: "CTR",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.ctr} percentValue={params.row.ctr_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "ctr_diff",
            headerName: "CTR % CHANGE",
            hideable: false
        },
        {
            field: "cvr",
            headerName: "CVR",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.cvr} percentValue={params.row.cvr_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },

        {
            field: "cvr_diff",
            headerName: "CVR % CHANGE",
            hideable: false
        },
        {
            field: "aov",
            headerName: "AOV",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.aov} percentValue={params.row.aov_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "aov_diff",
            headerName: "AOV % CHANGE",
            hideable: false
        },
        { field: "ad_type", headerName: "AD TYPE", minWidth: 150, },
    ];

    const keywordsDummyData = [
        {
            id: 1,
            placement_type: "Homepage Banner",
            campaign_id: "CROMP001",
            campaign_name: "Cool Breeze Summer Fans",
            bid: 12.5,
            ad_group_name: "Ceiling Fans",
            views: 10000,
            views_diff: 5,
            clicks: 500,
            clicks_diff: 10,
            cpc: 2.5,
            cpc_diff: -5,
            direct_orders: 30,
            direct_orders_diff: 20,
            indirect_orders: 10,
            indirect_orders_diff: 8,
            cost: 1250,
            cost_diff: 3,
            total_converted_revenue: 4000,
            total_converted_revenue_diff: 7,
            indirect_sales: 1000,
            indirect_sales_diff: 6,
            acos: 31.25,
            acos_diff: -2,
            roi: 3.2,
            roi_diff: 10,
            roi_direct: 2.5,
            roi_direct_diff: 5,
            ctr: 5.0,
            ctr_diff: 1.5,
            cvr: 6.0,
            cvr_diff: 2.2,
            aov: 120,
            aov_diff: -1,
            ad_type: "Sponsored"
        },
        {
            id: 2,
            placement_type: "Search Result",
            campaign_id: "CROMP002",
            campaign_name: "Diwali LED Bonanza",
            ad_group_name: "LED Bulbs",
            bid: 10,
            views: 8000,
            views_diff: -3,
            clicks: 400,
            clicks_diff: 5,
            cpc: 2.0,
            cpc_diff: 1.2,
            direct_orders: 25,
            direct_orders_diff: 15,
            indirect_orders: 8,
            indirect_orders_diff: -4,
            cost: 1000,
            cost_diff: 2.5,
            total_converted_revenue: 3500,
            total_converted_revenue_diff: 6,
            indirect_sales: 800,
            indirect_sales_diff: -2,
            acos: 28.6,
            acos_diff: 0.5,
            roi: 3.5,
            roi_diff: 4,
            roi_direct: 2.8,
            roi_direct_diff: 6,
            ctr: 5.2,
            ctr_diff: 0.8,
            cvr: 5.5,
            cvr_diff: 1.8,
            aov: 140,
            aov_diff: 2,
            ad_type: "Video"
        },
        {
            id: 3,
            placement_type: "Product Page",
            campaign_id: "CROMP003",
            campaign_name: "Rain Ready Air Coolers",
            ad_group_name: "Air Coolers",
            bid: 9.5,
            views: 9000,
            views_diff: 4.5,
            clicks: 450,
            clicks_diff: 3.2,
            cpc: 2.1,
            cpc_diff: -1.5,
            direct_orders: 28,
            direct_orders_diff: 7.5,
            indirect_orders: 12,
            indirect_orders_diff: 3.1,
            cost: 950,
            cost_diff: 1.8,
            total_converted_revenue: 3700,
            total_converted_revenue_diff: 4.2,
            indirect_sales: 900,
            indirect_sales_diff: 1.2,
            acos: 25.6,
            acos_diff: -1.1,
            roi: 3.8,
            roi_diff: 2.7,
            roi_direct: 3.1,
            roi_direct_diff: 3.4,
            ctr: 5.0,
            ctr_diff: 1.2,
            cvr: 6.2,
            cvr_diff: 0.9,
            aov: 130,
            aov_diff: 1.1,
            ad_type: "Carousel"
        },
        {
            id: 4,
            placement_type: "Category Listing",
            campaign_id: "CROMP004",
            campaign_name: "Smart Lighting Fest",
            ad_group_name: "Smart LED",
            bid: 11.3,
            views: 9500,
            views_diff: 2.3,
            clicks: 480,
            clicks_diff: 1.1,
            cpc: 2.3,
            cpc_diff: 0.4,
            direct_orders: 29,
            direct_orders_diff: 4.5,
            indirect_orders: 14,
            indirect_orders_diff: -2.1,
            cost: 1100,
            cost_diff: 2.2,
            total_converted_revenue: 3900,
            total_converted_revenue_diff: 3.8,
            indirect_sales: 950,
            indirect_sales_diff: -1.6,
            acos: 28.2,
            acos_diff: -0.9,
            roi: 3.6,
            roi_diff: 2.3,
            roi_direct: 2.9,
            roi_direct_diff: 3.0,
            ctr: 5.1,
            ctr_diff: 0.9,
            cvr: 6.1,
            cvr_diff: 1.5,
            aov: 135,
            aov_diff: -0.7,
            ad_type: "Static"
        },
        {
            id: 5,
            placement_type: "Deals of the Day",
            campaign_id: "CROMP005",
            campaign_name: "Clearance Sale - Kitchen Essentials",
            ad_group_name: "Mixer Grinders",
            bid: 13.0,
            views: 12000,
            views_diff: 6.7,
            clicks: 600,
            clicks_diff: 4.9,
            cpc: 2.6,
            cpc_diff: -0.8,
            direct_orders: 35,
            direct_orders_diff: 6.0,
            indirect_orders: 15,
            indirect_orders_diff: 2.5,
            cost: 1350,
            cost_diff: 3.5,
            total_converted_revenue: 4100,
            total_converted_revenue_diff: 5.9,
            indirect_sales: 1100,
            indirect_sales_diff: 2.0,
            acos: 32.9,
            acos_diff: -0.6,
            roi: 3.0,
            roi_diff: 1.5,
            roi_direct: 2.6,
            roi_direct_diff: 1.8,
            ctr: 5.3,
            ctr_diff: 1.1,
            cvr: 6.4,
            cvr_diff: 2.0,
            aov: 125,
            aov_diff: 0.5,
            ad_type: "Banner"
        },
        {
            id: 6,
            placement_type: "Homepage Banner",
            campaign_id: "CROMP006",
            campaign_name: "Monsoon Magic Geysers",
            ad_group_name: "Water Heaters",
            bid: 11.0,
            views: 8500,
            views_diff: 4.1,
            clicks: 420,
            clicks_diff: 2.3,
            cpc: 2.4,
            cpc_diff: -0.7,
            direct_orders: 26,
            direct_orders_diff: 5.2,
            indirect_orders: 10,
            indirect_orders_diff: 1.4,
            cost: 1008,
            cost_diff: 2.1,
            total_converted_revenue: 3600,
            total_converted_revenue_diff: 3.7,
            indirect_sales: 950,
            indirect_sales_diff: 1.0,
            acos: 28.0,
            acos_diff: -1.0,
            roi: 3.6,
            roi_diff: 2.5,
            roi_direct: 2.9,
            roi_direct_diff: 3.3,
            ctr: 4.9,
            ctr_diff: 1.0,
            cvr: 6.0,
            cvr_diff: 1.3,
            aov: 135,
            aov_diff: 1.2,
            ad_type: "Video"
        },
        {
            id: 7,
            placement_type: "Search Result",
            campaign_id: "CROMP007",
            campaign_name: "Bathroom Essentials - Exhaust Fans",
            ad_group_name: "Exhaust Fans",
            bid: 9.8,
            views: 7700,
            views_diff: 2.0,
            clicks: 370,
            clicks_diff: 1.5,
            cpc: 2.1,
            cpc_diff: -0.6,
            direct_orders: 22,
            direct_orders_diff: 4.2,
            indirect_orders: 7,
            indirect_orders_diff: -1.3,
            cost: 950,
            cost_diff: 1.9,
            total_converted_revenue: 3100,
            total_converted_revenue_diff: 3.4,
            indirect_sales: 700,
            indirect_sales_diff: -0.8,
            acos: 30.6,
            acos_diff: -0.9,
            roi: 3.3,
            roi_diff: 1.9,
            roi_direct: 2.6,
            roi_direct_diff: 2.2,
            ctr: 4.8,
            ctr_diff: 0.7,
            cvr: 5.9,
            cvr_diff: 1.0,
            aov: 125,
            aov_diff: 0.8,
            ad_type: "Static"
        },
        {
            id: 8,
            placement_type: "Product Page",
            campaign_id: "CROMP008",
            campaign_name: "Smart Home Automation Launch",
            ad_group_name: "Smart Switches",
            bid: 14.0,
            views: 11000,
            views_diff: 5.4,
            clicks: 590,
            clicks_diff: 4.6,
            cpc: 2.8,
            cpc_diff: 0.3,
            direct_orders: 34,
            direct_orders_diff: 6.7,
            indirect_orders: 11,
            indirect_orders_diff: 2.6,
            cost: 1650,
            cost_diff: 3.8,
            total_converted_revenue: 4400,
            total_converted_revenue_diff: 5.3,
            indirect_sales: 1050,
            indirect_sales_diff: 2.4,
            acos: 37.5,
            acos_diff: 0.2,
            roi: 2.7,
            roi_diff: 1.7,
            roi_direct: 2.2,
            roi_direct_diff: 1.9,
            ctr: 5.4,
            ctr_diff: 1.2,
            cvr: 5.8,
            cvr_diff: 1.5,
            aov: 130,
            aov_diff: -1.0,
            ad_type: "Carousel"
        },
        {
            id: 9,
            placement_type: "Deals of the Day",
            campaign_id: "CROMP009",
            campaign_name: "Kitchen Combo Offers",
            ad_group_name: "Toasters & Kettles",
            bid: 10.5,
            views: 9200,
            views_diff: 3.3,
            clicks: 460,
            clicks_diff: 2.7,
            cpc: 2.3,
            cpc_diff: -1.1,
            direct_orders: 27,
            direct_orders_diff: 3.8,
            indirect_orders: 9,
            indirect_orders_diff: 1.0,
            cost: 1058,
            cost_diff: 2.6,
            total_converted_revenue: 3400,
            total_converted_revenue_diff: 2.9,
            indirect_sales: 850,
            indirect_sales_diff: 0.9,
            acos: 31.1,
            acos_diff: -0.5,
            roi: 3.2,
            roi_diff: 1.4,
            roi_direct: 2.5,
            roi_direct_diff: 1.5,
            ctr: 5.0,
            ctr_diff: 0.6,
            cvr: 5.6,
            cvr_diff: 0.9,
            aov: 128,
            aov_diff: 0.4,
            ad_type: "Sponsored"
        },
        {
            id: 10,
            placement_type: "Category Listing",
            campaign_id: "CROMP010",
            campaign_name: "Crompton Premium Collection",
            ad_group_name: "Premium Fans",
            bid: 15.0,
            views: 12500,
            views_diff: 7.1,
            clicks: 680,
            clicks_diff: 5.2,
            cpc: 3.0,
            cpc_diff: 0.5,
            direct_orders: 40,
            direct_orders_diff: 6.3,
            indirect_orders: 18,
            indirect_orders_diff: 3.8,
            cost: 2040,
            cost_diff: 4.5,
            total_converted_revenue: 5000,
            total_converted_revenue_diff: 6.6,
            indirect_sales: 1350,
            indirect_sales_diff: 3.0,
            acos: 40.8,
            acos_diff: 1.3,
            roi: 2.5,
            roi_diff: 1.2,
            roi_direct: 2.0,
            roi_direct_diff: 1.4,
            ctr: 5.4,
            ctr_diff: 1.3,
            cvr: 5.9,
            cvr_diff: 1.6,
            aov: 125,
            aov_diff: 1.6,
            ad_type: "Banner"
        }
    ];

    const handleKeywordClick = async (keywordName, campaignId) => {
        try {
            const token = localStorage.getItem("accessToken");
            const startDate = formatDate(dateRange[0].startDate);
            const endDate = formatDate(dateRange[0].endDate);
            const params = new URLSearchParams({
                end_date: formatDate(endDate),
                platform: operator,
                campaign_id: campaignId,
                keyword: keywordName,
                start_date: formatDate(startDate),
            });
            const response = await fetch(`https://react-api-script.onrender.com/app/keyword-graph?${params.toString()}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json()
            if (response.ok) {
                setShowTrendsModal({ name: keywordName, show: true, data: data });
            } else {
                console.error("Failed to fetch campaign data");
            }
        } catch (error) {
            console.error("Error fetching campaign data", error);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleSnackbarOpen = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    return (
        <React.Fragment>
            <TrendsModal
                showTrendsModal={showTrendsModal}
                setShowTrendsModal={setShowTrendsModal} />
            <div className="shadow-box-con-keywords aggregated-view-con">
                <div className="datatable-con-keywords">
                    <MuiDataTableComponent
                        isLoading={isLoading}
                        isExport={true}
                        columns={KeywordsColumnFlipkart}
                        data={(keywordsData.data && keywordsData.data.length > 0) ? keywordsData.data : keywordsDummyData}
                    />
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

export default KeywordsComponent;