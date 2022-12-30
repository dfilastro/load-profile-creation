import styled from '@emotion/styled';
import Button from '@mui/material/Button';

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
  variant?: 'contained' | 'outlined';
  background?: string;
  color?: string;
  onClick?: () => void;
};

export default function ButtonTest(props: Button) {
  return (
    <Button
      variant={props.variant ? props.variant : 'contained'}
      sx={{
        backgroundColor: `${props.background}`,
        color: `${props.color}`,
        width: '20rem',
        padding: '0.5rem',
        margin: '1rem auto',
        letterSpacing: '0.15rem',
        textTransform: 'uppercase',
        cursor: 'pointer',
      }}
      type={props.type}
      onClick={props.onClick}
    >
      {props.text}
    </Button>
  );
}
