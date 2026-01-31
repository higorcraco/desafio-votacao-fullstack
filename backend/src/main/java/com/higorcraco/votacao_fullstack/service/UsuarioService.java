package com.higorcraco.votacao_fullstack.service;

import java.util.UUID;

import com.higorcraco.votacao_fullstack.domain.Usuario;
import com.higorcraco.votacao_fullstack.exception.NotFoundException;
import com.higorcraco.votacao_fullstack.repository.UsuarioRepository;
import org.springframework.stereotype.Service;


@Service
public class UsuarioService extends ReadOnlyService<Usuario, UUID> {

    public Usuario create(String cpf) {
        Usuario usuario = new Usuario();
        usuario.setCpf(cpf);

        return getRepository().saveAndFlush(usuario);
    }

    public Usuario findByCpf(String cpf) {
        return getRepository(UsuarioRepository.class)
                .findByCpf(cpf).orElseThrow(() -> new NotFoundException("Usuário", "cpf", cpf));
    }
}
