<?php

namespace App\Controller;

use App\Entity\Usuario;
use App\Form\UsuarioType;
use App\Repository\UsuarioRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/usuario')]
class UsuarioController extends AbstractController
{
    #[Route('/', name: 'app_usuario', methods: ['GET'])]
    public function indexEditar(EntityManagerInterface $entityManager): Response
    {
        if ($this->isGranted('ROLE_ADMIN')) {
            return $this->render('usuario/index.html.twig');
        } else {
            return $this->render('usuario/accesDenied.html.twig');
        }
    }

    #[Route('/new', name: 'app_usuario_nuevo', methods: ['GET'])]
    public function indexNuevo(EntityManagerInterface $entityManager): Response
    {
        if ($this->isGranted('ROLE_ADMIN')) {
            return $this->render('usuario/new.html.twig');
        } else {
            return $this->render('usuario/accesDenied.html.twig');
        }
    }

    #[Route('/get', name: 'app_usuario_api', methods: ['GET'])]
    public function getUsuarios(EntityManagerInterface $entityManager): Response
    {
        if ($this->isGranted('ROLE_ADMIN')) {
            $usuarios = $entityManager
                ->getRepository(Usuario::class)
                ->buscarUsuario();

            return $this->json($usuarios);
        } else {
            return $this->render('usuario/accesDenied.html.twig');
        }
    }



    #[Route('/{idUsuario}', name: 'app_usuario_show', methods: ['GET'])]
    public function show(Usuario $usuario): Response
    {
        if (!$usuario->getEstado() === 'A' || !$usuario->getEstado() === 'I') {
            return $this->render('usuario/404.html.twig');
        } else {
            return $this->render('usuario/show.html.twig', [
                'usuario' => $usuario,
            ]);
        }
    }

    #[Route('/editar/{id}', name: 'editar_usuario', methods: ['GET'])]
    public function editarUsuario(string $id, UsuarioRepository $usuarioRepository): Response
    {
        $usuario = $usuarioRepository->findOneByUserId($id);

        return $this->render('usuario/edit.html.twig', [
            'usuario' => $usuario
        ]);
    }

    #[Route('/{id}/editar', name: 'actualizar_usuario', methods: ['PUT'])]
    public function editarUsuarioPut(Request $request, string $id, 
    UsuarioRepository $usuarioRepository,
    UserPasswordHasherInterface $userPasswordHasher    ): Response
    {

        $usuario = $usuarioRepository->findOneByUserId($id);

        $jsonString = $request->getContent();
        $data = json_decode($jsonString, true);

        $usuario->setNombre($data['nombre']);
        $usuario->setApellido($data['apellido']);
        $usuario->setCorreo($data['correo']);
        $usuario->setClave($usuario->getClave());
        $usuario->setRoles($data['roles']);
        $usuario->setEstado($data['estado']);


        $usuarioRepository->save($usuario, true);


        return $this->json($usuario);
    }

    #[Route('/{idUsuario}/delete', name: 'delete_usuario', methods: ['PUT'])]
    public function deleteUsuarios(string $idUsuario, UsuarioRepository $usuarioRepository, Usuario $usuario): Response
    {
        $usuario = $usuarioRepository->findOneByUserId($idUsuario);

        $usuario->setEstado('N');

        $usuarioRepository->save($usuario, true);

        return $this->json($usuario);
    }

    #[Route('/nuevo', name: 'nuevo_usuario', methods: ['POST'])]
    public function create(
        Request $request,
        UsuarioRepository $usuarioRepository,
        UserPasswordHasherInterface $userPasswordHasher
    ): Response {

        $jsonString = $request->getContent();
        $data = json_decode($jsonString, true);

        $usuarioNew = new Usuario();

        $usuarioNew->setNombre($data['nombre']);
        $usuarioNew->setApellido($data['apellido']);
        $usuarioNew->setCorreo($data['correo']);
        $usuarioNew->setClave($data['clave']);
        $usuarioNew->setClave(
            $userPasswordHasher->hashPassword(
                $usuarioNew,
                $data['clave']
            )
        );
        $usuarioNew->setRoles($data['roles']);
        $usuarioNew->setEstado($data['estado']);

        $usuarioRepository->save($usuarioNew, true);
        
        
        return $this->json($usuarioNew);
    }



    // #[Route('/{idUsuario}', name: 'app_usuario_delete', methods: ['POST'])]
    // public function delete(Request $request, Usuario $usuario, EntityManagerInterface $entityManager): Response
    // {
    //     if ($this->isGranted('ROLE_ADMIN')) {
    //         if ($this->isCsrfTokenValid('delete' . $usuario->getIdUsuario(), $request->request->get('_token'))) {
    //             $usuario->setEstado("N");
    //             $entityManager->flush();
    //         }

    //         return $this->redirectToRoute('app_usuario_index', [], Response::HTTP_SEE_OTHER);
    //     } else {
    //         return $this->render('usuario/accesDenied.html.twig');
    //     }
    // }

    // #[Route('/new', name: 'app_usuario_new', methods: ['GET', 'POST'])]
    // public function new(Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $userPasswordHasher): Response
    // {

    //     $usuario = new Usuario();
    //     $form = $this->createForm(UsuarioType::class, $usuario);
    //     $form->handleRequest($request);

    //     if ($this->isGranted('ROLE_ADMIN')) {
    //         if ($form->isSubmitted() && $form->isValid()) {
    //             $usuario->setClave(
    //                 $userPasswordHasher->hashPassword(
    //                     $usuario,
    //                     $form->get('plainPassword')->getData()
    //                 )
    //             );
    //             $roles = $form->get('roles')->getData();
    //             $usuario->setRoles([$roles]);
    //             $usuario->setEstado("A");
    //             $estado = $form->get('estado')->getData();
    //             $usuario->setEstado($estado);

    //             $entityManager->persist($usuario);
    //             $entityManager->flush();

    //             return $this->redirectToRoute('app_usuario_index', [], Response::HTTP_SEE_OTHER);
    //         }
    //         return $this->renderForm('usuario/new.html.twig', [
    //             'usuario' => $usuario,
    //             'form' => $form,
    //         ]);
    //     } else {
    //         return $this->render('usuario/accesDenied.html.twig');
    //     }
    //     }
}
