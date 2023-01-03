import Chart from 'react-google-charts';
import styled from '@emotion/styled';
import { useState } from 'react';
import { TextField, CircularProgress, Alert } from '@mui/material';

import Button from './Button';
import { sum } from '../utils/sum';
import { max } from '../utils/max';
import { errors } from '../utils/error';
import { isEmpty } from '../utils/isEmpty';
import { csvFile } from '../utils/csvFile';
import { fitCurve } from '../utils/fitCurve';

import { industry } from '../assets/industry';
import { loadProfiles } from '../assets/loadProfiles';

type UserMessage = {
  error: string;
  success: string;
  info: string;
  processing: boolean;
};

type LoadProfiles = {
  Model_Load_Profile: number[];
  Test_Load_Profile: number[];
  LP_Generic_Commercial: number[];
  LP_Generic_Warehouse: number[];
};

type Industry = {
  food: number;
  beverageAndTobaccoProducts: number;
  textileMills: number;
  textileProductMills: number;
  apparel: number;
  leatherAndAlliedProducts: number;
  woodProducts: number;
  paper: number;
  printingAndRelatedSupport: number;
  petroleumAndCoalProducts: number;
  chemicals: number;
  plasticsAndRubberProducts: number;
  nonmetallicMineralProducts: number;
  primaryMetals: number;
  fabricatedMetalProducts: number;
  machinery: number;
  computerAndElectronicProducts: number;
  electricalEquipAppliancesAndComponents: number;
  transportationEquipment: number;
  furnitureAndRelatedProducts: number;
};

const Container = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RowContainer = styled.div`
  width: 30vw;
  margin: 0 auto;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.div`
  width: 15rem;
  height: 2rem;
  display: flex;
  align-items: center;
  font-weight: 700;
`;

const CircularProgressContainer = styled.div`
  width: 90vw;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
`;

const Select = styled.select`
  width: 15rem;
  height: 3rem;
  padding: 0.5rem;
`;

const ChartArea = styled.div`
  width: 90vw;
  height: 80vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4rem;
`;

export default function RoofSqft() {
  const [userFields, setUserFields] = useState<any>({});
  const [profile, setProfile] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chart, setChart] = useState<boolean>(false);

  let userMessage = errors({});
  const [pageState, setPageState] = useState(userMessage);

  async function handleSubmit(information: any) {
    if (isEmpty(information)) {
      userMessage.error = `Please, fill all the fields`;
      setPageState(userMessage);
      return;
    }

    if (!information.roofsqft || information.roofsqft <= 0) {
      userMessage.error = `Please, inform a valid value for ROOF SQFT`;
      setPageState(userMessage);
      return;
    }

    if (!information.industry || information.industry <= 0) {
      userMessage.error = `You must select an Industry Type`;
      setPageState(userMessage);
      return;
    }

    if (!information.typical) {
      userMessage.error = `You must select a Typical Load Profile`;
      setPageState(userMessage);
      return;
    }

    const typical = information.typical.split(',');

    if (Number(typical.length * information.peak) <= Number(information.demand)) {
      userMessage.error = `PEAK can't be lower than the DEMAND's average`;
      information.peak = null;
      setPageState(userMessage);
      return;
    }

    const demand = undefined;
    const peak = undefined;
    const industryType = information.industry;
    const sqft = information.roofsqft;

    const loadProfile = fitCurve(typical, demand, peak, industryType, sqft);

    setIsLoading(true);
    setChart(true);

    if (!isLoading) {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }

    setProfile(loadProfile);
  }

  const handleFieldChange = (e: { target: { id: string; value: string } }) => {
    setUserFields((old: any) => ({ ...old, [e.target.id]: e.target.value }));

    for (const key in userMessage) {
      userMessage[key as keyof UserMessage] = '' as never;
    }

    setPageState(userMessage);
  };

  return (
    <main>
      {isLoading && (
        <CircularProgressContainer>
          <CircularProgress />
        </CircularProgressContainer>
      )}
      {!isLoading && (
        <div>
          {!chart && (
            <Container
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(userFields);
              }}
            >
              {pageState.error !== '' && <Alert severity='error'>{pageState.error}</Alert>}
              {pageState.success !== '' && <Alert severity='success'>{pageState.success}</Alert>}
              {pageState.info !== '' && <Alert severity='info'>{pageState.info}</Alert>}
              <RowContainer>
                <Label>Approximate Available Floorspace:</Label>
                <TextField
                  label='Available Square Footage'
                  type='number'
                  onChange={handleFieldChange}
                  id='roofsqft'
                  sx={{ width: '15rem' }}
                />
              </RowContainer>

              <RowContainer>
                <Label>Industry Type:</Label>
                <Select name='select' onChange={handleFieldChange} id='industry'>
                  {Object.keys(industry).map((i, index) => {
                    return (
                      <option key={index} value={`${industry[i as keyof Industry]}`}>
                        {i}
                      </option>
                    );
                  })}
                </Select>
              </RowContainer>
              <RowContainer>
                <Label>Typical Load Profile:</Label>

                <Select name='select' onChange={handleFieldChange} id='typical'>
                  {Object.keys(loadProfiles).map((i, index) => {
                    return (
                      <option key={index} value={`${loadProfiles[i as keyof LoadProfiles]}`}>
                        {i}
                      </option>
                    );
                  })}
                </Select>
              </RowContainer>
              <RowContainer>
                <Button background='#24374e' type='submit' text='Create' />
              </RowContainer>
            </Container>
          )}
          {chart && (
            <ChartArea>
              <Label>Corrected Load Profile</Label>
              <Chart
                chartType='Line'
                data={[['', ''], ...Object.entries({ ...profile })]}
                height='400px'
                width='100%'
                legendToggle
              />
              <RowContainer>
                <Label>
                  Total Demand: {Number(sum(profile).toFixed(0))?.toLocaleString('en-US')}kW
                </Label>
                <Label>Peak: {Number(max(profile).toFixed(0))?.toLocaleString('en-US')}kW</Label>
              </RowContainer>
              <RowContainer>
                <Button
                  variant='outlined'
                  type='button'
                  text='Go Back'
                  onClick={() => {
                    setChart(false);
                    setUserFields({});
                  }}
                />
                <Button
                  background='#24374e'
                  color='white'
                  type='button'
                  text='Download CSV File'
                  onClick={() => {
                    csvFile(profile);
                  }}
                />
              </RowContainer>
            </ChartArea>
          )}
        </div>
      )}
    </main>
  );
}
