interface Errors {
  err?: string;
  suc?: string;
  inf?: string;
  proc?: boolean;
}

export const errors = ({ err = '', suc = '', inf = '', proc = false }: Errors) => {
  const pageMessage = { error: err, success: suc, info: inf, processing: proc };

  return pageMessage;
};
