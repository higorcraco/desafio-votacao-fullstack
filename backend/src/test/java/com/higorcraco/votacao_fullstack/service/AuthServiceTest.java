package com.higorcraco.votacao_fullstack.service;

import java.util.Optional;

import com.higorcraco.votacao_fullstack.domain.Usuario;
import com.higorcraco.votacao_fullstack.dto.LoginRequestDto;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UsuarioService usuarioService;

    @InjectMocks
    private AuthService service;

    @Test
    void login_usuarioExiste() {
        when(usuarioService.findByCpf(any())).thenReturn(Optional.of(new Usuario()));

        LoginRequestDto loginRequestDto = new LoginRequestDto();
        loginRequestDto.setCpf("00000000000");

        service.login(loginRequestDto);

        verify(usuarioService).findByCpf(loginRequestDto.getCpf());
        verifyNoMoreInteractions(usuarioService);
    }

    @Test
    void login_usuarioNaoExiste() {
        when(usuarioService.findByCpf(any())).thenReturn(Optional.empty());
        when(usuarioService.create(any())).thenReturn(new Usuario());

        LoginRequestDto loginRequestDto = new LoginRequestDto();
        loginRequestDto.setCpf("00000000000");

        service.login(loginRequestDto);

        verify(usuarioService).findByCpf(loginRequestDto.getCpf());
        verify(usuarioService).create(loginRequestDto.getCpf());
        verifyNoMoreInteractions(usuarioService);
    }
}