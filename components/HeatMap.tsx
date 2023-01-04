import { HEAT_MAP_GRADIENT, PRIMARY_BLUE } from '../themes/colors';
import VecktaAlert from './VecktaAlert';
import React from 'react';

interface Props {
  data: number[];
  unit: string;
  useLargeFont?: boolean;
  fileName?: string;
  supplierView?: boolean;
}

/**
 * Renders 8760 data in an 2.5D SVG format (colors give us the extra 0.5D). Each hour of the year is assigned a color
 * based on its scaled value. The right vertical axis shows the range from minimum to maximum values.
 *
 * @param data An array of 8760 numbers
 * @param unit The unit of the data (e.g. kW or MWh)
 * @returns {JSX.Element} The react wrapped SVG component
 */
export default function HeatMap({
  data,
  unit = '',
  useLargeFont = false,
  fileName,
  supplierView = false,
}: Props) {
  const formatter = new Intl.NumberFormat('en-US');
  const colors = HEAT_MAP_GRADIENT;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const mid = (max + min) / 2;
  const firstQuarter = (mid + min) / 2;
  const thirdQuarter = (mid + max) / 2;

  if (isNaN(min) || isNaN(max)) {
    if (supplierView) return null;
    return (
      <VecktaAlert severity='error' sx={{ mt: 1 }}>
        {fileName ? (
          <>
            There was an error processing the data for <b>{fileName}</b>. Most likely the file
            contains non numerical data.
          </>
        ) : (
          'There was an error processing the data for the provided file. Most likely the file contains non numerical data.'
        )}
      </VecktaAlert>
    );
  }

  const c = data.map((element) => {
    const scalar = `${((element - min) / (max - min)) * 255}`;
    let scaled = Number.parseInt(scalar);
    if (isNaN(scaled)) scaled = 0;
    return colors[scaled];
  });

  let pointsPerHour = 1;
  if (data.length >= 35040) pointsPerHour = 4;
  if (data.length < 35040 && data.length >= 17520) pointsPerHour = 2;

  const numPointsYAxis = pointsPerHour * 24;

  const generateRectangle = (x: any, y: any, counter: any) => {
    const originX = 63.5;
    const originY = 370.3;

    const calculatedX = originX + x * 3.7;
    const calculatedY = originY - y * (14.4 / pointsPerHour);

    return (
      <rect
        key={counter}
        x={calculatedX.toFixed(1)}
        y={calculatedY.toFixed(1)}
        width='3.7'
        height='14.4'
        style={{ fill: c[counter] }}
      />
    );
  };

  const generateRectangles = () => {
    let counter = 0;
    const rectangleArray = [];
    for (let x = 0; x < 365; x++) {
      for (let y = 0; y < numPointsYAxis; y++) {
        try {
          rectangleArray.push(generateRectangle(x, y, counter));
        } catch (e) {
          // there might not be enough data
        }
        counter++;
      }
    }

    return rectangleArray;
  };

  return (
    <svg viewBox='0 0 1550 457.4'>
      <style>
        {`.graph_svg__st2{fill:none;stroke:#676767;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10}.graph_svg__st3{fill:${
          useLargeFont ? PRIMARY_BLUE : '#676867'
        }}.graph_svg__st4{font-family:&apos;Montserrat-SemiBold&apos;}.graph_svg__st5{font-size:${
          useLargeFont ? '22px' : '12px'
        }}.graph_svg__st6{fill:${
          useLargeFont ? PRIMARY_BLUE : '#676767'
        }}.graph_svg__st7{font-family:&apos;Lato-Regular&apos;}.graph_svg__st8{font-size:${
          useLargeFont ? '18px' : '10px'
        }}.graph_svg__st11{font-weight:${useLargeFont ? 'bold' : undefined}}`}
      </style>
      <g id='graph_svg__Layer_2'>
        <g>{generateRectangles()}</g>
        <path className='graph_svg__st2' d='M63.5 40.1v344.6' />
        {/* <text
          transform={`${
            useLargeFont ? 'rotate(-90 163.668 145.93)' : 'rotate(-90 143.668 125.93)'
          }`}
          className='graph_svg__st3 graph_svg__st4 graph_svg__st5 graph_svg__st11'
        >
          {'HOUR OF THE DAY'}
        </text>

        <text
          transform='translate(47.965 386.994)'
          className='graph_svg__st6 graph_svg__st7 graph_svg__st8'
        >
          {'0'}
        </text>
        <text
          transform='translate(47.965 303.032)'
          className='graph_svg__st6 graph_svg__st7 graph_svg__st8'
        >
          {'6'}
        </text>

        <text
          transform={`${useLargeFont ? 'translate(38.166 217.628)' : 'translate(42.166 217.628)'}`}
          className='graph_svg__st6 graph_svg__st7 graph_svg__st8'
        >
          {'12'}
        </text>
        <text
          transform={`${useLargeFont ? 'translate(38.166 131.295)' : 'translate(42.166 131.295)'}`}
          className='graph_svg__st6 graph_svg__st7 graph_svg__st8'
        >
          {'18'}
        </text>
        <text
          transform={`${useLargeFont ? 'translate(38.166 43.787)' : 'translate(42.166 43.787)'}`}
          className='graph_svg__st6 graph_svg__st7 graph_svg__st8'
        >
          {'24'}
        </text> */}

        <text
          transform={`${
            useLargeFont ? 'translate(647.912 433.818)' : 'translate(676.912 429.818)'
          }`}
          className='graph_svg__st3 graph_svg__st4 graph_svg__st5 graph_svg__st11'
        >
          {'DAY OF THE YEAR'}
        </text>
        <text
          transform='translate(725.116 402.497)'
          className='graph_svg__st6 graph_svg__st7 graph_svg__st8'
        >
          {'180'}
        </text>
        <text
          transform='translate(1058.905 402.497)'
          className='graph_svg__st6 graph_svg__st7 graph_svg__st8'
        >
          {'270'}
        </text>
        <text
          transform='translate(1400.885 402.497)'
          className='graph_svg__st6 graph_svg__st7 graph_svg__st8'
        >
          {'365'}
        </text>
        <text
          transform='translate(390.077 402.497)'
          className='graph_svg__st6 graph_svg__st7 graph_svg__st8'
        >
          {'90'}
        </text>
        <text
          transform='translate(59.69 402.497)'
          className='graph_svg__st6 graph_svg__st7 graph_svg__st8'
        >
          {'1'}
        </text>

        <text
          transform='translate(1455.708 43.787)'
          className='graph_svg__st6 graph_svg__st7 graph_svg__st8'
        >
          {`${formatter.format(Math.round(max))} ${unit}`}
        </text>
        <text
          transform='translate(1455.708 131.295)'
          className='graph_svg__st6 graph_svg__st7 graph_svg__st8'
        >
          {`${formatter.format(Math.round(thirdQuarter))} ${unit}`}
        </text>
        <text
          transform='translate(1455.708 217.628)'
          className='graph_svg__st6 graph_svg__st7 graph_svg__st8'
        >
          {`${formatter.format(Math.round(mid))} ${unit}`}
        </text>
        <text
          transform='translate(1455.708 303.032)'
          className='graph_svg__st6 graph_svg__st7 graph_svg__st8'
        >
          {`${formatter.format(Math.round(firstQuarter))} ${unit}`}
        </text>
        <text
          transform='translate(1455.708 386.994)'
          className='graph_svg__st6 graph_svg__st7 graph_svg__st8'
        >
          {`${formatter.format(Math.round(min))} ${unit}`}
        </text>
        <linearGradient
          id='graph_svg__SVGID_1_'
          gradientUnits='userSpaceOnUse'
          x1={1437.363}
          y1={384.694}
          x2={1437.363}
          y2={40.142}
        >
          <stop offset='0' style={{ stopColor: colors[0] }} />
          <stop offset='5.948725e-02' style={{ stopColor: colors[1] }} />
          <stop offset='0.1303' style={{ stopColor: colors[33] }} />
          <stop offset='0.2032' style={{ stopColor: colors[59] }} />
          <stop offset='0.2809' style={{ stopColor: colors[72] }} />
          <stop offset='0.6685' style={{ stopColor: colors[170] }} />
          <stop offset='0.8876' style={{ stopColor: colors[226] }} />
          <stop offset='1' style={{ stopColor: colors[255] }} />
        </linearGradient>
        <path
          fill='url(#graph_svg__SVGID_1_)'
          stroke='#676767'
          strokeLinecap='round'
          strokeMiterlimit={10}
          d='M1428.6 40.1h17.5v344.6h-17.5z'
        />
        <path className='graph_svg__st2' d='M63.5 384.7h1350.2' />
      </g>
    </svg>
  );
}
