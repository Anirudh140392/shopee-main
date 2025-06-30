import React from "react";
import { ResponsivePie } from '@nivo/pie'

const PieChartComponent = (props) => {

    const { data } = props;

    return (
        <React.Fragment>
            <ResponsivePie
                data={data}
                margin={{ top: 40, right: 10, bottom: 80, left: 10 }}
                innerRadius={0.5}
                padAngle={2}
                cornerRadius={5}
                activeOuterRadiusOffset={8}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor="#ffffff"
                legends={[
                    {
                        anchor: 'bottom',
                        direction: 'row',
                        translateY: 56,
                        itemWidth: 100,
                        itemHeight: 18,
                        symbolShape: 'circle'
                    }
                ]}
                enableArcLinkLabels={false}
                colors={{ datum: 'data.color' }}
            />
        </React.Fragment>
    )
}

export default PieChartComponent;