import Chart from 'react-google-charts';
import styled from '@emotion/styled';
import { useState } from 'react';
import { InputAdornment, TextField, CircularProgress, Alert } from '@mui/material';

import Button from './Button';
import { sum } from '../utils/sum';
import { errors } from '../utils/error';
import { isEmpty } from '../utils/isEmpty';
import { fitCurve } from '../utils/fitCurve';
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

export default function Yearly() {
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

    if (information.demand === null || information.demand === '') {
      userMessage.error = `Please, inform a valid value for DEMAND`;
      setPageState(userMessage);
      return;
    }

    if (information.peak === null || information.peak === '') {
      userMessage.error = `Please, inform a valid value for PEAK`;
      setPageState(userMessage);
      return;
    }

    if (information.typical.length === 0) {
      userMessage.error = `You must select a Typical Load Profile`;
      setPageState(userMessage);
      return;
    }

    const typical = information.typical.split(',');

    if (Number(typical.length * information.peak) <= Number(information.demand)) {
      userMessage.error = `PEAK can't be higher than DEMAND`;
      information.peak = null;
      setPageState(userMessage);
      return;
    }

    const demand = information.demand.split(' ');
    const peak = [Number(information.peak)];

    const loadProfile = fitCurve(demand, peak, typical);

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
                <Label>Demand:</Label>
                <TextField
                  label='Yearly Demand'
                  type='number'
                  onChange={handleFieldChange}
                  id='demand'
                  sx={{ width: '15rem' }}
                  InputProps={{
                    endAdornment: <InputAdornment position='end'>kW</InputAdornment>,
                  }}
                />
              </RowContainer>
              <RowContainer>
                <Label>Peak:</Label>
                <TextField
                  label='Yearly Peak'
                  type='number'
                  onChange={handleFieldChange}
                  id='peak'
                  sx={{ width: '15rem' }}
                  InputProps={{
                    endAdornment: <InputAdornment position='end'>kW</InputAdornment>,
                  }}
                />
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
                <Button type='submit' text='Create' />
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
                <Label>Peak: {Number(profile.max().toFixed(0))?.toLocaleString('en-US')}kW</Label>
              </RowContainer>
              <Button
                type='button'
                text='Go Back'
                onClick={() => {
                  setChart(false);
                  setUserFields({});
                }}
              />
            </ChartArea>
          )}
        </div>
      )}
    </main>
  );
}