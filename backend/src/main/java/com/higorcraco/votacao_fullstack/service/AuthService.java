package com.higorcraco.votacao_fullstack.service;

import java.util.Optional;

import com.higorcraco.votacao_fullstack.domain.Usuario;
import com.higorcraco.votacao_fullstack.dto.LoginRequestDto;
import com.higorcraco.votacao_fullstack.exception.CpfInvalidoException;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class AuthService {

    private final Validator validator;

    private final UsuarioService usuarioService;

    public Usuario login(LoginRequestDto loginRequest) {
        if (!validator.validate(loginRequest).isEmpty()) {
            throw new CpfInvalidoException();
        }

        Optional<Usuario> usuario = usuarioService.findByCpf(loginRequest.getCpf());

        return usuario.orElseGet(() -> usuarioService.create(loginRequest.getCpf()));
    }
}
