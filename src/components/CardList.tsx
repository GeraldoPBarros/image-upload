/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/jsx-no-bind */
import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  // MODAL USEDISCLOSURE
  const { isOpen, onOpen, onClose } = useDisclosure();

  // SELECTED IMAGE URL STATE
  const [imgUrl, setImageUrl] = useState('');

  // FUNCTION HANDLE VIEW IMAGE

  function handleViewImage(url: string) {
    setImageUrl(url);
    onOpen();
  }

  return (
    <>
      {/* TODO CARD GRID */}
      <SimpleGrid columns={3} spacing="40px">
        {cards.map(card => (
          <>
            <Card data={card} viewImage={handleViewImage} />
            {/* TODO MODALVIEWIMAGE */}
            <ModalViewImage imgUrl={imgUrl} onClose={onClose} isOpen={isOpen} />
          </>
        ))}
      </SimpleGrid>
    </>
  );
}
