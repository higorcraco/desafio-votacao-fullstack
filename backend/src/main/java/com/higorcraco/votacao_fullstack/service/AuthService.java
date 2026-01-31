package com.higorcraco.votacao_fullstack.service;

import java.util.Optional;

import com.higorcraco.votacao_fullstack.domain.Usuario;
import com.higorcraco.votacao_fullstack.dto.LoginRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class AuthService {

    private final UsuarioService usuarioService;

    public Usuario login(LoginRequestDto loginRequest) {
        Optional<Usuario> usuario = usuarioService.findByCpf(loginRequest.getCpf());

        return usuario.orElseGet(() -> usuarioService.create(loginRequest.getCpf()));
    }
}
