import React from "react";
import { PERFORMANCETABS } from "../../../lib/constant";

const TabList = ({ setValue, showActiveTab, setShowActiveTab, tabText }) => {
    return (
        <li className={showActiveTab === setValue ? 'active' : ''}
            onClick={() => setShowActiveTab(setValue)}>
            {tabText}
        </li>
    )
}

const TopTabs = (props) => {

    const { setShowActiveTab,
        showActiveTab,
        operatorName } = props;

    return (
        <React.Fragment>
            <div className="top-tabs-con">

                <ul>
                    {['Flipkart'].includes(operatorName) && <TabList
                        isShowCount={false}
                        tabText="Overview"
                        showActiveTab={showActiveTab}
                        setShowActiveTab={setShowActiveTab}
                        setValue={PERFORMANCETABS.OVERVIEW} />
                    }
                    {!['Flipkart'].includes(operatorName) &&
                        <TabList
                            isShowCount={true}
                            tabText="Portfolios"
                            showActiveTab={showActiveTab}
                            setShowActiveTab={setShowActiveTab}
                            setValue={PERFORMANCETABS.PORTFOLIOS} />
                    }
                    {['Flipkart'].includes(operatorName) &&
                        <TabList
                            isShowCount={true}
                            tabText="Campaigns"
                            showActiveTab={showActiveTab}
                            setShowActiveTab={setShowActiveTab}
                            setValue={PERFORMANCETABS.CAMPAIGNS} />
                    }
                    {!['Flipkart'].includes(operatorName) &&
                        <TabList
                            isShowCount={true}
                            tabText="Adgroups"
                            showActiveTab={showActiveTab}
                            setShowActiveTab={setShowActiveTab}
                            setValue={PERFORMANCETABS.ADGROUPS} />
                    }
                    {['Flipkart'].includes(operatorName) &&
                        <TabList
                            isShowCount={true}
                            tabText="Keywords"
                            showActiveTab={showActiveTab}
                            setShowActiveTab={setShowActiveTab}
                            setValue={PERFORMANCETABS.KEYWORDS} />
                    }
                    {['Flipkart'].includes(operatorName) &&
                        <TabList
                            isShowCount={true}
                            tabText="Products"
                            showActiveTab={showActiveTab}
                            setShowActiveTab={setShowActiveTab}
                            setValue={PERFORMANCETABS.PRODUCTS} />
                    }
                </ul>
            </div>
        </React.Fragment>
    )
}

export default TopTabs;