import React, { useEffect } from "react";
import { useContext } from "react";
import OverviewFunnelChart from "./overview/overviewFunnelChart";
import MuiDataTableComponent from "../../common/muidatatableComponent";
import overviewContext from "../../../../store/overview/overviewContext";
import { useSearchParams } from "react-router";
import ColumnPercentageDataComponent from "../../common/columnPercentageDataComponent";
import GoalComponent from "./overview/goalComponent";
import ErrorBoundary from "../../common/erroBoundryComponent";

const OverviewComponent = () => {
    const dataContext = useContext(overviewContext)
    const { getOverviewData, dateRange, formatDate } = dataContext
    const [searchParams] = useSearchParams();
    const operator = searchParams.get("operator");

    const overviewData = {
        funnel: [
            {
                value: 1872939,
                name: "Impressions",
                fill: "#424A5F"
            },
            {
                value: 4524,
                name: "Clicks",
                fill: "#5A657C"
            },
            {
                value: 211,
                name: "Orders",
                fill: "#6B778F"
            },
        ],
        metrics_data: {
            Spend: 148642.84,
            Impressions: 1872939,
            Clicks: 4524,
            Orders: 211,
            Sales: 116812.66,
            ROI: 0.79
        },
        cat_table: [
            {
                id: 1,
                category: "Ceiling Fans",
                views: 622882,
                views_pct_change: 4.6,
                clicks: 1185,
                clicks_pct_change: 3.2,
                cpc: 28.55,
                cpc_pct_change: -1.2,
                cost: 33840,
                cost_pct_change: 3.9,
                total_converted_revenue: 38810,
                total_converted_revenue_pct_change: 5.7,
                roi: 1.15,
                roi_pct_change: 2.8,
                acos: 87.24,
                acos_pct_change: -2.3,
                aov: 475.3,
                aov_pct_change: 1.1
            },
            {
                id: 2,
                category: "Water Heaters",
                views: 275515,
                views_pct_change: -2.7,
                clicks: 832,
                clicks_pct_change: -1.5,
                cpc: 32.11,
                cpc_pct_change: 1.5,
                cost: 26720,
                cost_pct_change: -4.1,
                total_converted_revenue: 30980,
                total_converted_revenue_pct_change: -3.3,
                roi: 1.16,
                roi_pct_change: 1.2,
                acos: 86.27,
                acos_pct_change: 2.4,
                aov: 537.9,
                aov_pct_change: 0.6
            },
            {
                id: 3,
                category: "LED Lighting",
                views: 473142,
                views_pct_change: 1.3,
                clicks: 1025,
                clicks_pct_change: 2.6,
                cpc: 29.4,
                cpc_pct_change: -0.9,
                cost: 30150,
                cost_pct_change: 3.4,
                total_converted_revenue: 35240,
                total_converted_revenue_pct_change: 4.9,
                roi: 1.17,
                roi_pct_change: 2.0,
                acos: 85.5,
                acos_pct_change: -1.7,
                aov: 486.71,
                aov_pct_change: 1.4
            },
            {
                id: 4,
                category: "Kitchen Appliances",
                views: 501400,
                views_pct_change: -0.8,
                clicks: 1102,
                clicks_pct_change: 1.1,
                cpc: 33.25,
                cpc_pct_change: 1.0,
                cost: 36620,
                cost_pct_change: -1.8,
                total_converted_revenue: 39600,
                total_converted_revenue_pct_change: 1.2,
                roi: 1.08,
                roi_pct_change: 1.9,
                acos: 92.4,
                acos_pct_change: -1.1,
                aov: 506.7,
                aov_pct_change: 0.9
            }
        ],
        sub_cat_table: [
            {
                id: 1,
                sub_category: "Anti-Dust Fans",
                category: "Ceiling Fans",
                views: 322000,
                views_pct_change: 5.1,
                clicks: 615,
                clicks_pct_change: 3.9,
                cpc: 28.95,
                cpc_pct_change: -1.0,
                cost: 17920,
                cost_pct_change: 3.5,
                total_converted_revenue: 21040,
                total_converted_revenue_pct_change: 6.1,
                roi: 1.17,
                roi_pct_change: 3.1,
                acos: 85.2,
                acos_pct_change: -2.1,
                aov: 488.3,
                aov_pct_change: 1.3
            },
            {
                id: 2,
                sub_category: "Storage Geysers",
                category: "Water Heaters",
                views: 142800,
                views_pct_change: -3.1,
                clicks: 420,
                clicks_pct_change: -1.7,
                cpc: 33.45,
                cpc_pct_change: 1.7,
                cost: 14040,
                cost_pct_change: -4.4,
                total_converted_revenue: 16600,
                total_converted_revenue_pct_change: -3.1,
                roi: 1.18,
                roi_pct_change: 1.5,
                acos: 84.6,
                acos_pct_change: 2.1,
                aov: 528.2,
                aov_pct_change: 0.5
            },
            {
                id: 3,
                sub_category: "LED Bulbs",
                category: "LED Lighting",
                views: 228940,
                views_pct_change: 2.0,
                clicks: 525,
                clicks_pct_change: 2.9,
                cpc: 28.2,
                cpc_pct_change: -1.1,
                cost: 14790,
                cost_pct_change: 3.8,
                total_converted_revenue: 17430,
                total_converted_revenue_pct_change: 5.0,
                roi: 1.18,
                roi_pct_change: 2.3,
                acos: 84.9,
                acos_pct_change: -1.6,
                aov: 466.5,
                aov_pct_change: 1.6
            },
            {
                id: 4,
                sub_category: "Toasters",
                category: "Kitchen Appliances",
                views: 262400,
                views_pct_change: -0.9,
                clicks: 598,
                clicks_pct_change: 1.3,
                cpc: 33.45,
                cpc_pct_change: 1.2,
                cost: 20030,
                cost_pct_change: -2.0,
                total_converted_revenue: 21900,
                total_converted_revenue_pct_change: 1.4,
                roi: 1.09,
                roi_pct_change: 2.0,
                acos: 91.4,
                acos_pct_change: -1.2,
                aov: 503.3,
                aov_pct_change: 1.0
            }
        ],
        graph: [
            {
                date: "2025-05-10",
                spend_inr: 16286.04,
                impressions: 183786,
                sales_inr: 17987.29,
                orders: 29,
                clicks: 444,
                cpm: 88.61,
                aov: 620.25,
                acos: 90.54,
                ctr: 0.24,
                roas: 1.1,
                cpc: 36.68,
                id: 1
            }
        ]
    }
    const CategoryColumns = [
        { field: "category", headerName: "CATEGORY", minWidth: 200 },
        {
            field: "views",
            headerName: "IMPRESSIONS",
            minWidth: 200,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.views} percentValue={params.row.views_pct_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "views_pct_change",
            headerName: "IMPRESSIONS % CHANGE",
            hideable: false
        },
        {
            field: "clicks",
            headerName: "CLICKS",
            minWidth: 200,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.clicks} percentValue={params.row.clicks_pct_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "clicks_pct_change",
            headerName: "CLICKS % CHANGE",
            hideable: false
        },
        {
            field: "cpc",
            headerName: "CPC",
            minWidth: 200,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.cpc} percentValue={params.row.cpc_pct_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "cpc_pct_change",
            headerName: "CPC % CHANGE",
            hideable: false
        },
        {
            field: "cost",
            headerName: "SPENDS",
            minWidth: 200,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.cost} percentValue={params.row.cost_pct_change} />
            ), type: "number", align: "left",
            headerAlign: "left",

        },
        {
            field: "cost_pct_change",
            headerName: "SPENDS % CHANGE",
            hideable: false
        },
        {
            field: "total_converted_revenue",
            headerName: "SALES",
            minWidth: 200,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.total_converted_revenue} percentValue={params.row.total_converted_revenue_pct_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "total_converted_revenue_pct_change",
            headerName: "SALES % CHANGE",
            hideable: false
        },
        {
            field: "roi",
            headerName: "ROAS",
            minWidth: 200,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.roi} percentValue={params.row.roi_pct_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "roi_pct_change",
            headerName: "ROAS % CHANGE",
            hideable: false
        },
        {
            field: "acos",
            headerName: "ACOS",
            minWidth: 200,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.acos} percentValue={params.row.acos_pct_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "acos_pct_change",
            headerName: "ACOS % CHANGE",
            hideable: false
        },
        {
            field: "aov",
            headerName: "AOV",
            minWidth: 200,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.aov} percentValue={params.row.aov_pct_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "aov_pct_change",
            headerName: "AOV % CHANGE",
            hideable: false
        },
    ]

    const SubCategoryColumns = [
        { field: "sub_category", headerName: "SUBCATEGORY", minWidth: 200 },
        { field: "category", headerName: "CATEGORY", minWidth: 200 },
        {
            field: "views",
            headerName: "IMPRESSIONS",
            minWidth: 200,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.views} percentValue={params.row.views_pct_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "views_pct_change",
            headerName: "IMPRESSIONS % CHANGE",
            hideable: false
        },
        {
            field: "clicks",
            headerName: "CLICKS",
            minWidth: 200,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.clicks} percentValue={params.row.clicks_pct_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "clicks_pct_change",
            headerName: "CLICKS % CHANGE",
            hideable: false
        },
        {
            field: "cpc",
            headerName: "CPC",
            minWidth: 200,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.cpc} percentValue={params.row.cpc_pct_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "cpc_pct_change",
            headerName: "CPC % CHANGE",
            hideable: false
        },
        {
            field: "cost",
            headerName: "SPENDS",
            minWidth: 200,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.cost} percentValue={params.row.cost_pct_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "cost_pct_change",
            headerName: "SPENDS % CHANGE",
            hideable: false
        },
        {
            field: "total_converted_revenue",
            headerName: "SALES",
            minWidth: 200,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.total_converted_revenue} percentValue={params.row.total_converted_revenue_pct_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "total_converted_revenue_pct_change",
            headerName: "SALES % CHANGE",
            hideable: false
        },
        {
            field: "acos",
            headerName: "ACOS",
            minWidth: 200,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.acos} percentValue={params.row.acos_pct_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "acos_pct_change",
            headerName: "ACOS % CHANGE",
            hideable: false
        },
        {
            field: "roi",
            headerName: "ROAS",
            minWidth: 200,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.roi} percentValue={params.row.roi_pct_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "roi_pct_change",
            headerName: "ROAS % CHANGE",
            hideable: false
        },
        {
            field: "aov",
            headerName: "AOV",
            minWidth: 200,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.aov} percentValue={params.row.aov_pct_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "aov_pct_change",
            headerName: "AOV % CHANGE",
            hideable: false
        },
    ]

    useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            getOverviewData();
        }
    }, [operator, dateRange, getOverviewData]);

    const CTRWidget = ({ firstHeadingText, firstHeadingData, secondHeadingText, secondHeadingData, isSecondHeadingRequired = true }) => {
        return (
            <div className="ctr-card-main-con">
                <div className="card-body">
                    <div className="d-flex justify-content-between">
                        <div>
                            <h5 className="card-title text-aqua">{firstHeadingText}</h5>
                            <h3 className="mb-0">{firstHeadingData}</h3>
                        </div>
                        {isSecondHeadingRequired &&
                            <div>
                                <h5 className="card-title text-peach">{secondHeadingText}</h5>
                                <h3 className="mb-0">{secondHeadingData}</h3>
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }

    function toMillions(num) {
        return (num / 1_000_000).toFixed(2) + "M";
    }

    function toThousands(num) {
        return (num / 1_000).toFixed(2) + "K";
    }

    const daysDifference = () => {
        if (!dateRange?.length) return 0;
        const startDate = new Date(dateRange[0].startDate);
        const endDate = new Date(dateRange[0].endDate);
        const diff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
        return diff === 6 ? diff + 1 : diff;
    }

    const filteredCatData = overviewData?.cat_table?.filter(row => row.category?.trim() !== '');
    const filteredSubCatData = overviewData?.sub_cat_table?.filter(row => row.sub_category?.trim() !== '');

    return (
        <React.Fragment>
            <div className="shadow-box-con top-overview-con">
                <div className="row">
                    <div className="col-xl-4 col-lg-4 d-md-flex flex-md-column">
                        <div className="svg-data-filter-con">
                            <p>
                                Compared to {daysDifference} days ago.{" "}
                                {`${formatDate(dateRange[0].startDate)}-`}
                                <br />
                                {`${formatDate(dateRange[0].endDate)}`}
                            </p>

                        </div>
                        <OverviewFunnelChart data={overviewData?.funnel} />
                    </div>
                    <div className="col-lg-8">
                        <div className="row">
                            <div className="col-md-4">
                                <CTRWidget
                                    firstHeadingText="Impressions"
                                    firstHeadingData={`${overviewData?.metrics_data?.Impressions ? toMillions(overviewData?.metrics_data?.Impressions) : "-"}`}
                                    secondHeadingText="Clicks"
                                    secondHeadingData={`${overviewData?.metrics_data?.Clicks ? toThousands(overviewData?.metrics_data?.Clicks) : "-"}`} />
                            </div>
                            <div className="col-md-4">
                                <CTRWidget
                                    firstHeadingText="Spends"
                                    firstHeadingData={`${overviewData?.metrics_data?.Spend ? toMillions(overviewData?.metrics_data?.Spend) : "-"}`}
                                    secondHeadingText="Sales"
                                    secondHeadingData={`${overviewData?.metrics_data?.Sales ? toMillions(overviewData?.metrics_data?.Sales) : "-"}`} />
                            </div>
                            <div className="col-md-4">
                                <CTRWidget
                                    firstHeadingText="Orders"
                                    firstHeadingData={`${overviewData?.metrics_data?.Orders ? toThousands(overviewData?.metrics_data?.Orders) : "-"}`}
                                    secondHeadingText="ROAS"
                                    secondHeadingData={`${overviewData?.metrics_data?.ROI ? overviewData?.metrics_data?.ROI : "-"}`} />
                            </div>
                        </div>
                        <div className="agrregated-shadow-box-con aggregated-view-con mt-4">
                            <div className="px-3 py-2 border-bottom">
                                <div className="row">
                                    <div className="col-lg-6">
                                        <h5 className="mb-0">Category View</h5>
                                    </div>
                                </div>
                                <div>
                                </div>
                            </div>
                            <div className="datatable-con-overview">
                                <MuiDataTableComponent
                                    isExport={true}
                                    columns={CategoryColumns}
                                    data={filteredCatData} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="agrregated-shadow-box-con aggregated-view-con">
                <div className="px-3 py-2 border-bottom">
                    <div className="row">
                        <div className="col-lg-6">
                            <h5 className="mb-0">Subcategory View</h5>
                        </div>
                    </div>
                    <div>
                    </div>
                </div>
                <div className="datatable-con-overview">
                    <MuiDataTableComponent
                        isExport={true}
                        columns={SubCategoryColumns}
                        data={filteredSubCatData} />
                </div>
            </div>
            <ErrorBoundary>
                <GoalComponent />
            </ErrorBoundary>
        </React.Fragment>
    )
}

export default OverviewComponent;