import { notification } from 'antd';

export const err503 = () => {
  notification.error({
    message: 'ERRO 503',
    description: 'Servidor está inacessível no momento, tente carregar a página novamente, se o erro persistir, entre em contato com o técnico.'
  });
}

export const err401 = () => {
  notification.error({
    message: 'ERRO 401',
    description: 'Erro ao realizar a ação. Você não tem permissão para isto.'
  });
}

export const errGeneral = () => {
  notification.error({
    message: 'ERRO',
    description: 'Erro ao realizar esta ação. Mas não entendemos direito o que houve, tente carregar a página novamente, se o erro persistir, entre em contato com o técnico.'
  });
}

export const success = () => {
  notification.success({
    message: 'DEU CERTO',
    description: 'Ação realizada com sucesso.'
  });
}