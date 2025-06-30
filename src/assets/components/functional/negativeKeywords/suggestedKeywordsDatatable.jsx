import React, { useEffect, useContext, useState, useRef } from "react";
import MuiDataTableComponent from "../../common/muidatatableComponent";
import '../../../styles/keywordsComponent/keywordsComponent.less';
import { Typography, Snackbar, Alert, CircularProgress } from "@mui/material";
import overviewContext from "../../../../store/overview/overviewContext";
import { useSearchParams } from "react-router";
import ColumnPercentageDataComponent from "../../common/columnPercentageDataComponent";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const SuggestedKeywordsDatatable = () => {

    const { dateRange, formatDate } = useContext(overviewContext)

    const [keywordsData, setKeywordsData] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [loadingRows, setLoadingRows] = useState({});

    const [searchParams] = useSearchParams();
    const operator = searchParams.get("operator");

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
            const response = await fetch(`https://react-api-script.onrender.com/app/negativeKeyword?platform=${operator}&start_date=${startDate}&end_date=${endDate}`, {
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
    }, [operator, dateRange]);

    const handleAddNegativeKeyword = async (row) => {
        const token = localStorage.getItem("accessToken");
        const uniqueKey = row.query + row.campaign_id;

        if (!token) {
            handleSnackbarOpen("Access token missing", "error");
            return;
        }

        setLoadingRows(prev => ({ ...prev, [uniqueKey]: true }));

        const payload = {
            platform: operator,
            campaign_id: row.campaign_id,
            query: row.query
        };

        try {
            const response = await fetch(`https://react-api-script.onrender.com/app/update-exsisting-negative-keyword`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            handleSnackbarOpen("Keyword added as negative successfully!", "success");

            setKeywordsData(prev => ({
                ...prev,
                data: prev.data.filter(
                    item => !(item.query === row.query && item.campaign_id === row.campaign_id)
                )
            }));

        } catch (error) {
            console.error("Failed to update keyword:", error.message);
            handleSnackbarOpen("Failed to add keyword as negative", "error");
        } finally {
            setLoadingRows(prev => {
                const updated = { ...prev };
                delete updated[uniqueKey];
                return updated;
            });
        }
    };

    const SuggestedKeywordsColumnFlipkart = [
        {
            field: "query",
            headerName: "SEARCH TERM",
            minWidth: 150,
            renderCell: (params) => (
                <div className="text-icon-div cursor-pointer redirect" onClick={() => handleKeywordClick(params.row.query, params.row.campaign_id)}>
                    <Typography variant="body2">{params.row.query}</Typography>
                </div>
            ),
        },
        {
            field: "add_negative",
            headerName: "ADD NEGATIVE",
            minWidth: 150,
            renderCell: (params) => {
                const uniqueKey = params.row.query + params.row.campaign_id;
                const isLoading = loadingRows[uniqueKey];

                return (
                    <div className="cursor-pointer">
                        {isLoading ? (
                            <CircularProgress size={20} />
                        ) : (
                            <AddCircleOutlineIcon color="error" onClick={() => handleAddNegativeKeyword(params.row)} />
                        )}
                    </div>
                );
            },
            align: "center"
        },
        {
            field: "ad_group_name",
            headerName: "AD GROUP",
            minWidth: 150,
        },
        { field: "ad_type", headerName: "AD TYPE", minWidth: 150 },
        {
            field: "campaign_name",
            headerName: "CAMPAIGN NAME",
            minWidth: 200,
        },
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
        },
        {
            field: "total_converted_revenue",
            headerName: "SALES",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.total_converted_revenue} percentValue={params.row.total_converted_revenue_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "total_converted_revenue_diff",
            headerName: "SALES % CHANGE",
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
            <div className="shadow-box-con-keywords aggregated-view-con">
                <div className="datatable-con-negative-keywords">
                    <MuiDataTableComponent
                        isLoading={isLoading}
                        isExport={true}
                        columns={SuggestedKeywordsColumnFlipkart}
                        data={keywordsData.data || []} />
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

export default SuggestedKeywordsDatatable;