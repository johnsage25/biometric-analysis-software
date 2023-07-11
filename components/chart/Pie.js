import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import dynamic from 'next/dynamic';

const Pie = dynamic(() => import('@ant-design/plots').then(({ Pie }) => Pie),
  { ssr: false }
);


const PieChart = ({data}) => {


  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    height: 320,
    innerRadius: 0.6,
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}',
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        // content: 'AntV\nG2Plot',
      },
    },
  };
  return <Pie {...config} />;
};

export default PieChart