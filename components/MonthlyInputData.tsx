import styled from '@emotion/styled';
import { useState } from 'react';
import { InputAdornment, TextField, CircularProgress, Alert } from '@mui/material';

import Button from './Button';
import { errors } from '../utils/error';
import { fitCurve } from '../utils/fitCurve';
import { loadProfiles } from '../assets/loadProfiles';
import { sum } from '../utils/sum';
import { avg } from '../utils/avg';
import { max } from '../utils/max';
import { isEmpty } from '../utils/isEmpty';
import { csvFile } from '../utils/csvFile';
import HeatMap from './HeatMap';

type UserMessage = {
  error: string;
  success: string;
  info: string;
  processing: boolean;
};

type LoadProfiles = {
  // Model_Load_Profile: number[];
  // Test_Load_Profile: number[];
  LP_Generic_Commercial: number[];
  LP_Generic_Warehouse: number[];
};

const Main = styled.main``;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PageContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const RowContainer = styled.div`
  margin: 0 auto;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
`;

const RowPeakDemand = styled.div`
  margin: 0 auto 3rem auto;
  display: flex;
  gap: 15rem;
  justify-content: space-between;
`;

const RowLoadProfile = styled.div`
  height: 14vh;
  margin: 0 auto;
  display: flex;
  gap: 15rem;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.div`
  height: 2rem;
  display: flex;
  align-items: center;
  font-weight: 700;
`;

const Tittle = styled.div`
  width: 15rem;
  height: 2rem;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  font-weight: 700;
  text-transform: uppercase;
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

export default function Monthly() {
  const [userFields, setUserFields] = useState<any>({});
  let userMessage = errors({});
  const [profile, setProfile] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chart, setChart] = useState<boolean>(false);
  const [pageState, setPageState] = useState(userMessage);

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  async function handleSubmit(information: any) {
    if (isEmpty(information)) {
      userMessage.error = `Please, fill all the fields`;
      setPageState(userMessage);
      return;
    }

    let demand = [] as number[];
    let peak = [] as number[];

    const arrayOfObjectsWithInformation = Object.entries(information).map((e) => ({
      [e[0]]: e[1],
    }));

    // Save monthly demand information into an array
    const demandArray = arrayOfObjectsWithInformation.filter((i) =>
      Object.keys(i)[0].includes('demand')
    );

    for (let i = 0; i < demandArray.length; i++) {
      demand.push(Number(Object.values(demandArray[i])[0]) as number);
    }

    // Save monthly demand information into an array
    const peakArray = arrayOfObjectsWithInformation.filter((i) =>
      Object.keys(i)[0].includes('peak')
    );

    for (let i = 0; i < peakArray.length; i++) {
      peak.push(Number(Object.values(peakArray[i])[0]) as number);
    }

    if (demand.length < 2) {
      userMessage.error = `You must, at least, inform two values for DEMAND, or try YEARLY modulation`;
      setPageState(userMessage);
      return;
    }

    if (peak.length < 2) {
      userMessage.error = `You must, at least, inform two values for PEAK, or try YEARLY modulation`;
      setPageState(userMessage);
      return;
    }

    if (!information.typical) {
      userMessage.error = `You must select a Typical Load Profile`;
      setPageState(userMessage);
      return;
    }

    const typical = information.typical.split(',');

    if (typical.length * max(peak) <= avg(demand) * 12) {
      userMessage.error = `PEAK can't be lower than the DEMAND's average`;
      information.peak = null;
      setPageState(userMessage);
      return;
    }

    const loadProfile = fitCurve(typical, demand, peak);

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
    <Main>
      {isLoading && (
        <CircularProgressContainer>
          <CircularProgress />
        </CircularProgressContainer>
      )}
      {!isLoading && (
        <Container>
          {!chart && (
            <PageContainer
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(userFields);
              }}
            >
              {pageState.error !== '' && <Alert severity='error'>{pageState.error}</Alert>}
              {pageState.success !== '' && <Alert severity='success'>{pageState.success}</Alert>}
              {pageState.info !== '' && <Alert severity='info'>{pageState.info}</Alert>}
              <RowPeakDemand>
                <InfoContainer>
                  <RowContainer>
                    <Tittle>Consumption</Tittle>
                  </RowContainer>
                  <RowContainer>
                    <InfoContainer>
                      {months.map((i, index) => {
                        if (index <= 5) {
                          return (
                            <RowContainer key={index}>
                              <Label>{i}</Label>
                              <TextField
                                label='Consumption'
                                type='number'
                                onChange={handleFieldChange}
                                id={`demand-${index}`}
                                sx={{ width: '15rem' }}
                                InputProps={{
                                  endAdornment: <InputAdornment position='end'>kWh</InputAdornment>,
                                }}
                              />
                            </RowContainer>
                          );
                        }
                      })}
                    </InfoContainer>
                    <InfoContainer>
                      {months.map((i, index) => {
                        if (index > 5) {
                          return (
                            <RowContainer key={index}>
                              <Label>{i}</Label>
                              <TextField
                                label='Consumption'
                                type='number'
                                onChange={handleFieldChange}
                                id={`demand-${index}`}
                                sx={{ width: '15rem' }}
                                InputProps={{
                                  endAdornment: <InputAdornment position='end'>kWh</InputAdornment>,
                                }}
                              />
                            </RowContainer>
                          );
                        }
                      })}
                    </InfoContainer>
                  </RowContainer>
                </InfoContainer>
                <InfoContainer>
                  <RowContainer>
                    <Tittle>Peak</Tittle>
                  </RowContainer>
                  <RowContainer>
                    <InfoContainer>
                      {months.map((i, index) => {
                        if (index <= 5) {
                          return (
                            <RowContainer key={index}>
                              <Label>{i}</Label>
                              <TextField
                                label='Peak'
                                type='number'
                                onChange={handleFieldChange}
                                id={`peak-${index}`}
                                sx={{ width: '15rem' }}
                                InputProps={{
                                  endAdornment: <InputAdornment position='end'>kW</InputAdornment>,
                                }}
                              />
                            </RowContainer>
                          );
                        }
                      })}
                    </InfoContainer>
                    <InfoContainer>
                      {months.map((i, index) => {
                        if (index > 5) {
                          return (
                            <RowContainer key={index}>
                              <Label>{i}</Label>
                              <TextField
                                label='Peak'
                                type='number'
                                onChange={handleFieldChange}
                                id={`peak-${index}`}
                                sx={{ width: '15rem' }}
                                InputProps={{
                                  endAdornment: <InputAdornment position='end'>kW</InputAdornment>,
                                }}
                              />
                            </RowContainer>
                          );
                        }
                      })}
                    </InfoContainer>
                  </RowContainer>
                </InfoContainer>
              </RowPeakDemand>

              <RowLoadProfile>
                <InfoContainer>
                  <RowContainer>
                    <Tittle>Load Profile</Tittle>
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
                </InfoContainer>

                <RowContainer>
                  <Button background='#24374e' type='submit' text='Create' />
                </RowContainer>
              </RowLoadProfile>
            </PageContainer>
          )}
          {chart && (
            <ChartArea>
              <Label>Corrected Load Profile</Label>
              <HeatMap data={[...profile]} unit={'kW'} />
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
        </Container>
      )}
    </Main>
  );
}
