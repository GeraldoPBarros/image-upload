import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  // MODAL WITH IMAGE AND EXTERNAL LINK

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalBody bg="gray.700" padding="0">
          <Image
            src={imgUrl}
            alt="rendered-image"
            w="100%"
            h="100%"
            maxW="900px"
            maxH="600px"
          />
        </ModalBody>
        <ModalFooter
          bg="gray.700"
          style={{ display: 'flex', justifyContent: 'flex-start' }}
          h="20px"
          paddingLeft="10px"
        >
          <Link href={imgUrl} color="white" fontSize="12px" isExternal>
            Abrir original
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
