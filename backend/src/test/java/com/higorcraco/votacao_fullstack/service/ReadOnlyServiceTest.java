package com.higorcraco.votacao_fullstack.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.higorcraco.votacao_fullstack.domain.Usuario;
import com.higorcraco.votacao_fullstack.exception.NotFoundException;
import com.higorcraco.votacao_fullstack.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReadOnlyServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    private UsuarioService usuarioService;

    @BeforeEach
    void setUp() {
        usuarioService = new UsuarioService();
        ReflectionTestUtils.setField(usuarioService, "repository", usuarioRepository);
    }

    @Test
    void findById_quandoExiste() {
        UUID id = UUID.randomUUID();
        Usuario usuario = getUsuario(id);

        when(usuarioRepository.findById(id)).thenReturn(Optional.of(usuario));

        Usuario resultado = usuarioService.findById(id);

        assertThat(resultado).isNotNull();
        assertThat(resultado.getId()).isEqualTo(id);
        verify(usuarioRepository).findById(id);
    }

    @Test
    void findById_quandoNaoExiste() {
        UUID id = UUID.randomUUID();

        when(usuarioRepository.findById(id)).thenReturn(Optional.empty());

        Usuario resultado = usuarioService.findById(id);

        assertThat(resultado).isNull();
        verify(usuarioRepository).findById(id);
    }

    @Test
    void findByIdThrow_quandoExiste() {
        UUID id = UUID.randomUUID();
        Usuario usuario = getUsuario(id);

        when(usuarioRepository.findById(id)).thenReturn(Optional.of(usuario));

        Usuario resultado = usuarioService.findByIdThrow(id);

        assertThat(resultado).isNotNull();
        assertThat(resultado.getId()).isEqualTo(id);
        verify(usuarioRepository).findById(id);
    }

    @Test
    void findByIdThrow_quandoNaoExiste() {
        UUID id = UUID.randomUUID();

        when(usuarioRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> usuarioService.findByIdThrow(id))
                .isInstanceOf(NotFoundException.class);

        verify(usuarioRepository).findById(id);
    }

    @Test
    void findAll() {
        List<Usuario> usuarios = new ArrayList<>();
        usuarios.add(getUsuario(UUID.randomUUID()));
        usuarios.add(getUsuario(UUID.randomUUID()));

        when(usuarioRepository.findAll()).thenReturn(usuarios);

        List<Usuario> resultado = usuarioService.findAll();

        assertThat(resultado).isNotNull();
        assertThat(resultado).hasSize(2);
        verify(usuarioRepository).findAll();
    }

    @Test
    void findAll_comPaginacao() {
        PageRequest pageRequest = PageRequest.of(0, 10);
        List<Usuario> usuarios = new ArrayList<>();
        usuarios.add(getUsuario(UUID.randomUUID()));
        Page<Usuario> page = new PageImpl<>(usuarios, pageRequest, 1);

        when(usuarioRepository.findAll(any(PageRequest.class))).thenReturn(page);

        Page<Usuario> resultado = usuarioService.findAll(pageRequest);

        assertThat(resultado).isNotNull();
        assertThat(resultado.getContent()).hasSize(1);
        assertThat(resultado.getTotalElements()).isEqualTo(1);
        verify(usuarioRepository).findAll(pageRequest);
    }

    private Usuario getUsuario(UUID id) {
        Usuario usuario = new Usuario();
        usuario.setId(id);
        usuario.setCpf("12345678901");
        return usuario;
    }
}

