<?php

namespace App\Controller;

use App\Entity\Usuario;
use App\Form\UsuarioType;
use App\Repository\UsuarioRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\PasswordHasherFactory;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Config\Security\PasswordHasherConfig;

#[Route('/usuario')]
class UsuarioController extends AbstractController
{
    #[Route('/', name: 'app_usuario', methods: ['GET'])]
    public function indexEditar(): Response
    {
        if ($this->isGranted('ROLE_ADMIN') || $this->isGranted('ROLE_LIMPIEZA')) {
            
            return $this->render('usuario/index.html.twig');
        } else {
            return $this->render('usuario/accesDenied.html.twig');
        }
    }
    
    #[Route('/get', name: 'app_usuario_api', methods: ['GET'])]
    public function getUsuarios(EntityManagerInterface $entityManager): Response
    {
        if ($this->isGranted('ROLE_ADMIN') || $this->isGranted('ROLE_LIMPIEZA')) {
            $usuarios = $entityManager
                ->getRepository(Usuario::class)
                ->buscarUsuario();

            return $this->json($usuarios);
        } else {
            return $this->render('usuario/accesDenied.html.twig');
        }
    }

    #[Route('/editar/{id}', name: 'editar_usuario', methods: ['GET'])]
    public function editarUsuario(string $id, UsuarioRepository $usuarioRepository): Response
    {
        if ($this->isGranted('ROLE_ADMIN')) {

            $usuario = $usuarioRepository->findOneByUserId($id);

            return $this->render('usuario/edit.html.twig', [
                'usuario' => $usuario
            ]);
        } else {
            return $this->render('usuario/accesDenied.html.twig');
        }
    }

    #[Route('/{id}/editar', name: 'actualizar_usuario', methods: ['PUT'])]
    public function editarUsuarioPut(
        Request $request,
        string $id,
        UsuarioRepository $usuarioRepository,
        UserPasswordHasherInterface $userPasswordHasher
    ): Response {

        if ($this->isGranted('ROLE_ADMIN')) {

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
        } else {
            return $this->render('usuario/accesDenied.html.twig');
        }
    }

    #[Route('/change/pass', name: 'edit_password', methods: ['GET'])]
    public function editarContraseniaFront(): Response
    {

        return $this->render('usuario/passedit.html.twig');
    }

    #[Route('/{id}/change/pass', name: 'update_password', methods: ['PUT'])]
    public function editarContraseniaPut(
        UserPasswordHasherInterface $userPasswordHasher,
        string $id,
        UsuarioRepository $usuarioRepository,
        Request $request
    ): Response {
        
        $jsonString = $request->getContent();
        $data = json_decode($jsonString, true);


        $usuario = $usuarioRepository->findOneByUserId($id);
        
       $claveVerificar = $userPasswordHasher->isPasswordValid($usuario,$data['clave']);

        if ($claveVerificar) {

            $usuario->setNombre($usuario->getNombre());
            $usuario->setApellido($usuario->getApellido());
            $usuario->setCorreo($usuario->getCorreo());
            $usuario->setClave(
                $userPasswordHasher->hashPassword(
                    $usuario,
                    $data['claveNueva']
                )
            );
            $usuario->setRoles($usuario->getRoles());
            $usuario->setEstado($usuario->getEstado());

            $usuarioRepository->save($usuario, true);

            return $this->json($usuario);

        }else{
            $error = [
                "msg" => "contrasenia incorrecta"
            ];
            return $this->json($error)->setStatusCode(400, "Contrasenia incorrecta");
        }
    }

    #[Route('/{idUsuario}/delete', name: 'delete_usuario', methods: ['PUT'])]
    public function deleteUsuarios(string $idUsuario, UsuarioRepository $usuarioRepository, Usuario $usuario): Response
    {
        if ($this->isGranted('ROLE_ADMIN')) {

            $usuario = $usuarioRepository->findOneByUserId($idUsuario);

            $usuario->setEstado('N');

            $usuarioRepository->save($usuario, true);

            return $this->json($usuario);
        } else {
            $error = [
                "msg" => "no tienes permiso para hacer esto"
            ];
            return $this->json($error)->setStatusCode(400, "No tienes permiso para hacer esto");
        }
    }

    #[Route('/nuevo', name: 'nuevo_usuario', methods: ['POST'])]
    public function create(
        Request $request,
        UsuarioRepository $usuarioRepository,
        UserPasswordHasherInterface $userPasswordHasher
    ): Response {

        if ($this->isGranted('ROLE_ADMIN')) {
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
        } else {
            return $this->render('usuario/accesDenied.html.twig');
        }
    }

    #[Route('/visualizar/{idUsuario}', name: 'usuario_show', methods: ['GET'])]
    public function show(UsuarioRepository $usuarioRepository, Usuario $usuario, string $idUsuario): Response
    {
        if ($usuario->getEstado() === 'N') {
            return $this->render('usuario/404.html.twig');
        } else {
            
            return $this->render('usuario/show.html.twig', [
                'usuario' => $usuario,
            ]);
        }
    }
    
}
