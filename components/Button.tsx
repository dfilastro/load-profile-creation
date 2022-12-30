import styled from '@emotion/styled';

const ButtonContainer = styled.button`
  background-color: #24374e;
  color: white;
  width: 20rem;
  padding: 0.5rem;
  border-radius: 1rem;
  margin: 1rem auto;
  font-weight: 700;
  letter-spacing: 0.1rem;
  text-transform: uppercase;
  cursor: pointer;
`;
type Button = {
  type?: 'button' | 'submit' | 'reset' | undefined;
  text: string;
  onClick?: () => void;
};

export default function Button(props: Button) {
  return (
    <ButtonContainer type={props.type} onClick={props.onClick}>
      {props.text}
    </ButtonContainer>
  );
}
