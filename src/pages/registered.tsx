import axios from 'axios';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { api } from '../services/api';

// import { Container } from './styles';

const pages: NextPage = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { query } = useRouter();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (query.code) {
      axios.get(`/api/login/${query.code}`)
    }
  }, [query])

  return <div />;
}

export default pages;