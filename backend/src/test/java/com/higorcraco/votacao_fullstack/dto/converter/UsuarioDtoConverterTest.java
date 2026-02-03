package com.higorcraco.votacao_fullstack.dto.converter;

import java.util.UUID;

import com.higorcraco.votacao_fullstack.domain.Usuario;
import com.higorcraco.votacao_fullstack.dto.UsuarioDto;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class UsuarioDtoConverterTest {

    private final UsuarioDtoConverter usuarioDtoConverter = new UsuarioDtoConverter();;

    @Test
    void from() {
        Usuario usuario = getUsuario();

        UsuarioDto resultado = usuarioDtoConverter.from(usuario);

        assertThat(resultado).isNotNull();
        assertThat(resultado.getId()).isEqualTo(usuario.getId());
        assertThat(resultado.getCpf()).isEqualTo(usuario.getCpf());
    }

    @Test
    void from_quandoEntityEhNula() {
        UsuarioDto resultado = usuarioDtoConverter.from(null);

        assertThat(resultado).isNull();
    }

    private Usuario getUsuario() {
        Usuario usuario = new Usuario();
        usuario.setId(UUID.randomUUID());
        usuario.setCpf("12345678901");
        return usuario;
    }
}
