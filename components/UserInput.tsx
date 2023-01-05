import styled from '@emotion/styled';
import { useState } from 'react';
import Yearly from './YearlyInputData';
import Monthly from './MonthlyInputData';
import RoofSqft from './RoofSqftInputData';

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InputContainer = styled.div``;

const Input = styled.input`
  width: 2rem;
`;

const InputLabel = styled.label`
  text-transform: uppercase;
`;

const SelectionContaier = styled.div`
  background-color: #24374e;
  width: 100%;
  display: flex;
  padding: 2rem 4rem;
  gap: 2rem;
  color: white;
  font-weight: bold;
`;

const ContentContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 3rem;
`;

export default function UserInput() {
  const [select, setSelect] = useState('');

  return (
    <Container>
      <SelectionContaier>
        What kind of data do you have:
        <InputContainer>
          <Input
            type='radio'
            name='type'
            id='monthly'
            value='monthly'
            onChange={() => setSelect('monthly')}
          />
          <InputLabel htmlFor='monthy'>Monthly Consumption/Peak</InputLabel>
        </InputContainer>
        <InputContainer>
          <Input
            type='radio'
            name='type'
            id='monthly'
            value='yearly'
            onChange={() => setSelect('yearly')}
          />
          <InputLabel htmlFor='yearly'>Yearly Consumption/Peak</InputLabel>
        </InputContainer>
        <InputContainer>
          <Input
            type='radio'
            name='type'
            id='roofsqft'
            value='roofsqft'
            onChange={() => setSelect('roofsqft')}
          />
          <InputLabel htmlFor='roofsqft'>Roof Square Footage</InputLabel>
        </InputContainer>
      </SelectionContaier>
      <ContentContainer>
        {select === 'monthly' && <Monthly />}
        {select === 'yearly' && <Yearly />}
        {select === 'roofsqft' && <RoofSqft />}
      </ContentContainer>

      <form action='submit'></form>
    </Container>
  );
}
