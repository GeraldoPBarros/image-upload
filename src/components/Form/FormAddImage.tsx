import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations = yup.object().shape({
    // REQUIRED, LESS THAN 10 MB AND ACCEPTED FORMATS VALIDATIONS
    image: yup
      .mixed()
      .required('Arquivo obrigatório')
      .test('size', 'O arquivo deve ser menor que 10MB', value => {
        console.log(value[0].size);
        return value[0].size <= 10485760;
      })
      .test('type', 'Somente são aceitos arquivos PNG, JPEG e GIF', value => {
        return /\.(jpe?g|png|gif)$/i.test(value[0].name);
      }),
    // .type('/.(jpe?g|png|gif)$/i'),
    // REQUIRED, MIN AND MAX LENGTH VALIDATIONS
    title: yup
      .string()
      .required('Título obrigatório')
      .min(2, 'Mínimo de 2 caracteres')
      .max(20, 'Máximo de 20 caracteres'),
    // REQUIRED, MAX LENGTH VALIDATIONS
    description: yup
      .string()
      .required('Descrição obrigatória')
      .max(65, 'Máximo de 65 caracteres'),
  });

  const queryClient = useQueryClient();
  const mutation = useMutation(
    // MUTATION API POST REQUEST,
    async (data: Record<string, unknown>) => {
      await api.post('api/images', {
        title: data.title,
        description: data.description,
        url: imageUrl,
      });
    },
    {
      // ONSUCCESS MUTATION
      onSuccess: () => {
        queryClient.invalidateQueries('images');
      },
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm({
      resolver: yupResolver(formValidations),
    });
  const { errors } = formState;

  const onSubmit = async (data: Record<string, unknown>): Promise<void> => {
    try {
      // SHOW ERROR TOAST IF IMAGE URL DOES NOT EXISTS
      // EXECUTE ASYNC MUTATION
      // SHOW SUCCESS TOAST
      if (imageUrl === '') {
        toast({
          title: 'Imagem não adicionada',
          description:
            'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
          status: 'info',
          duration: 9000,
          isClosable: true,
        });
      } else {
        mutation.mutateAsync(data);
        toast({
          title: 'Imagem cadastrada',
          description: 'Sua imagem foi cadastrada com sucesso.',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
      }
    } catch {
      // SHOW ERROR TOAST IF SUBMIT FAILED
      toast({
        title: 'Falha no cadastro',
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } finally {
      // CLEAN FORM, STATES AND CLOSE MODAL
      reset();
      setImageUrl('');
      setLocalImageUrl('');
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          error={errors.image}
          {...register('image')}
          // SEND IMAGE ERRORS
          // REGISTER IMAGE INPUT WITH VALIDATIONS
        />

        <TextInput
          placeholder="Título da imagem..."
          error={errors.title}
          {...register('title')}
          // SEND TITLE ERRORS
          // REGISTER TITLE INPUT WITH VALIDATIONS
        />

        <TextInput
          placeholder="Descrição da imagem..."
          error={errors.description}
          {...register('description')}
          // SEND DESCRIPTION ERRORS
          // REGISTER DESCRIPTION INPUT WITH VALIDATIONS
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
