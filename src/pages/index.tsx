/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-labels */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-labels */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
import { Button, Box, Flex } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';
import axios from 'axios';

import { valueScaleCorrection } from 'framer-motion/types/render/dom/projection/scale-correction';
import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

export default function Home(): JSX.Element {
  const fetchImages = ({ pageParam = null }) =>
    axios.get(`/api/images?cursor=${pageParam}?after=${pageParam}`);

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', fetchImages, {
    getNextPageParam: (lastPage, pages) =>
      lastPage.data.after ? lastPage.data : null,
  });

  const formattedData = useMemo(() => {
    // FORMAT AND FLAT DATA ARRAY
    const fData = data?.pages.map(dt => dt.data.data);
    const arr = fData?.flat();

    return arr;
  }, [data]);

  // RENDER LOADING SCREEN
  // RENDER ERROR SCREEN

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <Error />
      ) : (
        <>
          <Header />

          <Box maxW={1120} px={20} mx="auto" my={20}>
            <CardList cards={formattedData} />
            {/* TODO RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */}
            <br />
            {hasNextPage && (
              <Button colorScheme="orange" onClick={() => fetchNextPage()}>
                {!isFetchingNextPage ? <>Carregar mais</> : <>Carregando...</>}
              </Button>
            )}
          </Box>
        </>
      )}
    </>
  );
}
