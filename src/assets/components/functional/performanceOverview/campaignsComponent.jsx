import React, { useContext, useState, useEffect, useMemo, useRef } from "react";
import MuiDataTableComponent from "../../common/muidatatableComponent";
import '../../../styles/campaignsComponent/campaignsComponent.less';
import overviewContext from "../../../../store/overview/overviewContext";
import { Switch, Box, Button, Snackbar, Alert } from "@mui/material";
import { Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress } from "@mui/material";
import { useSearchParams } from "react-router";
import ColumnPercentageDataComponent from "../../common/columnPercentageDataComponent";
import TrendsModal from "./modal/trendsModal";
import BudgetCell from "./overview/budgetCell";

const CampaignsComponent = () => {

    const dataContext = useContext(overviewContext)
    const { dateRange, formatDate } = dataContext

    const [updatingCampaigns, setUpdatingCampaigns] = useState({});
    const [showTrendsModal, setShowTrendsModal] = useState({ name: '', show: false, date: [] })
    const [campaignsData, setCampaignsData] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [confirmation, setConfirmation] = useState({ show: false, campaignId: null, newStatus: null, brandId: null });
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const [searchParams] = useSearchParams();
    const operator = searchParams.get("operator");

    const STATUS_OPTIONS = [
        { value: 1, label: 'Active' },
        { value: 0, label: 'Paused' }
    ]

    const CampaignsColumnFlipkart = [
        {
            field: "campaign_name_y",
            headerName: "CAMPAIGN",
            minWidth: 200,
            renderCell: (params) => (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                        cursor: "pointer"
                    }}
                    onClick={() => handleCampaignClick(params.row.campaign_name_y, params.row.campaign_id)}
                    className="redirect"
                >
                    {params.row.campaign_name_y}
                </Box>
            ),
        },
        {
            field: "campaign_budget_y",
            headerName: "BUDGET",
            minWidth: 200,
            renderCell: (params) => <BudgetCell status={params.row.campaign_status} value={params.row.campaign_budget_y} campaignId={params.row.campaign_id} endDate={params.row.end_date || null} platform={operator}
                onUpdate={(campaignId, newBudget) => {
                    console.log("Updating campaign:", campaignId, "New budget:", newBudget);
                    setCampaignsData(prevData => {
                        const updatedData = {
                            ...prevData,
                            data: prevData.data.map(campaign =>
                                campaign.campaign_id === campaignId
                                    ? { ...campaign, campaign_budget_y: newBudget }
                                    : campaign
                            )
                        };
                        console.log("Updated campaignsData:", updatedData);
                        return updatedData;
                    });
                }} onSnackbarOpen={handleSnackbarOpen} />,
            headerAlign: "left",
            type: "number", align: "left",
        },
        {
            field: "remaining_budget",
            headerName: "REMAINING BUDGET",
            minWidth: 150,
        },
        {
            field: "campaign_status",
            headerName: "STATUS",
            minWidth: 100,
        },
        {
            field: "status",
            headerName: "PLAY/ PAUSE",
            minWidth: 100,
            renderCell: (params) => {
                if (updatingCampaigns[params.row.campaign_id]) {
                    return <Box sx={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}><CircularProgress size={24} /></Box>;
                }
                return (
                    <Switch
                        disabled={params.row.campaign_status === "ABORTED"}
                        checked={params.row.status === 1}
                        onChange={() => handleToggle(params.row.campaign_id, params.row.status === 1 ? 1 : 0, null)}
                    />
                )
            },
            type: "singleSelect",
            valueOptions: STATUS_OPTIONS
        },
        {
            field: "ad_type",
            headerName: "AD TYPE",
            minWidth: 100,
        },
        {
            field: "category",
            headerName: "CATEGORY",
            minWidth: 150,
        },
        {
            field: "sub_category",
            headerName: "SUB CATEGORY",
            minWidth: 150,
        },
        {
            field: "views_y",
            headerName: "IMPRESSIONS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.views_y} percentValue={params.row.views_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "views_diff",
            headerName: "IMPRESSIONS % CHANGE",
            hideable: false
        },
        {
            field: "clicks_y",
            headerName: "CLICKS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.clicks_y} percentValue={params.row.clicks_diff} />
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
            field: "total_converted_units_y",
            headerName: "ORDERS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.total_converted_units_y} percentValue={params.row.total_converted_units_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "total_converted_units_diff",
            headerName: "ORDERS % CHANGE",
            hideable: false
        },
        {
            field: "cost_y",
            headerName: "SPENDS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.cost_y} percentValue={params.row.cost_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "cost_diff",
            headerName: "SPENDS % CHANGE",
            hideable: false
        },
        {
            field: "total_converted_revenue_y",
            headerName: "SALES",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.total_converted_revenue_y} percentValue={params.row.total_converted_revenue_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "total_converted_revenue_diff",
            headerName: "SALES % CHANGE",
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
            field: "roi_y",
            headerName: "ROAS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.roi_y} percentValue={params.row.roi_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "roi_diff",
            headerName: "ROAS % CHANGE",
            hideable: false
        },
        {
            field: "ctr_y",
            headerName: "CTR",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.ctr_y} percentValue={params.row.ctr_diff} />
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
    ];

    const dummyCampaignsData = [
        {
            id: 1,
            campaign_id: 201,
            campaign_name_y: "Crompton Summer Coolers",
            campaign_budget_y: 50000,
            remaining_budget: 25000,
            campaign_status: "ACTIVE",
            status: 1,
            ad_type: "Sponsored",
            category: "Home Appliances",
            sub_category: "Ceiling Fans",
            views_y: 100000,
            views_diff: 10,
            clicks_y: 8000,
            clicks_diff: 12,
            cpc: 6.5,
            cpc_diff: -5,
            total_converted_units_y: 200,
            total_converted_units_diff: 8,
            cost_y: 48000,
            cost_diff: 15,
            total_converted_revenue_y: 120000,
            total_converted_revenue_diff: 20,
            acos: 40,
            acos_diff: -10,
            roi_y: 2.5,
            roi_diff: 12,
            ctr_y: 8.0,
            ctr_diff: 1.5,
            cvr: 2.5,
            cvr_diff: 0.5,
            aov: 600,
            aov_diff: 10,
            end_date: "2025-06-30"
        },
        {
            id: 2,
            campaign_id: 202,
            campaign_name_y: "Crompton Monsoon Offers",
            campaign_budget_y: 30000,
            remaining_budget: 15000,
            campaign_status: "ACTIVE",
            status: 0,
            ad_type: "Banner",
            category: "Home Appliances",
            sub_category: "Wall Fans",
            views_y: 50000,
            views_diff: 5,
            clicks_y: 3500,
            clicks_diff: -3,
            cpc: 4.2,
            cpc_diff: 2,
            total_converted_units_y: 120,
            total_converted_units_diff: -1,
            cost_y: 18000,
            cost_diff: 10,
            total_converted_revenue_y: 60000,
            total_converted_revenue_diff: 5,
            acos: 30,
            acos_diff: 1,
            roi_y: 3.0,
            roi_diff: 0,
            ctr_y: 7.0,
            ctr_diff: -1.2,
            cvr: 3.2,
            cvr_diff: 0.3,
            aov: 500,
            aov_diff: 5,
            end_date: "2025-07-15"
        },
        {
            id: 3,
            campaign_id: 203,
            campaign_name_y: "Crompton Style Fans",
            campaign_budget_y: 40000,
            remaining_budget: 30000,
            campaign_status: "PAUSED",
            status: 0,
            ad_type: "Sponsored",
            category: "Home Appliances",
            sub_category: "Designer Fans",
            views_y: 75000,
            views_diff: 8,
            clicks_y: 5200,
            clicks_diff: 10,
            cpc: 5.1,
            cpc_diff: 3,
            total_converted_units_y: 190,
            total_converted_units_diff: 9,
            cost_y: 30000,
            cost_diff: 14,
            total_converted_revenue_y: 90000,
            total_converted_revenue_diff: 17,
            acos: 33,
            acos_diff: -2,
            roi_y: 3.0,
            roi_diff: 4,
            ctr_y: 6.5,
            ctr_diff: 2.5,
            cvr: 2.8,
            cvr_diff: 0.6,
            aov: 550,
            aov_diff: 7,
            end_date: "2025-06-28"
        },
        {
            id: 4,
            campaign_id: 204,
            campaign_name_y: "Crompton Daily Breeze",
            campaign_budget_y: 25000,
            remaining_budget: 5000,
            campaign_status: "ABORTED",
            status: 0,
            ad_type: "Banner",
            category: "Home Appliances",
            sub_category: "Table Fans",
            views_y: 60000,
            views_diff: 6,
            clicks_y: 4500,
            clicks_diff: -2,
            cpc: 3.0,
            cpc_diff: 1,
            total_converted_units_y: 150,
            total_converted_units_diff: -5,
            cost_y: 23000,
            cost_diff: 9,
            total_converted_revenue_y: 50000,
            total_converted_revenue_diff: -4,
            acos: 45,
            acos_diff: 3,
            roi_y: 2.1,
            roi_diff: -1,
            ctr_y: 7.5,
            ctr_diff: 0.5,
            cvr: 3.3,
            cvr_diff: 0.1,
            aov: 470,
            aov_diff: -3,
            end_date: "2025-06-10"
        },
        {
            id: 5,
            campaign_id: 205,
            campaign_name_y: "Crompton Appliance Offers",
            campaign_budget_y: 80000,
            remaining_budget: 40000,
            campaign_status: "ACTIVE",
            status: 1,
            ad_type: "Sponsored",
            category: "Home Appliances",
            sub_category: "Pedestal Fans",
            views_y: 120000,
            views_diff: 12,
            clicks_y: 9500,
            clicks_diff: 11,
            cpc: 7.0,
            cpc_diff: -1,
            total_converted_units_y: 300,
            total_converted_units_diff: 10,
            cost_y: 75000,
            cost_diff: 13,
            total_converted_revenue_y: 150000,
            total_converted_revenue_diff: 22,
            acos: 50,
            acos_diff: -4,
            roi_y: 2.0,
            roi_diff: 5,
            ctr_y: 7.9,
            ctr_diff: 1.3,
            cvr: 3.0,
            cvr_diff: 0.4,
            aov: 600,
            aov_diff: 12,
            end_date: "2025-07-01"
        },
        {
            id: 6,
            campaign_id: 206,
            campaign_name_y: "Crompton Glam Fans",
            campaign_budget_y: 20000,
            remaining_budget: 10000,
            campaign_status: "ACTIVE",
            status: 1,
            ad_type: "Banner",
            category: "Home Appliances",
            sub_category: "Decorative Fans",
            views_y: 30000,
            views_diff: 2,
            clicks_y: 2000,
            clicks_diff: 1,
            cpc: 3.5,
            cpc_diff: 0,
            total_converted_units_y: 80,
            total_converted_units_diff: -1,
            cost_y: 18000,
            cost_diff: 5,
            total_converted_revenue_y: 32000,
            total_converted_revenue_diff: 3,
            acos: 35,
            acos_diff: 0,
            roi_y: 2.8,
            roi_diff: -1,
            ctr_y: 6.7,
            ctr_diff: -0.5,
            cvr: 2.4,
            cvr_diff: -0.2,
            aov: 400,
            aov_diff: 0,
            end_date: "2025-06-25"
        },
        {
            id: 7,
            campaign_id: 207,
            campaign_name_y: "Crompton Laptop Cooling Fans",
            campaign_budget_y: 90000,
            remaining_budget: 60000,
            campaign_status: "ACTIVE",
            status: 1,
            ad_type: "Sponsored",
            category: "Accessories",
            sub_category: "Cooling Pads",
            views_y: 130000,
            views_diff: 14,
            clicks_y: 11000,
            clicks_diff: 12,
            cpc: 8.0,
            cpc_diff: 1,
            total_converted_units_y: 280,
            total_converted_units_diff: 9,
            cost_y: 85000,
            cost_diff: 10,
            total_converted_revenue_y: 200000,
            total_converted_revenue_diff: 30,
            acos: 42,
            acos_diff: -5,
            roi_y: 2.3,
            roi_diff: 4,
            ctr_y: 8.1,
            ctr_diff: 1.7,
            cvr: 2.6,
            cvr_diff: 0.3,
            aov: 715,
            aov_diff: 15,
            end_date: "2025-06-29"
        },
        {
            id: 8,
            campaign_id: 208,
            campaign_name_y: "Crompton Silent Fans",
            campaign_budget_y: 15000,
            remaining_budget: 5000,
            campaign_status: "PAUSED",
            status: 0,
            ad_type: "Banner",
            category: "Home Appliances",
            sub_category: "Noise-Free Fans",
            views_y: 20000,
            views_diff: -1,
            clicks_y: 1200,
            clicks_diff: -2,
            cpc: 2.8,
            cpc_diff: 1,
            total_converted_units_y: 70,
            total_converted_units_diff: -3,
            cost_y: 14000,
            cost_diff: 8,
            total_converted_revenue_y: 21000,
            total_converted_revenue_diff: -1,
            acos: 45,
            acos_diff: 2,
            roi_y: 1.5,
            roi_diff: -2,
            ctr_y: 6.0,
            ctr_diff: -1.0,
            cvr: 2.1,
            cvr_diff: 0.1,
            aov: 300,
            aov_diff: -2,
            end_date: "2025-06-22"
        },
        {
            id: 9,
            campaign_id: 209,
            campaign_name_y: "Crompton Kitchen Breeze",
            campaign_budget_y: 40000,
            remaining_budget: 15000,
            campaign_status: "ACTIVE",
            status: 1,
            ad_type: "Sponsored",
            category: "Kitchen Appliances",
            sub_category: "Exhaust Fans",
            views_y: 67000,
            views_diff: 3,
            clicks_y: 5100,
            clicks_diff: 6,
            cpc: 4.9,
            cpc_diff: 2,
            total_converted_units_y: 150,
            total_converted_units_diff: 4,
            cost_y: 37000,
            cost_diff: 7,
            total_converted_revenue_y: 90000,
            total_converted_revenue_diff: 10,
            acos: 39,
            acos_diff: -1,
            roi_y: 2.4,
            roi_diff: 2,
            ctr_y: 7.6,
            ctr_diff: 1.2,
            cvr: 2.9,
            cvr_diff: 0.4,
            aov: 600,
            aov_diff: 9,
            end_date: "2025-07-05"
        },
        {
            id: 10,
            campaign_id: 210,
            campaign_name_y: "Crompton Premium Fans",
            campaign_budget_y: 100000,
            remaining_budget: 40000,
            campaign_status: "ACTIVE",
            status: 1,
            ad_type: "Banner",
            category: "Home Appliances",
            sub_category: "Luxury Fans",
            views_y: 145000,
            views_diff: 9,
            clicks_y: 10000,
            clicks_diff: 8,
            cpc: 9.2,
            cpc_diff: -1,
            total_converted_units_y: 320,
            total_converted_units_diff: 13,
            cost_y: 92000,
            cost_diff: 15,
            total_converted_revenue_y: 250000,
            total_converted_revenue_diff: 25,
            acos: 36,
            acos_diff: -3,
            roi_y: 2.7,
            roi_diff: 6,
            ctr_y: 6.9,
            ctr_diff: 1.4,
            cvr: 3.5,
            cvr_diff: 0.5,
            aov: 780,
            aov_diff: 18,
            end_date: "2025-07-10"
        }
    ];

    const getCampaignsData = async () => {
        if (!operator) return;

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        setCampaignsData({});
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
            const response = await fetch(`https://react-api-script.onrender.com/app/campaign?start_date=${startDate}&end_date=${endDate}&platform=${operator}`, {
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
            setCampaignsData(data);
        } catch (error) {
            if (error.name === "AbortError") {
                console.log("Previous request aborted due to operator change.");
            } else {
                console.error("Failed to fetch keywords data:", error.message);
                setCampaignsData({});
            }
        } finally {
            setIsLoading(false);
        }
    };

    const abortControllerRef = useRef(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            getCampaignsData();
        }, 100);

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            clearTimeout(timeout);
        }
    }, [operator, dateRange]);

    const handleCampaignClick = async (campaignName, campaignId) => {
        try {
            const token = localStorage.getItem("accessToken");
            const startDate = formatDate(dateRange[0].startDate);
            const endDate = formatDate(dateRange[0].endDate);
            const response = await fetch(`https://react-api-script.onrender.com/app/campaign-graph?end_date=${formatDate(endDate)}&platform=${operator}&campaign_id=${campaignId}&&start_date=${formatDate(startDate)}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json()
            if (response.ok) {
                setShowTrendsModal({ name: campaignName, show: true, data: data });
            } else {
                console.error("Failed to fetch campaign data");
            }
        } catch (error) {
            console.error("Error fetching campaign data", error);
        }
    };

    const handleToggle = (campaignId, currentStatus, brandId) => {
        setConfirmation({ show: true, campaignId, newStatus: currentStatus ? 0 : 1, brandId });
    };

    const updateCampaignStatus = (campaignId, newStatus) => {
        setCampaignsData(prevData => ({
            ...prevData,
            data: prevData.data.map(campaign =>
                campaign.campaign_id === campaignId ? { ...campaign, status: newStatus } : campaign
            )
        }));
    };

    const confirmStatusChange = async () => {
        setConfirmation({ show: false, campaignId: null, newStatus: null, brandId: null });
        const { campaignId, newStatus, brandId } = confirmation;
        if (!campaignId) return;
        setUpdatingCampaigns(prev => ({ ...prev, [campaignId]: true }));

        try {
            const token = localStorage.getItem("accessToken");
            if (!token) throw new Error("No access token found");

            const response = await fetch('https://react-api-script.onrender.com/app/action', {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    platform: operator,
                    campaign_id: campaignId.toString(),
                    status_id: newStatus.toString(),
                    brand_id: brandId
                })
            });

            if (!response.ok) throw new Error("Failed to update campaign status");
            updateCampaignStatus(campaignId, newStatus);
            handleSnackbarOpen("Status updated successfully!", "success");
        } catch (error) {
            console.error("Error updating campaign status:", error);
            handleSnackbarOpen("Failed to update status!", "error");
        } finally {
            setUpdatingCampaigns(prev => {
                const newState = { ...prev };
                delete newState[campaignId];
                return newState;
            });
        }
    };

    const handleSnackbarOpen = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <React.Fragment>
            <Dialog open={confirmation.show} onClose={() => setConfirmation({ show: false, campaignId: null, newStatus: null, brandId: null })}>
                <DialogTitle>Confirm Status Change</DialogTitle>
                <DialogContent>Are you sure you want to {confirmation.newStatus ? "activate" : "pause"} this campaign?</DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmation({ show: false, campaignId: null, newStatus: null, brandId: null })}>Cancel</Button>
                    <Button onClick={confirmStatusChange} color="primary">Confirm</Button>
                </DialogActions>
            </Dialog>
            <TrendsModal
                showTrendsModal={showTrendsModal}
                setShowTrendsModal={setShowTrendsModal} />
            <div className="shadow-box-con-campaigns aggregated-view-con">
                <div className="datatable-con-campaigns">
                    <MuiDataTableComponent
                        isLoading={isLoading}
                        isExport={true}
                        columns={CampaignsColumnFlipkart}
                        data={(campaignsData.data && campaignsData.data.length > 0) ? campaignsData.data : dummyCampaignsData}
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

export default CampaignsComponent;