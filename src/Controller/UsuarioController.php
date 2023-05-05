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
    public function __construct(
        private UsuarioRepository $usuarioRepository,
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $userPasswordHasher
    ) {
        $this->usuarioRepository = $usuarioRepository;
        $this->entityManager = $entityManager;
        $this->userPasswordHasher = $userPasswordHasher;
    }

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
    public function getUsuarios(): Response
    {
        if ($this->isGranted('ROLE_ADMIN') || $this->isGranted('ROLE_LIMPIEZA')) {
            $usuarios = $this->entityManager
                ->getRepository(Usuario::class)
                ->buscarUsuario();

            return $this->json($usuarios);
        } else {
            return $this->render('usuario/accesDenied.html.twig');
        }
    }
    #[Route('/nuevo', name: 'nuevo_usuario', methods: ['POST'])]
    public function create(
        Request $request
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
                $this->userPasswordHasher->hashPassword(
                    $usuarioNew,
                    $data['clave']
                )
            );
            $usuarioNew->setRoles($data['roles']);
            $usuarioNew->setEstado($data['estado']);

            $this->usuarioRepository->save($usuarioNew, true);


            return $this->json($usuarioNew);
        } else {
            return $this->render('usuario/accesDenied.html.twig');
        }
    }

    #[Route('/editar/{id}', name: 'editar_usuario', methods: ['GET'])]
    public function editarUsuario(Usuario $usuario): Response
    {
        if ($this->isGranted('ROLE_ADMIN')) {

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
        Usuario $usuario
    ): Response {

        if ($this->isGranted('ROLE_ADMIN')) {

            $jsonString = $request->getContent();
            $data = json_decode($jsonString, true);

            foreach ([
                'nombre',
                'apellido',
                'correo',
                'roles',
                'estado',
            ] as $field) {
                if (isset($data[$field]) && !empty($data[$field])) {
                    switch ($field) {
                        case 'nombre':
                            $usuario->setNombre($data['nombre']);
                            break;
                        case 'apellido':
                            $usuario->setApellido($data['apellido']);
                            break;
                        case 'correo':
                            $usuario->setCorreo($data['correo']);
                            break;
                        case 'roles':
                            $usuario->setRoles($data['roles']);
                            break;
                        case 'estado':
                            $usuario->setEstado($data['estado']);
                            break;
                    }
                }
            }

            $this->usuarioRepository->save($usuario, true);

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
        Usuario $usuario,
        Request $request
    ): Response {

        $jsonString = $request->getContent();
        $data = json_decode($jsonString, true);

        $claveVerificar = $this->userPasswordHasher->isPasswordValid($usuario, $data['clave']);
        if ($claveVerificar) {
            $usuario->setClave(
                $this->userPasswordHasher->hashPassword(
                    $usuario,
                    $data['claveNueva']
                )
            );
            $this->usuarioRepository->save($usuario, true);
            return $this->json($usuario);
        } else {
            $error = [
                "msg" => "contrasenia incorrecta"
            ];
            return $this->json($error)->setStatusCode(400, "Contrasenia incorrecta");
        }
    }

    #[Route('/{idUsuario}/delete', name: 'delete_usuario', methods: ['PUT'])]
    public function deleteUsuarios(Usuario $usuario): Response
    {
        if ($this->isGranted('ROLE_ADMIN')) {

            $usuario->setEstado('N');

            $this->usuarioRepository->save($usuario, true);

            return $this->json($usuario);
        } else {
            $error = [
                "msg" => "no tienes permiso para hacer esto"
            ];
            return $this->json($error)->setStatusCode(400, "No tienes permiso para hacer esto");
        }
    }


    #[Route('/visualizar/{idUsuario}', name: 'usuario_show', methods: ['GET'])]
    public function show(Usuario $usuario): Response
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
