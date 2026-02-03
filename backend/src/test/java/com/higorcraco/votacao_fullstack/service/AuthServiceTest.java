package com.higorcraco.votacao_fullstack.service;

import java.util.Optional;
import java.util.Set;

import com.higorcraco.votacao_fullstack.domain.Usuario;
import com.higorcraco.votacao_fullstack.dto.LoginRequestDto;
import com.higorcraco.votacao_fullstack.exception.CpfInvalidoException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private Validator validator;

    @Mock
    private UsuarioService usuarioService;

    @InjectMocks
    private AuthService service;

    @Test
    void login_usuarioExiste() {
        LoginRequestDto loginRequestDto = new LoginRequestDto();
        loginRequestDto.setCpf("12345678901");

        when(validator.validate(loginRequestDto)).thenReturn(Set.of());
        when(usuarioService.findByCpf(loginRequestDto.getCpf())).thenReturn(Optional.of(new Usuario()));

        service.login(loginRequestDto);

        verify(validator).validate(loginRequestDto);
        verify(usuarioService).findByCpf(loginRequestDto.getCpf());
        verifyNoMoreInteractions(validator, usuarioService);
    }

    @Test
    void login_usuarioNaoExiste() {
        LoginRequestDto loginRequestDto = new LoginRequestDto();
        loginRequestDto.setCpf("12345678901");

        when(validator.validate(loginRequestDto)).thenReturn(Set.of());
        when(usuarioService.findByCpf(loginRequestDto.getCpf())).thenReturn(Optional.empty());
        when(usuarioService.create(loginRequestDto.getCpf())).thenReturn(new Usuario());

        service.login(loginRequestDto);

        verify(validator).validate(loginRequestDto);
        verify(usuarioService).findByCpf(loginRequestDto.getCpf());
        verify(usuarioService).create(loginRequestDto.getCpf());
        verifyNoMoreInteractions(validator, usuarioService);
    }

    @Test
    @SuppressWarnings("unchecked")
    void login_cpfInvalido() {
        LoginRequestDto loginRequestDto = new LoginRequestDto();
        loginRequestDto.setCpf("00000000000");

        when(validator.validate(loginRequestDto)).thenReturn(Set.of(mock(ConstraintViolation.class)));

        assertThatThrownBy(() -> service.login(loginRequestDto))
                .isInstanceOf(CpfInvalidoException.class);

        verify(validator).validate(loginRequestDto);
        verify(usuarioService, never()).findByCpf(any());
        verifyNoMoreInteractions(validator, usuarioService);
    }
}
