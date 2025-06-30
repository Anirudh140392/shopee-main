import React, { useEffect, useMemo, useState, useRef } from "react";
import MuiDataTableComponent from "../../common/muidatatableComponent";
import { useSearchParams } from "react-router-dom";

const HistoryDatatable = () => {

    const [historyData, setHistoryData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const [searchParams] = useSearchParams();
    const operator = searchParams.get("operator");

    const HistoryColumnsFlipkart = [
        { field: "date", headerName: "DATE", minWidth: 150 },
        { field: "time", headerName: "TIME", minWidth: 150 },
        { field: "campaign_name", headerName: "CAMPAIGN", minWidth: 250 },
        { field: "module", headerName: "MODULE", minWidth: 150 },
        { field: "type", headerName: "TYPE", minWidth: 150 },
        { field: "property", headerName: "PROPERTY", minWidth: 150 },
        { field: "from_value", headerName: "FROM", minWidth: 150 },
        { field: "to_value", headerName: "TO", minWidth: 150 },
        { field: "source", headerName: "SOURCE", minWidth: 150 },
        { field: "nature", headerName: "NATURE", minWidth: 150 },
        { field: "source_name", headerName: "SOURCE NAME", minWidth: 150 },
    ];

    const getHistoryData = async () => {
        if (!operator) return;

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        setIsLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) {
            console.error("No access token found");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`https://react-api-script.onrender.com/app/history?platform=${operator}`, {
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
            setHistoryData(data);
        } catch (error) {
            if (error.name === "AbortError") {
                console.log("Previous request aborted due to operator change.");
            } else {
                console.error("Failed to fetch keywords data:", error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            getHistoryData();
        }, 100);

        return () => {
            clearTimeout(timeout);
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [operator]);

    const abortControllerRef = useRef(null);

    return (
        <React.Fragment>
            <div className="datatable-con">
                <MuiDataTableComponent
                    isLoading={isLoading}
                    columns={HistoryColumnsFlipkart}
                    data={historyData?.data || []} />
            </div>
        </React.Fragment>
    )
}

export default HistoryDatatable;